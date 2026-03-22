'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MessageSquare } from 'lucide-react'
import { getBestPosts, getPosts } from '@/lib/actions/posts'
import { formatDate } from '@/lib/utils/format'
import styles from './CommunityPreview.module.css'

interface Post {
  id: number
  title: string
  category: string | null
  created_at: string
  author_nickname: string | null
  is_anonymous: boolean
  comment_count: number
}

export default function CommunityPreview() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 서버 액션으로 인기글 조회
        const { data: popularData } = await getBestPosts({
          boardType: 'free',
          period: 'weekly',
          limit: 8,
        })

        if (popularData && popularData.length > 0) {
          setPosts(popularData.map(p => ({
            id: p.id,
            title: p.title,
            category: p.board_type,
            created_at: p.created_at,
            author_nickname: p.is_anonymous ? '익명' : (p.author_nickname || null),
            is_anonymous: p.is_anonymous || false,
            comment_count: p.comment_count ?? 0,
          })))
        } else {
          // 인기글 없으면 최신글 fallback
          const { data: latestResult } = await getPosts({
            boardType: 'free',
            page: 1,
            limit: 8,
          })

          if (latestResult) {
            setPosts(latestResult.data.map(p => ({
              id: p.id,
              title: p.title,
              category: p.board_type,
              created_at: p.created_at,
              author_nickname: p.is_anonymous ? '익명' : (p.author_nickname || null),
              is_anonymous: p.is_anonymous || false,
              comment_count: p.comment_count ?? 0,
            })))
          }
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <MessageSquare size={16} className={styles.icon} />
          <h3>자유게시판 인기글</h3>
        </div>
        <Link href="/community/free" className={styles.viewAll}>
          전체보기 <ChevronRight size={16} />
        </Link>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonMeta} />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className={styles.empty}>아직 게시글이 없습니다</div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/free/${post.id}`}
              className={styles.item}
            >
              <span className={styles.title}>{post.title}</span>
              <div className={styles.meta}>
                <span className={styles.author}>{post.author_nickname || '익명'}</span>
                <span className={styles.date}>{formatDate(post.created_at)}</span>
                {post.comment_count > 0 && (
                  <span className={styles.comments}>[{post.comment_count}]</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
