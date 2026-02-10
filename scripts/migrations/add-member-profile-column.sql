-- organization 테이블에 member_profile 컬럼 추가
-- 실행 방법: Supabase Dashboard > SQL Editor에서 실행

-- 1. member_profile 컬럼 추가 (JSONB 타입)
ALTER TABLE organization
ADD COLUMN IF NOT EXISTS member_profile JSONB DEFAULT NULL;

-- 2. 컬럼에 코멘트 추가
COMMENT ON COLUMN organization.member_profile IS '멤버 개인 정보 (MBTI, 혈액형, 키, 몸무게, 생일 등)';

-- 3. 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'organization'
ORDER BY ordinal_position;
