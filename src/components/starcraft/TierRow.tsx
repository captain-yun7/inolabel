'use client'

import type { StarcraftTierWithMembers } from '@/types/database'
import TierMemberCard from './TierMemberCard'
import styles from './TierRow.module.css'

interface TierRowProps {
  tier: StarcraftTierWithMembers
  liveNames?: Set<string>
}

export default function TierRow({ tier, liveNames }: TierRowProps) {
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
              isLive={liveNames?.has(member.player_name) || false}
            />
          ))
        )}
      </div>
    </div>
  )
}
