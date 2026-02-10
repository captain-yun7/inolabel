-- comments 테이블에 is_anonymous 컬럼 추가
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false NOT NULL;

COMMENT ON COLUMN public.comments.is_anonymous IS '익명 댓글 여부';
