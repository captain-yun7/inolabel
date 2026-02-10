-- Episodes table for episode-based VIP system
-- Each season has multiple episodes, with some marked as "rank battles" (직급전)

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
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

-- Add episode_id column to donations table
ALTER TABLE donations
ADD COLUMN IF NOT EXISTS episode_id INT REFERENCES episodes(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_episodes_is_rank_battle ON episodes(is_rank_battle);
CREATE INDEX IF NOT EXISTS idx_donations_episode_id ON donations(episode_id);

-- Enable RLS
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for episodes
CREATE POLICY "Everyone can view episodes"
  ON episodes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage episodes"
  ON episodes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Function to get episode rankings (Top 50 for VIP)
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

-- Function to check if user is VIP for a specific episode
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

-- Function to check if user is VIP for any rank battle in a season
CREATE OR REPLACE FUNCTION is_vip_for_rank_battles(
  p_user_id UUID,
  p_season_id INT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  episode_rec RECORD;
  target_season_id INT;
BEGIN
  -- Get active season if not specified
  IF p_season_id IS NULL THEN
    SELECT id INTO target_season_id
    FROM seasons
    WHERE is_active = true
    LIMIT 1;
  ELSE
    target_season_id := p_season_id;
  END IF;

  -- Check each rank battle episode
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

-- Sample data (uncomment to insert test episodes)
-- INSERT INTO episodes (season_id, episode_number, title, broadcast_date, is_rank_battle) VALUES
-- (1, 1, '시즌1 1회', '2025-01-01 20:00:00+09', false),
-- (1, 2, '시즌1 직급전 1차', '2025-01-08 20:00:00+09', true),
-- (1, 3, '시즌1 3회', '2025-01-15 20:00:00+09', false),
-- (1, 4, '시즌1 직급전 2차', '2025-01-22 20:00:00+09', true);

COMMENT ON TABLE episodes IS '방송 회차 테이블 - 시즌별 에피소드 관리, 직급전(is_rank_battle) 회차 기준으로 VIP 판단';
COMMENT ON COLUMN episodes.is_rank_battle IS '직급전 여부 - true인 회차의 Top 50 후원자가 VIP 자격 획득';
COMMENT ON FUNCTION get_episode_rankings IS '특정 회차의 후원 랭킹 조회 (기본 Top 50)';
COMMENT ON FUNCTION is_vip_for_episode IS '특정 회차에서 유저가 VIP인지 확인';
COMMENT ON FUNCTION is_vip_for_rank_battles IS '시즌 내 직급전 회차 중 하나라도 VIP이면 true 반환';
