'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { User, FileText, MessageSquare, ArrowLeft, Calendar, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { PageLayout } from '@/components/layout'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useSupabaseContext } from '@/lib/context'
import styles from './page.module.css'

interface UserProfile {
  id: string
  nickname: string
  avatar_url: string | null
  role: string
  created_at: string
}

interface UserPost {
  id: number
  board_type: string
  title: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  is_anonymous: boolean
}

interface UserComment {
  id: number
  content: string
  created_at: string
  is_anonymous: boolean
  post_id: number
  postTitle: string
  postBoardType: string
}

type Tab = 'posts' | 'comments'

const BOARD_LABELS: Record<string, string> = {
  free: '자유',
  vip: 'VIP',
  anonymous: '익명',
  recommend: '추천',
  meme: '짤',
  report: '신고',
}

const PAGE_SIZE = 15

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  const supabase = useSupabaseContext()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<UserPost[]>([])
  const [comments, setComments] = useState<UserComment[]>([])
  const [postsCount, setPostsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [tab, setTab] = useState<Tab>('posts')
  const [postsPage, setPostsPage] = useState(1)
  const [commentsPage, setCommentsPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url, role, created_at')
      .eq('id', userId)
      .single()

    if (err || !data) {
      setError('사용자를 찾을 수 없습니다.')
      setLoading(false)
      return
    }
    setProfile(data)
  }, [supabase, userId])

  const fetchPosts = useCallback(async (page: number) => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error: err } = await supabase
      .from('posts')
      .select('id, board_type, title, view_count, like_count, comment_count, created_at, is_anonymous', { count: 'exact' })
      .eq('author_id', userId)
      .eq('is_deleted', false)
      .eq('is_anonymous', false)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!err) {
      setPosts(data || [])
      setPostsCount(count || 0)
    }
  }, [supabase, userId])

  const fetchComments = useCallback(async (page: number) => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error: err } = await supabase
      .from('comments')
      .select('id, content, created_at, is_anonymous, post_id, posts!post_id(title, board_type)', { count: 'exact' })
      .eq('author_id', userId)
      .eq('is_deleted', false)
      .eq('is_anonymous', false)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!err && data) {
      setComments(data.map((c) => {
        const post = c.posts as unknown as { title: string; board_type: string } | null
        return {
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          is_anonymous: c.is_anonymous,
          post_id: c.post_id,
          postTitle: post?.title || '삭제된 게시글',
          postBoardType: post?.board_type || 'free',
        }
      }))
      setCommentsCount(count || 0)
    }
  }, [supabase, userId])

  useEffect(() => {
    setLoading(true)
    fetchProfile().then(() => setLoading(false))
  }, [fetchProfile])

  useEffect(() => {
    if (profile) fetchPosts(postsPage)
  }, [profile, postsPage, fetchPosts])

  useEffect(() => {
    if (profile) fetchComments(commentsPage)
  }, [profile, commentsPage, fetchComments])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const totalPostPages = Math.ceil(postsCount / PAGE_SIZE)
  const totalCommentPages = Math.ceil(commentsCount / PAGE_SIZE)

  if (loading) {
    return (
      <PageLayout>
        <div className={styles.container}>
          <Navbar />
          <main className={styles.main}>
            <div className={styles.loading}>프로필 로딩 중...</div>
          </main>
          <Footer />
        </div>
      </PageLayout>
    )
  }

  if (error || !profile) {
    return (
      <PageLayout>
        <div className={styles.container}>
          <Navbar />
          <main className={styles.main}>
            <div className={styles.error}>
              <p>{error || '사용자를 찾을 수 없습니다.'}</p>
              <Link href="/" className={styles.backLink}>
                <ArrowLeft size={16} />
                홈으로 돌아가기
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.nickname} fill style={{ objectFit: 'cover' }} />
              ) : (
                <User size={40} />
              )}
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.nickname}>{profile.nickname}</h1>
              <div className={styles.meta}>
                <span className={styles.roleBadge}>{profile.role}</span>
                <span className={styles.joinDate}>
                  <Calendar size={13} />
                  {formatDate(profile.created_at)} 가입
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'posts' ? styles.active : ''}`}
              onClick={() => { setTab('posts'); setPostsPage(1) }}
            >
              <FileText size={16} />
              게시글
              <span className={styles.count}>{postsCount}</span>
            </button>
            <button
              className={`${styles.tab} ${tab === 'comments' ? styles.active : ''}`}
              onClick={() => { setTab('comments'); setCommentsPage(1) }}
            >
              <MessageSquare size={16} />
              댓글
              <span className={styles.count}>{commentsCount}</span>
            </button>
          </div>

          {/* Posts Tab */}
          {tab === 'posts' && (
            <div className={styles.list}>
              {posts.length === 0 ? (
                <div className={styles.empty}>
                  <FileText size={32} />
                  <p>작성한 게시글이 없습니다</p>
                </div>
              ) : (
                <>
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/community/${post.board_type}/${post.id}`}
                      className={styles.listItem}
                    >
                      <div className={styles.listItemTop}>
                        <span className={styles.boardBadge}>
                          {BOARD_LABELS[post.board_type] || post.board_type}
                        </span>
                        <span className={styles.listTitle}>{post.title}</span>
                      </div>
                      <div className={styles.listItemBottom}>
                        <span>{formatDate(post.created_at)}</span>
                        <span className={styles.statGroup}>
                          <Eye size={12} /> {post.view_count}
                        </span>
                        <span className={styles.statGroup}>
                          <Heart size={12} /> {post.like_count}
                        </span>
                        <span className={styles.statGroup}>
                          <MessageSquare size={12} /> {post.comment_count}
                        </span>
                      </div>
                    </Link>
                  ))}
                  {totalPostPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        disabled={postsPage <= 1}
                        onClick={() => setPostsPage(postsPage - 1)}
                        className={styles.pageBtn}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className={styles.pageInfo}>{postsPage} / {totalPostPages}</span>
                      <button
                        disabled={postsPage >= totalPostPages}
                        onClick={() => setPostsPage(postsPage + 1)}
                        className={styles.pageBtn}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {tab === 'comments' && (
            <div className={styles.list}>
              {comments.length === 0 ? (
                <div className={styles.empty}>
                  <MessageSquare size={32} />
                  <p>작성한 댓글이 없습니다</p>
                </div>
              ) : (
                <>
                  {comments.map((comment) => (
                    <Link
                      key={comment.id}
                      href={`/community/${comment.postBoardType}/${comment.post_id}`}
                      className={styles.listItem}
                    >
                      <div className={styles.listItemTop}>
                        <span className={styles.boardBadge}>
                          {BOARD_LABELS[comment.postBoardType] || comment.postBoardType}
                        </span>
                        <span className={styles.commentContent}>
                          {comment.content.replace(/<[^>]*>/g, '').slice(0, 100)}
                        </span>
                      </div>
                      <div className={styles.listItemBottom}>
                        <span className={styles.parentPost}>RE: {comment.postTitle}</span>
                        <span>{formatDate(comment.created_at)}</span>
                      </div>
                    </Link>
                  ))}
                  {totalCommentPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        disabled={commentsPage <= 1}
                        onClick={() => setCommentsPage(commentsPage - 1)}
                        className={styles.pageBtn}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className={styles.pageInfo}>{commentsPage} / {totalCommentPages}</span>
                      <button
                        disabled={commentsPage >= totalCommentPages}
                        onClick={() => setCommentsPage(commentsPage + 1)}
                        className={styles.pageBtn}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </PageLayout>
  )
}
