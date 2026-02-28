-- 1. starcraft_tier_members에 soop_id 컬럼 추가
ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS soop_id TEXT;

-- 2. site_settings 테이블 생성 (key-value 설정 저장)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- site_settings RLS 설정
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'site_settings_read_all' AND tablename = 'site_settings') THEN
    CREATE POLICY "site_settings_read_all" ON site_settings FOR SELECT USING (true);
  END IF;
END $$;

-- admin/superadmin만 수정 가능
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'site_settings_update_admin' AND tablename = 'site_settings') THEN
    CREATE POLICY "site_settings_update_admin" ON site_settings FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'superadmin')
      )
    );
  END IF;
END $$;

-- 초기 설정값 삽입
INSERT INTO site_settings (key, value) VALUES
  ('goods_shop_visible', 'true')
ON CONFLICT (key) DO NOTHING;

-- 확인
SELECT 'soop_id added' AS result FROM information_schema.columns
WHERE table_name = 'starcraft_tier_members' AND column_name = 'soop_id';

SELECT * FROM site_settings;
