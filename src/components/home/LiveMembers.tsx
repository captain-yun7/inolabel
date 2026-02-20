'use client'

import { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useLiveRoster } from '@/lib/hooks'
import styles from './LiveMembers.module.css'

type UnitFilter = 'all' | 'excel' | 'crew'

interface LiveMember {
  id: number
  nickname: string
  avatarUrl: string | null
  isLive: boolean
  unit: 'excel' | 'crew'
  sooptvId: string | null
}

export default function LiveMembers() {
  const { members: rosterMembers, isLoading } = useLiveRoster({ realtime: true })
  const [filter, setFilter] = useState<UnitFilter>('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  const members: LiveMember[] = useMemo(() => {
    // 이름 기반 중복 제거 (김인호가 excel/crew 양쪽에 있음)
    const seen = new Set<string>()
    return rosterMembers
      .filter((m) => {
        if (seen.has(m.name)) return false
        seen.add(m.name)
        return true
      })
      .map((member) => ({
        id: member.id,
        nickname: member.name,
        avatarUrl: member.image_url,
        isLive: Boolean(member.is_live),
        unit: member.unit,
        sooptvId: member.social_links?.soop || member.social_links?.sooptv || member.social_links?.pandatv || null,
      }))
      .sort((a, b) => (b.isLive ? 1 : 0) - (a.isLive ? 1 : 0))
  }, [rosterMembers])

  const filteredMembers = useMemo(() => {
    if (filter === 'all') return members
    return members.filter((m) => m.unit === filter)
  }, [members, filter])

  const liveCount = members.filter((m) => m.isLive).length

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const tabs: { key: UnitFilter; label: string }[] = [
    { key: 'excel', label: '엑셀부' },
    { key: 'crew', label: '스타부' },
    { key: 'all', label: '전체' },
  ]

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>현재 방송중</h3>
          <div className={styles.liveCount}>
            <span className={styles.liveCountDot} />
            0
          </div>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <span key={tab.key} className={styles.tab}>{tab.label}</span>
            ))}
          </div>
          <div className={styles.spacer} />
          <span className={styles.viewAll}>전체보기 <ChevronRight size={16} /></span>
        </div>
        <div className={styles.scrollContainer}>
          <div className={styles.cardList}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      {/* Header: 현재 방송중 🔴 [엑셀부] [스타부] [전체] ... 전체보기 > */}
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>현재 방송중</h3>
        <div className={styles.liveCount}>
          <span className={styles.liveCountDot} />
          {liveCount}
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${filter === tab.key ? styles.tabActive : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.spacer} />
        <Link href="/rg/live" className={styles.viewAll}>
          전체보기 <ChevronRight size={16} />
        </Link>
      </div>

      {/* Scrollable thumbnail cards */}
      <div className={styles.scrollWrapper}>
        <button className={`${styles.scrollBtn} ${styles.scrollLeft}`} onClick={() => scroll('left')} aria-label="왼쪽으로">
          <ChevronLeft size={20} />
        </button>

        <div className={styles.scrollContainer} ref={scrollRef}>
          <div className={styles.cardList}>
            {filteredMembers.length === 0 ? (
              <div className={styles.empty}>현재 방송 중인 멤버가 없습니다</div>
            ) : (
              filteredMembers.map((member) => {
                const broadcastUrl = member.sooptvId
                  ? `https://play.sooplive.co.kr/${member.sooptvId}`
                  : undefined

                return (
                  <a
                    key={member.id}
                    href={broadcastUrl || '#'}
                    target={broadcastUrl ? '_blank' : undefined}
                    rel={broadcastUrl ? 'noopener noreferrer' : undefined}
                    className={`${styles.card} ${member.isLive ? styles.cardLive : styles.cardOffline}`}
                  >
                    {/* Thumbnail */}
                    <div className={styles.thumbnail}>
                      {member.avatarUrl ? (
                        <Image
                          src={member.avatarUrl}
                          alt={member.nickname}
                          fill
                          className={styles.thumbnailImage}
                          sizes="180px"
                        />
                      ) : (
                        <div className={styles.thumbnailPlaceholder}>
                          {member.nickname.charAt(0)}
                        </div>
                      )}
                      {member.isLive && (
                        <span className={styles.liveBadge}>LIVE</span>
                      )}
                    </div>
                    {/* Info */}
                    <div className={styles.cardInfo}>
                      <span className={styles.cardName}>{member.nickname}</span>
                      <span className={styles.cardTitle}>
                        {member.isLive ? '방송 중' : '오프라인'}
                      </span>
                    </div>
                  </a>
                )
              })
            )}
          </div>
        </div>

        <button className={`${styles.scrollBtn} ${styles.scrollRight}`} onClick={() => scroll('right')} aria-label="오른쪽으로">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
