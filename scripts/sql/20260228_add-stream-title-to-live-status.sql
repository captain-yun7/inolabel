-- live_status 테이블에 stream_title 컬럼 추가
-- 용도: 방송 제목을 저장하여 티어표 호버 시 표시
ALTER TABLE live_status ADD COLUMN IF NOT EXISTS stream_title TEXT DEFAULT NULL;
