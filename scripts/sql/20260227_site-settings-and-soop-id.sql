-- site_settings 테이블 생성 (사이트 설정 key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 초기 설정값
INSERT INTO site_settings (key, value) VALUES
  ('goods_shop_visible', '"true"')
ON CONFLICT (key) DO NOTHING;

-- starcraft_tier_members에 soop_id 컬럼 추가
ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS soop_id TEXT;

-- posts에 header_tag 컬럼 추가 (머릿말: 스타부/엑셀부)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS header_tag TEXT;
