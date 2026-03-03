'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import type { StarcraftTierWithMembers, StarcraftTierMember } from '@/types/database'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Radio } from 'lucide-react'
import TierRow from './TierRow'
import styles from './TierBoard.module.css'

interface TierBoardProps {
  tiers: StarcraftTierWithMembers[]
}

const RACE_LEGEND = [
  { key: 'terran', label: '테란', color: '#3b82f6' },
  { key: 'zerg', label: '저그', color: '#a855f7' },
  { key: 'protoss', label: '토스', color: '#f59e0b' },
]

export default function TierBoard({ tiers: initialTiers }: TierBoardProps) {
  const [tiers, setTiers] = useState(initialTiers)
  const [showLiveOnly, setShowLiveOnly] = useState(false)

  // props 업데이트 반영
  useEffect(() => { setTiers(initialTiers) }, [initialTiers])

  // Realtime 구독: starcraft_tier_members 라이브 상태 변경 감지
  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase
      .channel('tier-member-live')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'starcraft_tier_members',
      }, (payload) => {
        const updated = payload.new as StarcraftTierMember
        setTiers(prev => prev.map(tier => ({
          ...tier,
          members: tier.members.map(m =>
            m.id === updated.id ? { ...m, ...updated } : m
          ),
        })))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // 라이브 멤버 수 카운트
  const liveCount = useMemo(() => {
    let count = 0
    tiers.forEach(t => t.members.forEach(m => { if (m.is_live) count++ }))
    return count
  }, [tiers])

  // 라이브 필터 적용 시 멤버 필터링
  const filteredTiers = useMemo(() => {
    if (!showLiveOnly) return tiers
    return tiers.map(tier => ({
      ...tier,
      members: tier.members.filter(m => m.is_live),
    }))
  }, [tiers, showLiveOnly])

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
          {liveCount > 0 && (
            <span className={styles.liveFilterCount}>{liveCount}</span>
          )}
        </button>
      </div>

      {/* 티어 보드 */}
      <div className={styles.board}>
        {filteredTiers.map((tier) => (
          <TierRow key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  )
}
