'use client'

import type { StarcraftTierWithMembers } from '@/types/database'
import type { LiveInfoByName } from './TierBoard'
import TierMemberCard from './TierMemberCard'
import styles from './TierRow.module.css'

interface TierRowProps {
  tier: StarcraftTierWithMembers
  liveNames?: Set<string>
  liveInfoByName?: Record<string, LiveInfoByName>
}

export default function TierRow({ tier, liveNames, liveInfoByName }: TierRowProps) {
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
          tier.members.map((member) => {
            const isLive = liveNames?.has(member.player_name) || false
            const liveInfo = isLive ? liveInfoByName?.[member.player_name] : undefined
            return (
              <TierMemberCard
                key={member.id}
                member={member}
                isLive={isLive}
                thumbnailUrl={liveInfo?.thumbnailUrl || null}
                streamUrl={liveInfo?.streamUrl || null}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
