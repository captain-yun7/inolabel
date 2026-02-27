'use client'

import { useState, useMemo } from 'react'
import type { StarcraftTierWithMembers } from '@/types/database'
import { useLiveRoster } from '@/lib/hooks/useLiveRoster'
import { Radio } from 'lucide-react'
import TierRow from './TierRow'
import styles from './TierBoard.module.css'

interface TierBoardProps {
  tiers: StarcraftTierWithMembers[]
}

const RACE_LEGEND = [
  { key: 'terran', label: '테란', color: '#3b82f6' },
  { key: 'zerg', label: '저그', color: '#a855f7' },
  { key: 'protoss', label: '프토', color: '#f59e0b' },
]

export interface LiveInfoByName {
  thumbnailUrl: string | null
  streamUrl: string
  soopId: string | null
}

export default function TierBoard({ tiers }: TierBoardProps) {
  const { members, liveStatusByMemberId } = useLiveRoster({ realtime: true })
  const [showLiveOnly, setShowLiveOnly] = useState(false)

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

  // 이름 기준 라이브 정보 매핑 (썸네일, 방송 URL 등)
  const liveInfoByName = useMemo(() => {
    const map: Record<string, LiveInfoByName> = {}
    members.forEach(m => {
      if (m.is_live) {
        const entries = liveStatusByMemberId[m.id] || []
        const liveEntry = entries.find(e => e.isLive)
        if (liveEntry) {
          const soopId = (m.social_links as Record<string, string> | null)?.sooptv ||
                         (m.social_links as Record<string, string> | null)?.soop || null
          map[m.name] = {
            thumbnailUrl: liveEntry.thumbnailUrl,
            streamUrl: liveEntry.streamUrl,
            soopId,
          }
        }
      }
    })
    return map
  }, [members, liveStatusByMemberId])

  // 라이브 필터 적용 시 멤버 필터링
  const filteredTiers = useMemo(() => {
    if (!showLiveOnly) return tiers
    return tiers.map(tier => ({
      ...tier,
      members: tier.members.filter(m => liveNames.has(m.player_name)),
    }))
  }, [tiers, showLiveOnly, liveNames])

  if (tiers.length === 0) {
    return (
      <div className={styles.empty}>
        <p>티어 데이터가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {/* 상단 바: 범례 + 라이브 필터 */}
      <div className={styles.topBar}>
        {/* 종족 컬러 범례 */}
        <div className={styles.legend}>
          {RACE_LEGEND.map((race) => (
            <div key={race.key} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: race.color }}
              />
              <span className={styles.legendLabel}>{race.label}</span>
            </div>
          ))}
        </div>

        {/* 라이브 필터 토글 */}
        <button
          className={`${styles.liveFilter} ${showLiveOnly ? styles.liveFilterActive : ''}`}
          onClick={() => setShowLiveOnly(prev => !prev)}
        >
          <Radio size={14} />
          <span>LIVE만 보기</span>
          {liveNames.size > 0 && (
            <span className={styles.liveFilterCount}>{liveNames.size}</span>
          )}
        </button>
      </div>

      {/* 티어 보드 */}
      <div className={styles.board}>
        {filteredTiers.map((tier) => (
          <TierRow key={tier.id} tier={tier} liveNames={liveNames} liveInfoByName={liveInfoByName} />
        ))}
      </div>
    </div>
  )
}
