'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, MessageSquare } from 'lucide-react'
import { useSupabaseContext } from '@/lib/context'
import { formatDate } from '@/lib/utils/format'
import styles from './CommunityPreview.module.css'

interface Post {
  id: number
  title: string
  category: string | null
  created_at: string
  author_nickname: string | null
  comment_count: number
}

export default function CommunityPreview() {
  const supabase = useSupabaseContext()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, category, created_at, author_nickname, comment_count')
          .order('created_at', { ascending: false })
          .limit(8)

        if (!error && data) {
          setPosts(data)
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

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
