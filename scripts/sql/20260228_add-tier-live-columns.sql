-- starcraft_tier_members 테이블에 라이브 상태 컬럼 추가
-- 기존 live_status 싱크는 organization(팬클럽 BJ)만 체크하므로,
-- 프로 스트리머(starcraft_tier_members)는 자체 라이브 컬럼이 필요함

ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT FALSE;
ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS live_title TEXT;
ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS live_thumbnail TEXT;
ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS viewer_count INTEGER DEFAULT 0;
ALTER TABLE starcraft_tier_members ADD COLUMN IF NOT EXISTS live_checked_at TIMESTAMPTZ;
