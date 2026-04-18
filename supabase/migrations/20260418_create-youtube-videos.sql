-- YouTube 영상 캐시 테이블
-- 채널 RSS에서 주기적으로 동기화 (cron: 3시간 1회)
-- /api/youtube/shorts에서 이 테이블을 조회

CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id BIGSERIAL PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  channel_id TEXT NOT NULL,
  channel_title TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'shorts')),
  title TEXT NOT NULL,
  thumbnail TEXT,
  view_count BIGINT DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 정렬/필터 인덱스
CREATE INDEX IF NOT EXISTS idx_youtube_videos_type_published
  ON public.youtube_videos(content_type, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_youtube_videos_channel_published
  ON public.youtube_videos(channel_id, published_at DESC);

-- RLS: 공개 읽기, 서비스 롤만 쓰기
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_public" ON public.youtube_videos;
CREATE POLICY "select_public" ON public.youtube_videos
  FOR SELECT USING (true);
