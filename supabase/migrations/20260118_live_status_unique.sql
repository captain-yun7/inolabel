-- live_status 테이블에 (member_id, platform) unique constraint 추가
-- 생성일: 2026-01-18
-- 목적: Python Live Checker의 upsert를 위한 unique constraint

-- 기존 중복 데이터가 있을 수 있으므로 먼저 정리
DELETE FROM public.live_status a
USING public.live_status b
WHERE a.id > b.id
  AND a.member_id = b.member_id
  AND a.platform = b.platform;

-- Unique constraint 추가
ALTER TABLE public.live_status
  ADD CONSTRAINT live_status_member_platform_unique
  UNIQUE (member_id, platform);
