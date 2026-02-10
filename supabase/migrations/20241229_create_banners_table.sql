-- RG Family: Banners Table Migration
-- 메인 페이지 슬라이드 배너 관리를 위한 테이블

-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE public.banners IS '메인 페이지 슬라이드 배너';

-- Add comments to columns
COMMENT ON COLUMN public.banners.title IS '배너 제목 (선택)';
COMMENT ON COLUMN public.banners.image_url IS '배너 이미지 URL (필수)';
COMMENT ON COLUMN public.banners.link_url IS '클릭 시 이동할 링크 URL (선택)';
COMMENT ON COLUMN public.banners.display_order IS '표시 순서 (낮을수록 먼저 표시)';
COMMENT ON COLUMN public.banners.is_active IS '활성화 여부';

-- Create index for active banners ordered by display_order
CREATE INDEX IF NOT EXISTS idx_banners_active_order
ON public.banners (is_active, display_order)
WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access for active banners
CREATE POLICY "Allow public read access for active banners"
ON public.banners
FOR SELECT
USING (is_active = true);

-- Policy: Allow admin full access
CREATE POLICY "Allow admin full access to banners"
ON public.banners
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'super_admin')
  )
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION update_banners_updated_at();

-- Insert sample data (optional)
INSERT INTO public.banners (title, image_url, link_url, display_order, is_active)
VALUES
  ('RG 패밀리 시즌 5 오픈!', 'https://placehold.co/1200x400/fd68ba/ffffff?text=Season+5+Open', 'https://sooplive.co.kr', 1, true),
  ('연말 이벤트 안내', 'https://placehold.co/1200x400/8b5cf6/ffffff?text=Year+End+Event', NULL, 2, true),
  ('신규 가입 혜택', 'https://placehold.co/1200x400/22c55e/ffffff?text=New+Member+Benefits', NULL, 3, true)
ON CONFLICT DO NOTHING;
