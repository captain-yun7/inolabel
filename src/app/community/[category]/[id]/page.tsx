'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Eye, Calendar, User, MessageSquare, Send, Trash2, Edit, Heart } from 'lucide-react'
import { deletePost, deleteComment, incrementViewCount, createComment } from '@/lib/actions/posts'
import { useSupabaseContext, useAuthContext } from '@/lib/context'
import { formatDate } from '@/lib/utils/format'
import { renderContent } from '@/lib/utils/htmlContent'
import type { JoinedProfile } from '@/types/common'
import styles from './page.module.css'

interface PostDetail {
  id: number
  title: string
  content: string
  authorId: string
  authorName: string
  authorRealName?: string
  authorAvatar: string | null
  viewCount: number
  likeCount: number
  createdAt: string
  isAnonymous: boolean
}

interface Comment {
  id: number
  content: string
  authorId: string
  authorName: string
  authorRealName?: string
  authorAvatar: string | null
  isAnonymous: boolean
  createdAt: string
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category, id } = use(params)
  const router = useRouter()

  // ID가 유효한 숫자인지 검증
  const postId = parseInt(id)
  if (isNaN(postId) || postId <= 0) {
    notFound()
  }

  // category가 유효한 게시판 타입인지 검증
  const validCategories = ['free', 'vip', 'anonymous', 'recommend', 'meme', 'report']
  if (!validCategories.includes(category)) {
    notFound()
  }
  const supabase = useSupabaseContext()
  const { user, profile } = useAuthContext()
  const isAdmin = ['admin', 'superadmin', 'moderator'].includes(profile?.role ?? '')
  const [post, setPost] = useState<PostDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isAnonymousComment, setIsAnonymousComment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // 삭제 권한 확인 (작성자 또는 관리자)
  const canDelete = user && post && (user.id === post.authorId || isAdmin)
  const canEdit = user && post && user.id === post.authorId

  const fetchPost = useCallback(async () => {
    setIsLoading(true)

    // 게시글 조회
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('*, profiles!author_id(id, nickname, avatar_url)')
      .eq('id', postId)
      .single()

    if (postError || !postData) {
      console.error('게시글 로드 실패:', postError)
      setIsLoading(false)
      return
    }

    // 조회수 증가 (Server Action으로 service role 사용)
    incrementViewCount(postId)

    const postProfile = postData.profiles as JoinedProfile | null
    const isAnonymous = Boolean(postData.is_anonymous)
    const realNickname = postProfile?.nickname || '알 수 없음'
    setPost({
      id: postData.id,
      title: postData.title,
      content: postData.content || '',
      authorId: postData.author_id,
      authorName: isAnonymous ? '익명' : realNickname,
      authorRealName: isAnonymous ? realNickname : undefined,
      authorAvatar: !isAnonymous || isAdmin ? (postProfile?.avatar_url || null) : null,
      viewCount: (postData.view_count || 0) + 1,
      likeCount: postData.like_count || 0,
      createdAt: postData.created_at,
      isAnonymous,
    })
    setLikeCount(postData.like_count || 0)

    // 현재 유저의 좋아요 여부 확인
    if (user) {
      const { data: likeData } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()
      setIsLiked(!!likeData)
    }

    // 댓글 조회
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*, profiles!author_id(id, nickname, avatar_url)')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    setComments(
      (commentsData || []).map((c) => {
        const commentProfile = c.profiles as JoinedProfile | null
        const commentAnonymous = Boolean(c.is_anonymous)
        const realNickname = commentProfile?.nickname || '알 수 없음'
        return {
          id: c.id,
          content: c.content,
          authorId: c.author_id,
          authorName: commentAnonymous ? '익명' : realNickname,
          authorRealName: commentAnonymous ? realNickname : undefined,
          authorAvatar: commentAnonymous ? null : (commentProfile?.avatar_url || null),
          isAnonymous: commentAnonymous,
          createdAt: c.created_at,
        }
      })
    )

    setIsLoading(false)
  }, [supabase, postId, user, isAdmin])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)

    const result = await createComment({
      post_id: postId,
      content: newComment.trim(),
      is_anonymous: isAnonymousComment,
    })

    if (result.error) {
      console.error('댓글 작성 실패:', result.error)
      alert('댓글 작성에 실패했습니다.')
    } else {
      setNewComment('')
      setIsAnonymousComment(false)
      fetchPost()
    }

    setIsSubmitting(false)
  }


  const handleToggleLike = async () => {
    if (!user) return

    // Optimistic update
    const wasLiked = isLiked
    const newCount = wasLiked ? likeCount - 1 : likeCount + 1
    setIsLiked(!wasLiked)
    setLikeCount(newCount)

    if (wasLiked) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
      if (error) {
        setIsLiked(wasLiked)
        setLikeCount(prev => wasLiked ? prev + 1 : prev - 1)
        return
      }
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id })
      if (error) {
        setIsLiked(wasLiked)
        setLikeCount(prev => wasLiked ? prev + 1 : prev - 1)
        return
      }
    }

  }

  // 댓글 삭제 권한 확인 함수
  const canDeleteComment = (commentAuthorId: string) => {
    return user && (user.id === commentAuthorId || isAdmin)
  }

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number, commentAuthorId: string) => {
    const confirmMessage = isAdmin && user?.id !== commentAuthorId
      ? '관리자 권한으로 이 댓글을 삭제하시겠습니까?'
      : '이 댓글을 삭제하시겠습니까?'

    if (!confirm(confirmMessage)) return

    setDeletingCommentId(commentId)
    const result = await deleteComment(commentId)

    if (result.error) {
      alert(result.error)
    } else {
      fetchPost() // 댓글 목록 새로고침
    }
    setDeletingCommentId(null)
  }

  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      free: '자유게시판', vip: 'VIP 라운지', anonymous: '익명게시판',
      recommend: '컨텐츠추천', meme: '짤, 움짤', report: '신고게시판',
    }
    return labels[category] || '게시판'
  }

  // 신고게시판 내용은 관리자만 열람 가능
  const isReportRestricted = category === 'report' && !isAdmin

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!post) return

    const confirmMessage = isAdmin && user?.id !== post.authorId
      ? '관리자 권한으로 이 게시글을 삭제하시겠습니까?'
      : '이 게시글을 삭제하시겠습니까?'

    if (!confirm(confirmMessage)) return

    setIsDeleting(true)
    const result = await deletePost(post.id)

    if (result.error) {
      alert(result.error)
      setIsDeleting(false)
    } else {
      alert('게시글이 삭제되었습니다.')
      router.push(`/community/${category}`)
    }
  }

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>게시글을 불러오는 중...</span>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>게시글을 찾을 수 없습니다</p>
          <Link href={`/community/${category}`} className={styles.backLink}>
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>{getCategoryLabel()}</span>
          </button>
        </header>

        {/* Article */}
        <article className={styles.article}>
          {/* Title Area */}
          <div className={styles.titleArea}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{post.title}</h1>
              {/* 수정/삭제 버튼 */}
              {(canEdit || canDelete) && (
                <div className={styles.postActions}>
                  {canEdit && (
                    <Link
                      href={`/community/write?edit=${post.id}&board=${category}`}
                      className={styles.editButton}
                    >
                      <Edit size={16} />
                      <span>수정</span>
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                      <span>{isDeleting ? '삭제 중...' : '삭제'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={styles.meta}>
              <div className={styles.author}>
                <div className={styles.authorAvatar}>
                  {post.authorAvatar ? (
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      fill
                      className={styles.avatarImage}
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                {post.isAnonymous ? (
                  <span>{post.authorName}</span>
                ) : (
                  <Link href={`/profile/${post.authorId}`} className={styles.authorLink}>
                    {post.authorName}
                  </Link>
                )}
                {isAdmin && post.isAnonymous && post.authorRealName && (
                  <span className={styles.adminRealName}>({post.authorRealName})</span>
                )}
              </div>
              <div className={styles.metaItems}>
                <span>
                  <Calendar size={14} />
                  {formatDate(post.createdAt)}
                </span>
                <span>
                  <Eye size={14} />
                  {post.viewCount}
                </span>
              </div>
            </div>
          </div>

          {/* Content - HTML 콘텐츠 렌더링 (XSS 방지 + Plain text 호환) */}
          {isReportRestricted ? (
            <div className={styles.content} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p>신고게시판의 내용은 관리자만 열람할 수 있습니다.</p>
            </div>
          ) : (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            />
          )}

          {/* Article Footer - 좋아요 */}
          <div className={styles.articleFooter}>
            <button
              className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
              disabled={!user}
              onClick={handleToggleLike}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              좋아요 {likeCount > 0 && likeCount}
            </button>
          </div>
        </article>

        {/* Comments - 신고게시판은 관리자만 열람 가능 */}
        {!isReportRestricted && <section className={styles.comments}>
          <h2 className={styles.commentsHeader}>
            <MessageSquare size={20} />
            댓글 {comments.length}
          </h2>

          <div className={styles.commentsBody}>
          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className={styles.commentForm}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className={styles.commentInput}
                rows={3}
              />
              <div className={styles.commentFormActions}>
                <label className={styles.anonymousToggle}>
                  <input
                    type="checkbox"
                    checked={isAnonymousComment}
                    onChange={(e) => setIsAnonymousComment(e.target.checked)}
                  />
                  <span>익명으로 작성</span>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className={styles.submitButton}
                >
                  <Send size={16} />
                  등록
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>댓글을 작성하려면 로그인이 필요합니다.</p>
              <Link href="/login" className={styles.loginLink}>로그인</Link>
            </div>
          )}

          {/* Comments List */}
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p className={styles.noComments}>첫 댓글을 작성해보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentAuthor}>
                    <div className={styles.commentAvatar}>
                      {comment.authorAvatar ? (
                        <Image
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          fill
                          className={styles.avatarImage}
                        />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <span className={styles.commentAuthorName}>{comment.authorName}</span>
                    {isAdmin && comment.isAnonymous && comment.authorRealName && (
                      <span className={styles.adminRealName}>({comment.authorRealName})</span>
                    )}
                    <span className={styles.commentDate}>
                      {formatDate(comment.createdAt)}
                    </span>
                    {canDeleteComment(comment.authorId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id, comment.authorId)}
                        disabled={deletingCommentId === comment.id}
                        className={styles.commentDeleteBtn}
                        title="댓글 삭제"
                      >
                        {deletingCommentId === comment.id ? (
                          <span className={styles.commentDeleteSpinner} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className={styles.commentContent}>{comment.content}</p>
                </div>
              ))
            )}
          </div>
          </div>
        </section>}

        {/* Footer */}
        <footer className={styles.footer}>
          <Link href={`/community/${category}`} className={styles.listButton}>
            목록으로
          </Link>
        </footer>
      </div>
    </main>
  )
}
