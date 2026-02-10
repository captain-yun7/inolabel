'use client'

import type { StarcraftTierMember } from '@/types/database'
import styles from './TierMemberCard.module.css'

interface TierMemberCardProps {
  member: StarcraftTierMember
  isLive?: boolean
}

const RACE_EMOJI: Record<string, string> = {
  terran: 'T',
  zerg: 'Z',
  protoss: 'P',
}

export default function TierMemberCard({ member, isLive }: TierMemberCardProps) {
  return (
    <div className={`${styles.card} ${isLive ? styles.liveCard : ''}`}>
      <div className={styles.avatarWrap}>
        {member.image_url ? (
          <img
            src={member.image_url}
            alt={member.player_name}
            className={`${styles.avatar} ${isLive ? styles.liveAvatar : ''}`}
          />
        ) : (
          <div className={`${styles.avatarPlaceholder} ${isLive ? styles.liveAvatar : ''}`}>
            {member.race ? RACE_EMOJI[member.race] || '?' : '?'}
          </div>
        )}
        {isLive && <span className={styles.liveBadge}>Live</span>}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{member.player_name}</span>
        {member.race && (
          <span className={styles.race}>
            {RACE_EMOJI[member.race] || member.race}
          </span>
        )}
      </div>
    </div>
  )
}
