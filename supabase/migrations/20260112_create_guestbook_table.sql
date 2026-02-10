-- ================================================
-- 방명록 (Tribute Guestbook) 테이블
-- Top 3 후원자 헌정 페이지의 방명록 기능
-- ================================================

-- 방명록 테이블 생성
CREATE TABLE IF NOT EXISTS tribute_guestbook (
  id SERIAL PRIMARY KEY,
  -- 헌정 대상 (VIP 후원자)
  tribute_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- 방명록 작성자
  author_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,  -- 비회원도 작성 가능하게 닉네임 저장
  -- 방명록 내용
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  -- 메타데이터
  is_member BOOLEAN DEFAULT FALSE,  -- RG 멤버 작성 여부 (엑셀부/크루부)
  is_approved BOOLEAN DEFAULT TRUE, -- 관리자 승인 여부 (스팸 방지)
  is_deleted BOOLEAN DEFAULT FALSE,
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_guestbook_tribute_user
  ON tribute_guestbook(tribute_user_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at
  ON tribute_guestbook(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_author
  ON tribute_guestbook(author_id);

-- RLS (Row Level Security) 정책
ALTER TABLE tribute_guestbook ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 승인된 방명록 조회 가능
CREATE POLICY "guestbook_select_approved" ON tribute_guestbook
  FOR SELECT USING (is_approved = TRUE AND is_deleted = FALSE);

-- 인증된 사용자만 방명록 작성 가능
CREATE POLICY "guestbook_insert_authenticated" ON tribute_guestbook
  FOR INSERT WITH CHECK (auth.uid()::text = author_id);

-- 작성자 본인만 수정 가능
CREATE POLICY "guestbook_update_own" ON tribute_guestbook
  FOR UPDATE USING (auth.uid()::text = author_id)
  WITH CHECK (auth.uid()::text = author_id);

-- 작성자 본인 또는 관리자만 삭제 가능
CREATE POLICY "guestbook_delete_own_or_admin" ON tribute_guestbook
  FOR DELETE USING (
    auth.uid()::text = author_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()::text
      AND role IN ('admin', 'superadmin', 'moderator')
    )
  );

-- 관리자는 모든 방명록 관리 가능
CREATE POLICY "guestbook_admin_all" ON tribute_guestbook
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()::text
      AND role IN ('admin', 'superadmin')
    )
  );

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_guestbook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_guestbook_updated_at
  BEFORE UPDATE ON tribute_guestbook
  FOR EACH ROW
  EXECUTE FUNCTION update_guestbook_updated_at();

-- 코멘트 추가
COMMENT ON TABLE tribute_guestbook IS 'Top 3 후원자 헌정 페이지 방명록';
COMMENT ON COLUMN tribute_guestbook.tribute_user_id IS '헌정 대상 VIP 후원자 ID';
COMMENT ON COLUMN tribute_guestbook.author_id IS '방명록 작성자 ID (NULL이면 비회원)';
COMMENT ON COLUMN tribute_guestbook.author_name IS '작성자 표시 이름';
COMMENT ON COLUMN tribute_guestbook.message IS '방명록 메시지 (최대 500자)';
COMMENT ON COLUMN tribute_guestbook.is_member IS 'RG 멤버(엑셀부/크루부) 작성 여부';
COMMENT ON COLUMN tribute_guestbook.is_approved IS '관리자 승인 상태';
