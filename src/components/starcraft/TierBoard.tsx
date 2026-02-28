'use client'

import { useState, useMemo, useCallback } from 'react'
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
  broadcastTitle: string | null
}

export default function TierBoard({ tiers }: TierBoardProps) {
  const { members, liveStatusByMemberId } = useLiveRoster({ realtime: true })
  const [showLiveOnly, setShowLiveOnly] = useState(false)

  // 라이브 중인 멤버 이름 Set (organization name 기준)
  // + soop_id 기준 매핑도 함께 구축 (#4: 신규 선수 라이브 매칭)
  const { liveNames, liveSoopIds } = useMemo(() => {
    const names = new Set<string>()
    const soopIds = new Set<string>()
    members.forEach(m => {
      if (m.is_live) {
        names.add(m.name)
        const soopId = (m.social_links as Record<string, string> | null)?.sooptv ||
                       (m.social_links as Record<string, string> | null)?.soop || null
        if (soopId) {
          // URL에서 ID만 추출 (https://www.sooplive.co.kr/xxx → xxx)
          const match = soopId.match(/sooplive\.co\.kr\/(?:station\/)?([a-zA-Z0-9_]+)/)
          soopIds.add(match ? match[1] : soopId)
        }
      }
    })
    return { liveNames: names, liveSoopIds: soopIds }
  }, [members])

  // 이름 기준 라이브 정보 매핑 (썸네일, 방송 URL, 방송 제목 등)
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
            broadcastTitle: liveEntry.streamTitle,
          }
          // soop_id로도 매핑 (이름이 다를 경우 대비)
          if (soopId) {
            const match = soopId.match(/sooplive\.co\.kr\/(?:station\/)?([a-zA-Z0-9_]+)/)
            const extractedId = match ? match[1] : soopId
            map[`__soop__${extractedId}`] = map[m.name]
          }
        }
      }
    })
    return map
  }, [members, liveStatusByMemberId])

  // 티어 멤버가 라이브 중인지 확인 (이름 또는 soop_id로 매칭)
  const isMemberLive = useCallback((m: { player_name: string; soop_id?: string | null }) => {
    if (liveNames.has(m.player_name)) return true
    if (m.soop_id && liveSoopIds.has(m.soop_id)) return true
    return false
  }, [liveNames, liveSoopIds])

  // 티어 멤버의 라이브 정보 조회 (이름 또는 soop_id로 매칭)
  const getMemberLiveInfo = useCallback((m: { player_name: string; soop_id?: string | null }) => {
    const byName = liveInfoByName[m.player_name]
    if (byName) return byName
    if (m.soop_id) {
      const bySoop = liveInfoByName[`__soop__${m.soop_id}`]
      if (bySoop) return bySoop
    }
    return undefined
  }, [liveInfoByName])

  // 라이브 필터 적용 시 멤버 필터링
  const filteredTiers = useMemo(() => {
    if (!showLiveOnly) return tiers
    return tiers.map(tier => ({
      ...tier,
      members: tier.members.filter(m => isMemberLive(m)),
    }))
  }, [tiers, showLiveOnly, isMemberLive])

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
          <TierRow key={tier.id} tier={tier} isMemberLive={isMemberLive} getMemberLiveInfo={getMemberLiveInfo} />
        ))}
      </div>
    </div>
  )
}
