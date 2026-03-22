'use server'

import { adminAction, moderatorAction, authAction, publicAction, type ActionResult } from './index'
import { checkOwnerOrModeratorPermission, throwPermissionError } from './permissions'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { InsertTables, UpdateTables, Post, Comment } from '@/types/database'

type PostInsert = InsertTables<'posts'>
type PostUpdate = UpdateTables<'posts'>
type CommentInsert = InsertTables<'comments'>
type CommentUpdate = UpdateTables<'comments'>

// ==================== Posts ====================

/**
 * 게시글 생성 (인증 필요)
 */
export async function createPost(
  data: Omit<PostInsert, 'author_id'>
): Promise<ActionResult<Post>> {
  return authAction(async (supabase, userId) => {
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        ...data,
        author_id: userId
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return post
  }, ['/community/free', '/community/vip'])
}

/**
 * 게시글 수정 (작성자 또는 Admin)
 */
export async function updatePost(
  id: number,
  data: PostUpdate
): Promise<ActionResult<Post>> {
  return authAction(async (supabase, userId) => {
    // 작성자 확인
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    // 작성자 또는 Moderator 권한 확인
    const permission = await checkOwnerOrModeratorPermission(supabase, userId, existingPost.author_id)
    if (!permission.hasPermission) throwPermissionError('수정')

    const { data: post, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return post
  }, ['/community/free', '/community/vip'])
}

/**
 * 게시글 삭제 (작성자 또는 Admin)
 */
export async function deletePost(
  id: number
): Promise<ActionResult<null>> {
  return authAction(async (supabase, userId) => {
    // Soft delete
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    // 작성자 또는 Moderator 권한 확인
    const permission = await checkOwnerOrModeratorPermission(supabase, userId, existingPost.author_id)
    if (!permission.hasPermission) throwPermissionError('삭제')

    // Service Role 클라이언트 사용 (RLS 우회)
    const serviceClient = createServiceRoleClient()
    const { error } = await serviceClient
      .from('posts')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) throw new Error(error.message)
    return null
  }, ['/community/free', '/community/vip'])
}

/**
 * 게시글 목록 조회 (공개) - 검색 및 페이지네이션 지원
 */
export async function getPosts(options: {
  boardType: 'free' | 'vip' | 'anonymous' | 'recommend' | 'meme' | 'report'
  page?: number
  limit?: number
  searchQuery?: string
  searchType?: 'all' | 'title' | 'author'
  headerTag?: string | null
}): Promise<ActionResult<{ data: (Post & { author_nickname?: string })[]; count: number }>> {
  return publicAction(async (supabase) => {
    const { boardType, page = 1, limit = 20, searchQuery, searchType = 'all', headerTag } = options
    const from = (page - 1) * limit
    const to = from + limit - 1

    // 기본 쿼리
    let query = supabase
      .from('posts')
      .select('*, profiles!author_id(nickname)', { count: 'exact' })
      .eq('board_type', boardType)
      .eq('is_deleted', false)

    // 머리말 필터 적용
    if (headerTag) {
      query = query.eq('header_tag', headerTag)
    }

    // 검색 필터 적용
    if (searchQuery && searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim()

      if (searchType === 'title') {
        query = query.ilike('title', `%${trimmedQuery}%`)
      } else if (searchType === 'author') {
        // author 검색은 profiles 조인 후 nickname으로 검색
        // Supabase에서 조인된 테이블 필터링은 제한적이므로
        // 먼저 닉네임으로 프로필 ID를 조회 후 필터링
        const { data: matchingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .ilike('nickname', `%${trimmedQuery}%`)

        if (matchingProfiles && matchingProfiles.length > 0) {
          const authorIds = matchingProfiles.map(p => p.id)
          query = query.in('author_id', authorIds)
        } else {
          // 매칭되는 작성자 없으면 빈 결과 반환
          return { data: [], count: 0 }
        }
      } else {
        // 'all': 제목 또는 작성자로 검색
        // 먼저 제목으로 검색
        const { data: matchingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .ilike('nickname', `%${trimmedQuery}%`)

        if (matchingProfiles && matchingProfiles.length > 0) {
          const authorIds = matchingProfiles.map(p => p.id)
          query = query.or(`title.ilike.%${trimmedQuery}%,author_id.in.(${authorIds.join(',')})`)
        } else {
          query = query.ilike('title', `%${trimmedQuery}%`)
        }
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    // profiles 정보 포함하여 반환
    const postsWithAuthor = (data || []).map(post => {
      const profile = post.profiles as { nickname?: string } | null
      return {
        ...post,
        author_nickname: profile?.nickname || '알 수 없음',
        profiles: undefined // 중복 데이터 제거
      }
    })

    return { data: postsWithAuthor, count: count || 0 }
  })
}

/**
 * BEST 게시글 조회 (주간/월간 추천순)
 */
export async function getBestPosts(options: {
  boardType: 'free' | 'vip' | 'anonymous' | 'recommend' | 'meme' | 'report'
  period: 'weekly' | 'monthly'
  limit?: number
}): Promise<ActionResult<(Post & { author_nickname?: string })[]>> {
  return publicAction(async (supabase) => {
    const { boardType, period, limit = 5 } = options

    const now = new Date()
    const startDate = new Date(now)
    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7)
    } else {
      startDate.setMonth(now.getMonth() - 1)
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles!author_id(nickname)')
      .eq('board_type', boardType)
      .eq('is_deleted', false)
      .gte('created_at', startDate.toISOString())
      .gt('like_count', 0)
      .order('like_count', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)

    return (data || []).map(post => {
      const profile = post.profiles as { nickname?: string } | null
      return {
        ...post,
        author_nickname: profile?.nickname || '알 수 없음',
        profiles: undefined,
      }
    })
  })
}

/**
 * 게시글 상세 조회 (공개)
 */
export async function getPostById(
  id: number
): Promise<ActionResult<Post | null>> {
  return publicAction(async (supabase) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error) throw new Error(error.message)

    if (data) {
      await incrementViewCount(id)
    }

    return data
  })
}

/**
 * 게시글 조회수 증가 (Service Role로 RLS 우회)
 */
export async function incrementViewCount(
  postId: number
): Promise<ActionResult<null>> {
  return publicAction(async () => {
    const serviceClient = createServiceRoleClient()
    const { data: post } = await serviceClient
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single()

    if (post) {
      await serviceClient
        .from('posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', postId)
    }
    return null
  })
}

/**
 * 좋아요 토글 (인증 필요, Service Role로 like_count 동기화)
 */
export async function toggleLike(
  postId: number
): Promise<ActionResult<{ liked: boolean; likeCount: number }>> {
  return authAction(async (supabase, userId) => {
    const serviceClient = createServiceRoleClient()

    // 현재 좋아요 상태 확인
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // 좋아요 취소
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
    } else {
      // 좋아요 추가
      await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId })
    }

    // like_count 동기화 (Service Role로 RLS 우회)
    const { count } = await serviceClient
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    const likeCount = count ?? 0
    await serviceClient
      .from('posts')
      .update({ like_count: likeCount })
      .eq('id', postId)

    return { liked: !existing, likeCount }
  })
}

// ==================== Comments ====================

/**
 * 댓글 생성 (인증 필요)
 */
export async function createComment(
  data: Omit<CommentInsert, 'author_id'>
): Promise<ActionResult<Comment>> {
  return authAction(async (supabase, userId) => {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        ...data,
        author_id: userId
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // 댓글 수 증가 (Service Role로 RLS 우회)
    try {
      const serviceClient = createServiceRoleClient()
      const { data: post } = await serviceClient
        .from('posts')
        .select('comment_count')
        .eq('id', data.post_id)
        .single()

      if (post) {
        await serviceClient
          .from('posts')
          .update({ comment_count: (post.comment_count || 0) + 1 })
          .eq('id', data.post_id)
      }
    } catch {
      // 무시
    }

    return comment
  })
}

/**
 * 댓글 수정 (작성자 또는 Admin)
 */
export async function updateComment(
  id: number,
  data: CommentUpdate
): Promise<ActionResult<Comment>> {
  return authAction(async (supabase, userId) => {
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    // 작성자 또는 Moderator 권한 확인
    const permission = await checkOwnerOrModeratorPermission(supabase, userId, existingComment.author_id)
    if (!permission.hasPermission) throwPermissionError('수정')

    const { data: comment, error } = await supabase
      .from('comments')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return comment
  })
}

/**
 * 댓글 삭제 (작성자 또는 Admin)
 */
export async function deleteComment(
  id: number
): Promise<ActionResult<null>> {
  return authAction(async (supabase, userId) => {
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('author_id, post_id')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)

    // 작성자 또는 Moderator 권한 확인
    const permission = await checkOwnerOrModeratorPermission(supabase, userId, existingComment.author_id)
    if (!permission.hasPermission) throwPermissionError('삭제')

    // Service Role 클라이언트 사용 (RLS 우회)
    const serviceClient = createServiceRoleClient()
    const { error } = await serviceClient
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) throw new Error(error.message)

    // 댓글 수 감소
    try {
      const { data: post } = await serviceClient
        .from('posts')
        .select('comment_count')
        .eq('id', existingComment.post_id)
        .single()

      if (post && post.comment_count > 0) {
        await serviceClient
          .from('posts')
          .update({ comment_count: post.comment_count - 1 })
          .eq('id', existingComment.post_id)
      }
    } catch {
      // 무시
    }

    return null
  })
}

/**
 * 게시글의 댓글 목록 조회 (공개)
 */
export async function getCommentsByPostId(
  postId: number
): Promise<ActionResult<Comment[]>> {
  return publicAction(async (supabase) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  })
}

// ==================== Admin Only ====================

/**
 * 게시글 복수 삭제 (관리자 또는 작성자)
 */
export async function deleteMultiplePosts(
  ids: number[]
): Promise<ActionResult<{ deleted: number; failed: number }>> {
  return authAction(async (supabase, userId) => {
    // 사용자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    const isModerator = profile && ['admin', 'superadmin', 'moderator'].includes(profile.role)

    // Service Role 클라이언트 생성 (RLS 우회)
    const serviceClient = createServiceRoleClient()

    let deleted = 0
    let failed = 0

    for (const id of ids) {
      // 게시글 조회
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', id)
        .single()

      if (fetchError || !post) {
        failed++
        continue
      }

      // 권한 확인: 작성자 또는 관리자만 삭제 가능
      if (post.author_id !== userId && !isModerator) {
        failed++
        continue
      }

      // Soft delete (Service Role 사용하여 RLS 우회)
      const { error } = await serviceClient
        .from('posts')
        .update({ is_deleted: true })
        .eq('id', id)

      if (error) {
        failed++
      } else {
        deleted++
      }
    }

    return { deleted, failed }
  }, ['/community/free', '/community/vip'])
}

/**
 * 게시글 강제 삭제 (Moderator+ - Hard Delete)
 * CLAUDE.md §17: /admin/posts - moderator+
 */
export async function hardDeletePost(
  id: number
): Promise<ActionResult<null>> {
  return moderatorAction(async (supabase) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return null
  }, ['/admin/posts', '/community/free', '/community/vip'])
}

/**
 * 게시글 복구 (Moderator+)
 * CLAUDE.md §17: /admin/posts - moderator+
 */
export async function restorePost(
  id: number
): Promise<ActionResult<Post>> {
  return moderatorAction(async (supabase) => {
    const { data: post, error } = await supabase
      .from('posts')
      .update({ is_deleted: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return post
  }, ['/admin/posts', '/community/free', '/community/vip'])
}
