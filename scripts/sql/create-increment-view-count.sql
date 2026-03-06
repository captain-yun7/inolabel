-- 게시글 조회수 원자적 증가 RPC 함수
-- race condition 방지: view_count = view_count + 1 (read-modify-write 대신)
CREATE OR REPLACE FUNCTION increment_view_count(p_post_id bigint)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE posts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = p_post_id;
$$;

-- anon/authenticated 모두 호출 가능
GRANT EXECUTE ON FUNCTION increment_view_count(bigint) TO anon, authenticated;
