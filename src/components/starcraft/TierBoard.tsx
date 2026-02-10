'use client'

import { useMemo } from 'react'
import type { StarcraftTierWithMembers } from '@/types/database'
import { useLiveRoster } from '@/lib/hooks/useLiveRoster'
import TierRow from './TierRow'
import styles from './TierBoard.module.css'

interface TierBoardProps {
  tiers: StarcraftTierWithMembers[]
}

export default function TierBoard({ tiers }: TierBoardProps) {
  const { members } = useLiveRoster({ realtime: true })

  // 라이브 중인 멤버 이름 Set (organization name 기준)
  const liveNames = useMemo(() => {
    const names = new Set<string>()
    members.forEach(m => {
      if (m.is_live) {
        names.add(m.name)
      }
    })
    return names
  }, [members])

  if (tiers.length === 0) {
    return (
      <div className={styles.empty}>
        <p>티어 데이터가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className={styles.board}>
      {tiers.map((tier) => (
        <TierRow key={tier.id} tier={tier} liveNames={liveNames} />
      ))}
    </div>
  )
}
