-- 게시판 성능 최적화 인덱스
-- Supabase Dashboard SQL Editor에서 실행
-- https://supabase.com/dashboard/project/cdiptfmagemjfmsuphaj/sql/new

-- =============================================
-- 1. posts 테이블 인덱스
-- =============================================

-- 게시글 목록 조회 (board_type + is_deleted + created_at)
-- getPosts() 에서 매번 사용하는 기본 필터
CREATE INDEX IF NOT EXISTS idx_posts_board_list
  ON posts (board_type, is_deleted, created_at DESC);

-- BEST 게시글 조회 (like_count 정렬)
-- getBestPosts() 에서 주간/월간 인기글 조회
CREATE INDEX IF NOT EXISTS idx_posts_best
  ON posts (board_type, is_deleted, like_count DESC, created_at DESC);

-- 제목 검색용 trigram 인덱스 (ilike '%keyword%' 최적화)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_posts_title_trgm
  ON posts USING gin (title gin_trgm_ops);

-- 작성자별 게시글 조회
CREATE INDEX IF NOT EXISTS idx_posts_author
  ON posts (author_id, is_deleted, created_at DESC);

-- =============================================
-- 2. comments 테이블 인덱스
-- =============================================

-- 게시글별 댓글 조회
CREATE INDEX IF NOT EXISTS idx_comments_post
  ON comments (post_id, is_deleted, created_at ASC);

-- =============================================
-- 3. profiles 테이블 인덱스
-- =============================================

-- 닉네임 검색용 trigram 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_nickname_trgm
  ON profiles USING gin (nickname gin_trgm_ops);

-- =============================================
-- 4. organization 테이블 인덱스
-- =============================================

-- 활성 멤버 조회 (라이브 페이지, 조직도)
CREATE INDEX IF NOT EXISTS idx_organization_active
  ON organization (is_active, unit, position_order);

-- =============================================
-- 5. notices 테이블 인덱스
-- =============================================

CREATE INDEX IF NOT EXISTS idx_notices_pinned
  ON notices (is_pinned, display_order, created_at DESC);

-- =============================================
-- 6. live_status 테이블 인덱스
-- =============================================

CREATE INDEX IF NOT EXISTS idx_live_status_member
  ON live_status (member_id, is_live, last_checked DESC);
