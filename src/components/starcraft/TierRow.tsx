'use client'

import type { StarcraftTierWithMembers } from '@/types/database'
import type { LiveInfoByName } from './TierBoard'
import TierMemberCard from './TierMemberCard'
import styles from './TierRow.module.css'

interface TierRowProps {
  tier: StarcraftTierWithMembers
  isMemberLive?: (m: { player_name: string; soop_id?: string | null }) => boolean
  getMemberLiveInfo?: (m: { player_name: string; soop_id?: string | null }) => LiveInfoByName | undefined
}

export default function TierRow({ tier, isMemberLive, getMemberLiveInfo }: TierRowProps) {
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
            const isLive = isMemberLive?.(member) || false
            const liveInfo = isLive ? getMemberLiveInfo?.(member) : undefined
            return (
              <TierMemberCard
                key={member.id}
                member={member}
                isLive={isLive}
                thumbnailUrl={liveInfo?.thumbnailUrl || null}
                streamUrl={liveInfo?.streamUrl || null}
                broadcastTitle={liveInfo?.broadcastTitle || null}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
