-- 스타크래프트 티어표 테이블 생성
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 티어 테이블
CREATE TABLE IF NOT EXISTS starcraft_tiers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INT NOT NULL,
  color TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 티어 멤버 테이블
CREATE TABLE IF NOT EXISTS starcraft_tier_members (
  id SERIAL PRIMARY KEY,
  tier_id INT NOT NULL REFERENCES starcraft_tiers(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  race TEXT CHECK (race IN ('terran', 'zerg', 'protoss')),
  image_url TEXT,
  description TEXT,
  position_order INT DEFAULT 0,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_starcraft_tier_members_tier
  ON starcraft_tier_members(tier_id);

CREATE INDEX IF NOT EXISTS idx_starcraft_tier_members_order
  ON starcraft_tier_members(tier_id, position_order);

-- 테이블 설명
COMMENT ON TABLE starcraft_tiers IS '스타크래프트 티어 목록 (16단계)';
COMMENT ON TABLE starcraft_tier_members IS '스타크래프트 티어별 멤버';

-- 3. RLS 정책
ALTER TABLE starcraft_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE starcraft_tier_members ENABLE ROW LEVEL SECURITY;

-- 티어 테이블: 누구나 조회 가능
CREATE POLICY "starcraft_tiers_select_all"
  ON starcraft_tiers FOR SELECT
  USING (true);

-- 티어 멤버 테이블: 누구나 조회 가능
CREATE POLICY "starcraft_tier_members_select_all"
  ON starcraft_tier_members FOR SELECT
  USING (true);

-- 티어 멤버 테이블: moderator 이상만 추가/수정/삭제
CREATE POLICY "starcraft_tier_members_insert_moderator"
  ON starcraft_tier_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('moderator', 'admin', 'superadmin')
    )
  );

CREATE POLICY "starcraft_tier_members_update_moderator"
  ON starcraft_tier_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('moderator', 'admin', 'superadmin')
    )
  );

CREATE POLICY "starcraft_tier_members_delete_moderator"
  ON starcraft_tier_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('moderator', 'admin', 'superadmin')
    )
  );

-- 4. 초기 티어 데이터 삽입 (16단계)
INSERT INTO starcraft_tiers (name, display_order, color) VALUES
  ('갓티어', 1, '#FF0000'),
  ('킹티어', 2, '#FF4500'),
  ('잭티어', 3, '#FF8C00'),
  ('조커티어', 4, '#FFD700'),
  ('스페이드티어', 5, '#32CD32'),
  ('0티어', 6, '#00CED1'),
  ('1티어', 7, '#1E90FF'),
  ('2티어', 8, '#4169E1'),
  ('3티어', 9, '#6A5ACD'),
  ('4티어', 10, '#8A2BE2'),
  ('5티어', 11, '#9370DB'),
  ('6티어', 12, '#BA55D3'),
  ('7티어', 13, '#C71585'),
  ('8티어', 14, '#808080'),
  ('베이비티어', 15, '#A9A9A9'),
  ('티어없음', 16, '#555555')
ON CONFLICT DO NOTHING;
