'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MessageSquare, ImageIcon } from 'lucide-react'
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

type BoardType = 'free' | 'vip' | 'anonymous' | 'recommend' | 'meme' | 'report'

interface CommunityPreviewProps {
  boardType?: BoardType
  title?: string
  limit?: number
}

function CommunityPreviewCard({ boardType = 'free', title, limit = 5 }: CommunityPreviewProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const displayTitle = title || (boardType === 'meme' ? '움짤 인기글' : '자유게시판 인기글')
  const Icon = boardType === 'meme' ? ImageIcon : MessageSquare

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: popularData } = await getBestPosts({
          boardType,
          period: 'weekly',
          limit,
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
          const { data: latestResult } = await getPosts({
            boardType,
            page: 1,
            limit,
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
  }, [boardType, limit])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Icon size={16} className={styles.icon} />
          <h3>{displayTitle}</h3>
        </div>
        <Link href={`/community/${boardType}`} className={styles.viewAll}>
          전체보기 <ChevronRight size={16} />
        </Link>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          Array.from({ length: limit }).map((_, i) => (
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
              href={`/community/${boardType}/${post.id}`}
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

export default function CommunityPreview() {
  return (
    <div className={styles.grid}>
      <CommunityPreviewCard boardType="free" limit={5} />
      <CommunityPreviewCard boardType="meme" limit={5} />
    </div>
  )
}
