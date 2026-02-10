-- PandaTV URL을 ID만 저장하도록 변환
-- 생성일: 2026-01-18
-- 기존: {"pandatv": "https://www.pandalive.co.kr/play/hj042300"}
-- 변환: {"pandatv": "hj042300"}

UPDATE organization
SET social_links = jsonb_set(
  social_links,
  '{pandatv}',
  to_jsonb(
    regexp_replace(
      social_links->>'pandatv',
      '^https?://[^/]+/(?:play/)?',
      ''
    )
  )
)
WHERE social_links->>'pandatv' LIKE '%pandalive.co.kr%';
