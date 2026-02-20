'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FileText, X, Eye, MessageCircle, ExternalLink } from 'lucide-react'
import { extractBjId } from '@/lib/soop/api'
import type { SoopBoardPost } from '@/lib/soop/types'
import type { OrganizationRecord } from '@/types/organization'
import styles from './StationNoticesSidebar.module.css'

interface StationNoticesSidebarProps {
  member: OrganizationRecord | null
  onClose?: () => void
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay < 7) return `${diffDay}일 전`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function StationNoticesSidebar({ member, onClose }: StationNoticesSidebarProps) {
  const [posts, setPosts] = useState<SoopBoardPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bjId, setBjId] = useState<string | null>(null)

  useEffect(() => {
    if (!member) {
      setPosts([])
      setBjId(null)
      return
    }

    const soopUrl = member.social_links?.soop || member.social_links?.sooptv || member.social_links?.pandatv
    if (!soopUrl) {
      setPosts([])
      setBjId(null)
      return
    }

    const id = extractBjId(soopUrl)
    setBjId(id)

    if (!id) {
      setPosts([])
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetch(`/api/soop/station?bjId=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setPosts(json.data?.posts || [])
        }
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [member])

  return (
    <motion.div
      className={styles.sidebar}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sidebarHeader}>
        <FileText size={16} />
        <h3 className={styles.sidebarTitle}>방송국 공지</h3>
        {member && onClose && (
          <button className={styles.closeBtn} onClick={onClose} title="닫기">
            <X size={18} />
          </button>
        )}
      </div>

      <div className={styles.sidebarContent}>
        {!member ? (
          <div className={styles.emptyState}>
            <FileText size={32} />
            <p>멤버를 선택하면<br />방송국 공지사항이 표시됩니다</p>
          </div>
        ) : isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>공지사항 불러오는 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={32} />
            <p>등록된 공지사항이 없습니다</p>
          </div>
        ) : (
          <div className={styles.noticeList}>
            {/* 멤버 프로필 헤더 */}
            <div className={styles.memberHeader}>
              <div className={styles.memberAvatar}>
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    width={32}
                    height={32}
                    className={styles.avatarImage}
                  />
                ) : (
                  <span className={styles.avatarFallback}>{member.name.charAt(0)}</span>
                )}
              </div>
              <div className={styles.memberInfo}>
                <span className={styles.memberName}>{member.name}</span>
                <span className={styles.postCount}>{posts.length}개 공지</span>
              </div>
              {bjId && (
                <a
                  href={`https://www.sooplive.co.kr/station/${bjId}/board`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stationLink}
                  title="방송국 바로가기"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* 공지사항 목록 */}
            {posts.map((post) => (
              <a
                key={post.title_no}
                className={styles.noticeItem}
                href={bjId ? `https://www.sooplive.co.kr/station/${bjId}/board` : '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4 className={styles.noticeTitle}>{post.title}</h4>
                <div className={styles.noticeMeta}>
                  <span className={styles.noticeTime}>{getRelativeTime(post.write_dt)}</span>
                  <span className={styles.noticeStat}>
                    <Eye size={11} />
                    {post.read_cnt.toLocaleString()}
                  </span>
                  <span className={styles.noticeStat}>
                    <MessageCircle size={11} />
                    {post.comment_cnt}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
