-- goods 테이블 생성 + 샘플 데이터
-- Supabase Dashboard SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS goods (
  id serial PRIMARY KEY,
  name text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  image_url text NOT NULL,
  description text,
  detail_image_url text,
  purchase_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS 활성화 + 공개 읽기 정책
ALTER TABLE goods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goods_public_read" ON goods FOR SELECT USING (true);

-- 샘플 상품 1개 삽입
INSERT INTO goods (name, price, image_url, description, detail_image_url, purchase_url, is_active)
VALUES (
  'INOLABEL 공식 로고 머그컵',
  15000,
  '/assets/logo/inolabel_logo.png',
  'INOLABEL 공식 로고가 새겨진 프리미엄 머그컵입니다. 350ml 용량으로 일상 속에서 INOLABEL의 감성을 느껴보세요.',
  '/assets/logo/inolabel_logo.png',
  NULL,
  true
);
