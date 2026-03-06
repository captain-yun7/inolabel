-- 방문자 활동 추적 테이블
-- 관리자 대시보드에서 "오늘 활동 인원" 표시용
CREATE TABLE IF NOT EXISTS user_activity_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 날짜별 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_activity_created ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_user_created ON user_activity_log(user_id, created_at);

-- RLS 활성화
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- 로그인 사용자만 자신의 활동 기록 삽입 가능
CREATE POLICY "Users can insert own activity"
  ON user_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 관리자만 조회 가능
CREATE POLICY "Admins can read all activity"
  ON user_activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- 7일 이전 데이터 자동 정리용 (선택사항 - cron으로 실행)
-- DELETE FROM user_activity_log WHERE created_at < now() - interval '7 days';
