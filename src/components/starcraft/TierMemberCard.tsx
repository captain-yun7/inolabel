'use client'

import { useState, useRef } from 'react'
import type { StarcraftTierMember } from '@/types/database'
import styles from './TierMemberCard.module.css'

interface TierMemberCardProps {
  member: StarcraftTierMember
  isLive?: boolean
  thumbnailUrl?: string | null
  streamUrl?: string | null
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

export default function TierMemberCard({ member, isLive, thumbnailUrl, streamUrl }: TierMemberCardProps) {
  const raceColor = member.race ? RACE_COLOR[member.race] : undefined
  const raceLabel = member.race ? RACE_LABEL[member.race] : null
  const [showPreview, setShowPreview] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (!isLive || !thumbnailUrl) return
    hoverTimer.current = setTimeout(() => setShowPreview(true), 300)
  }

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowPreview(false)
  }

  const soopId = member.soop_id
  const broadcastUrl = streamUrl || (soopId ? `https://www.sooplive.co.kr/${soopId}` : null)

  return (
    <div
      className={`${styles.card} ${isLive ? styles.liveCard : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
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

      {/* LIVE 호버 시 썸네일 미리보기 팝업 */}
      {showPreview && thumbnailUrl && (
        <div className={styles.previewPopup}>
          <div className={styles.previewPopupInner}>
            <img src={thumbnailUrl} alt="방송 미리보기" className={styles.previewThumbnail} />
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
        </div>
      )}
    </div>
  )
}
