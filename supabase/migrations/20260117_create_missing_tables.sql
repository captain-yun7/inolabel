-- =============================================================================
-- RG Family - 누락된 테이블 생성
-- 실행일: 2026-01-17
-- 대상: episodes, timeline_events 테이블
-- =============================================================================

-- =============================================================================
-- 1. timeline_events 테이블
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.timeline_events (
  id SERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(50),
  season_id INT REFERENCES public.seasons(id) ON DELETE SET NULL,
  unit VARCHAR(10) CHECK (unit IN ('excel', 'crew')),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.timeline_events IS '팬덤 타임라인/역사';
COMMENT ON COLUMN public.timeline_events.category IS '카테고리: founding, event, milestone, member';

CREATE INDEX IF NOT EXISTS idx_timeline_date ON public.timeline_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_season ON public.timeline_events(season_id);

-- RLS 활성화
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자 조회 가능
DROP POLICY IF EXISTS "Everyone can view timeline_events" ON public.timeline_events;
CREATE POLICY "Everyone can view timeline_events"
  ON public.timeline_events FOR SELECT
  USING (true);

-- RLS 정책: 관리자만 수정 가능
DROP POLICY IF EXISTS "Admins can manage timeline_events" ON public.timeline_events;
CREATE POLICY "Admins can manage timeline_events"
  ON public.timeline_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- =============================================================================
-- 2. episodes 테이블
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.episodes (
  id SERIAL PRIMARY KEY,
  season_id INT NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  broadcast_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_rank_battle BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: one episode number per season
  UNIQUE(season_id, episode_number)
);

COMMENT ON TABLE public.episodes IS '방송 회차 테이블 - 시즌별 에피소드 관리, 직급전(is_rank_battle) 회차 기준으로 VIP 판단';
COMMENT ON COLUMN public.episodes.is_rank_battle IS '직급전 여부 - true인 회차의 Top 50 후원자가 VIP 자격 획득';

-- donations 테이블에 episode_id 컬럼 추가
ALTER TABLE public.donations
ADD COLUMN IF NOT EXISTS episode_id INT REFERENCES episodes(id) ON DELETE SET NULL;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON public.episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_episodes_is_rank_battle ON public.episodes(is_rank_battle);
CREATE INDEX IF NOT EXISTS idx_donations_episode_id ON public.donations(episode_id);

-- RLS 활성화
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자 조회 가능
DROP POLICY IF EXISTS "Everyone can view episodes" ON public.episodes;
CREATE POLICY "Everyone can view episodes"
  ON public.episodes FOR SELECT
  USING (true);

-- RLS 정책: 관리자만 수정 가능
DROP POLICY IF EXISTS "Admins can manage episodes" ON public.episodes;
CREATE POLICY "Admins can manage episodes"
  ON public.episodes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- =============================================================================
-- 3. 회차별 랭킹 함수
-- =============================================================================

-- 회차별 랭킹 조회 함수
CREATE OR REPLACE FUNCTION get_episode_rankings(
  p_episode_id INT,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  rank BIGINT,
  donor_id UUID,
  donor_name VARCHAR,
  total_amount BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY SUM(d.amount) DESC) as rank,
    d.donor_id::UUID,
    d.donor_name::VARCHAR,
    SUM(d.amount)::BIGINT as total_amount
  FROM donations d
  WHERE d.episode_id = p_episode_id
  GROUP BY d.donor_id, d.donor_name
  ORDER BY total_amount DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 특정 회차 VIP 여부 확인 함수
CREATE OR REPLACE FUNCTION is_vip_for_episode(
  p_user_id UUID,
  p_episode_id INT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_rank BIGINT;
BEGIN
  SELECT rank INTO user_rank
  FROM get_episode_rankings(p_episode_id, 50)
  WHERE donor_id = p_user_id;

  RETURN user_rank IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 시즌 내 직급전 VIP 여부 확인 함수
CREATE OR REPLACE FUNCTION is_vip_for_rank_battles(
  p_user_id UUID,
  p_season_id INT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  episode_rec RECORD;
  target_season_id INT;
BEGIN
  -- 시즌 미지정 시 활성 시즌 사용
  IF p_season_id IS NULL THEN
    SELECT id INTO target_season_id
    FROM seasons
    WHERE is_active = true
    LIMIT 1;
  ELSE
    target_season_id := p_season_id;
  END IF;

  -- 각 직급전 회차 확인
  FOR episode_rec IN
    SELECT id FROM episodes
    WHERE season_id = target_season_id
    AND is_rank_battle = true
  LOOP
    IF is_vip_for_episode(p_user_id, episode_rec.id) THEN
      RETURN true;
    END IF;
  END LOOP;

  RETURN false;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_episode_rankings IS '특정 회차의 후원 랭킹 조회 (기본 Top 50)';
COMMENT ON FUNCTION is_vip_for_episode IS '특정 회차에서 유저가 VIP인지 확인';
COMMENT ON FUNCTION is_vip_for_rank_battles IS '시즌 내 직급전 회차 중 하나라도 VIP이면 true 반환';

-- =============================================================================
-- 4. 샘플 데이터 (선택사항)
-- =============================================================================

-- 활성 시즌에 테스트 회차 추가
INSERT INTO public.episodes (season_id, episode_number, title, broadcast_date, is_rank_battle)
SELECT
  s.id,
  ep.episode_number,
  ep.title,
  ep.broadcast_date::TIMESTAMPTZ,
  ep.is_rank_battle
FROM seasons s
CROSS JOIN (
  VALUES
    (1, '1회 - 시즌 오프닝', '2026-01-01 20:00:00+09', false),
    (2, '2회 - 직급전 1차', '2026-01-08 20:00:00+09', true),
    (3, '3회 - 정규 방송', '2026-01-15 20:00:00+09', false)
) AS ep(episode_number, title, broadcast_date, is_rank_battle)
WHERE s.is_active = true
ON CONFLICT (season_id, episode_number) DO NOTHING;

-- =============================================================================
-- 완료!
-- =============================================================================
