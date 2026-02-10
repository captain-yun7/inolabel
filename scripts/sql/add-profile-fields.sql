-- profiles 테이블에 이름, 숲TV 아이디 컬럼 추가
-- Supabase Dashboard > SQL Editor에서 실행

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS soop_id TEXT;

COMMENT ON COLUMN profiles.full_name IS '사용자 실명';
COMMENT ON COLUMN profiles.soop_id IS '숲TV 아이디';
