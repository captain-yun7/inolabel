'use client'

import type { StarcraftTierMember } from '@/types/database'
import styles from './TierMemberCard.module.css'

interface TierMemberCardProps {
  member: StarcraftTierMember
  isLive?: boolean
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

export default function TierMemberCard({ member, isLive }: TierMemberCardProps) {
  const raceColor = member.race ? RACE_COLOR[member.race] : undefined
  const raceLabel = member.race ? RACE_LABEL[member.race] : null

  return (
    <div className={`${styles.card} ${isLive ? styles.liveCard : ''}`}>
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
    </div>
  )
}
