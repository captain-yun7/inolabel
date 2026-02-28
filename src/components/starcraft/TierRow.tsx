'use client'

import type { StarcraftTierWithMembers } from '@/types/database'
import TierMemberCard from './TierMemberCard'
import styles from './TierRow.module.css'

interface TierRowProps {
  tier: StarcraftTierWithMembers
}

export default function TierRow({ tier }: TierRowProps) {
  return (
    <div className={styles.row}>
      <div
        className={styles.tierLabel}
        style={{ backgroundColor: tier.color || '#666' }}
      >
        <span className={styles.tierName}>{tier.name}</span>
      </div>
      <div className={styles.members}>
        {tier.members.length === 0 ? (
          <div className={styles.emptySlot}>
            <span>멤버 없음</span>
          </div>
        ) : (
          tier.members.map((member) => (
            <TierMemberCard
              key={member.id}
              member={member}
              isLive={member.is_live}
              thumbnailUrl={member.live_thumbnail}
              streamUrl={member.soop_id ? `https://play.sooplive.co.kr/${member.soop_id}` : null}
              broadcastTitle={member.live_title}
            />
          ))
        )}
      </div>
    </div>
  )
}
