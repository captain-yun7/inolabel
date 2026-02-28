'use client'

import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { StarcraftTierMember } from '@/types/database'
import styles from './TierMemberCard.module.css'

interface TierMemberCardProps {
  member: StarcraftTierMember
  isLive?: boolean
  thumbnailUrl?: string | null
  streamUrl?: string | null
  broadcastTitle?: string | null
}

const RACE_LABEL: Record<string, string> = {
  terran: '테란',
  zerg: '저그',
  protoss: '프토',
}

const RACE_COLOR: Record<string, string> = {
  terran: '#3b82f6',
  zerg: '#a855f7',
  protoss: '#f59e0b',
}

export default function TierMemberCard({ member, isLive, thumbnailUrl, streamUrl, broadcastTitle }: TierMemberCardProps) {
  const raceColor = member.race ? RACE_COLOR[member.race] : undefined
  const raceLabel = member.race ? RACE_LABEL[member.race] : null
  const [showPreview, setShowPreview] = useState(false)
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => {
    if (!isLive || !thumbnailUrl) return
    hoverTimer.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const popupWidth = 280
        const popupHeight = 220 // 대략적인 팝업 높이
        let left = rect.left + rect.width / 2 - popupWidth / 2
        if (left < 8) left = 8
        if (left + popupWidth > window.innerWidth - 8) left = window.innerWidth - popupWidth - 8
        // 위에 공간 있으면 위, 없으면 아래
        const top = rect.top > popupHeight + 8
          ? rect.top - popupHeight - 6
          : rect.bottom + 6
        setPopupPos({ top, left })
      }
      setShowPreview(true)
    }, 300)
  }, [isLive, thumbnailUrl])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowPreview(false)
  }, [])

  const soopId = member.soop_id
  const broadcastUrl = streamUrl || (soopId ? `https://www.sooplive.co.kr/${soopId}` : null)

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isLive ? styles.liveCard : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.avatarWrap}>
        {member.image_url ? (
          <img
            src={member.image_url}
            alt={member.player_name}
            className={styles.avatar}
            style={
              isLive
                ? { borderColor: '#00d4ff' }
                : raceColor
                  ? { borderColor: raceColor }
                  : undefined
            }
          />
        ) : (
          <div
            className={styles.avatarPlaceholder}
            style={
              isLive
                ? { borderColor: '#00d4ff' }
                : raceColor
                  ? { borderColor: raceColor, color: raceColor }
                  : undefined
            }
          >
            {raceLabel ? raceLabel.charAt(0) : '?'}
          </div>
        )}
        {isLive && <span className={styles.liveBadge}>LIVE</span>}
      </div>
      <span className={styles.name}>{member.player_name}</span>
      {raceLabel && (
        <span
          className={styles.raceBadge}
          style={{
            backgroundColor: raceColor ? `${raceColor}18` : undefined,
            color: raceColor,
            borderColor: raceColor ? `${raceColor}40` : undefined,
          }}
        >
          {raceLabel}
        </span>
      )}

      {/* LIVE 호버 시 썸네일 미리보기 팝업 (Portal → body) */}
      {showPreview && thumbnailUrl && popupPos && createPortal(
        <div
          className={styles.previewPopup}
          style={{ top: popupPos.top, left: popupPos.left }}
          onMouseEnter={handleMouseLeave}
        >
          <div className={styles.previewPopupInner}>
            <img src={thumbnailUrl} alt="방송 미리보기" className={styles.previewThumbnail} />
            {broadcastTitle && (
              <p className={styles.previewTitle}>{broadcastTitle}</p>
            )}
            {broadcastUrl && (
              <a
                href={broadcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.previewLink}
                onClick={(e) => e.stopPropagation()}
              >
                방송 바로가기
              </a>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
