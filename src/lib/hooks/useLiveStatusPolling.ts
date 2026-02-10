'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useLiveRoster } from './useLiveRoster'

interface UseLiveStatusPollingOptions {
  /** 폴링 간격 (밀리초), 기본값 60000 (1분) */
  interval?: number
  /** 폴링 활성화 여부, 기본값 true */
  enabled?: boolean
  /** 페이지 visibility 기반 자동 일시정지, 기본값 true */
  pauseOnHidden?: boolean
}

interface UseLiveStatusPollingReturn {
  /** 라이브 중인 멤버 수 */
  liveCount: number
  /** 전체 멤버 목록 */
  members: ReturnType<typeof useLiveRoster>['members']
  /** 멤버별 라이브 상태 */
  liveStatusByMemberId: ReturnType<typeof useLiveRoster>['liveStatusByMemberId']
  /** 로딩 상태 */
  isLoading: boolean
  /** 마지막 업데이트 시간 */
  lastUpdated: Date | null
  /** 수동 새로고침 */
  refresh: () => Promise<void>
}

/**
 * 라이브 상태 폴링 훅
 *
 * useLiveRoster를 기반으로 주기적인 폴링과 페이지 가시성 기반 자동 일시정지 기능 제공
 */
export function useLiveStatusPolling(
  options: UseLiveStatusPollingOptions = {}
): UseLiveStatusPollingReturn {
  const {
    interval = 60000, // 1분
    enabled = true,
    pauseOnHidden = true,
  } = options

  const { members, liveStatusByMemberId, isLoading, refetch } = useLiveRoster({
    realtime: true,
  })

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isVisibleRef = useRef(true)

  const liveCount = members.filter((m) => m.is_live).length

  const refresh = useCallback(async () => {
    await refetch()
    setLastUpdated(new Date())
  }, [refetch])

  // 폴링 설정
  useEffect(() => {
    if (!enabled) return

    const startPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        if (!pauseOnHidden || isVisibleRef.current) {
          refresh()
        }
      }, interval)
    }

    startPolling()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, pauseOnHidden, refresh])

  // 페이지 가시성 변화 감지
  useEffect(() => {
    if (!pauseOnHidden) return

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible'

      // 페이지가 다시 보이면 즉시 새로고침
      if (isVisibleRef.current) {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pauseOnHidden, refresh])

  // 초기 로드 시 lastUpdated 설정
  useEffect(() => {
    if (!isLoading && lastUpdated === null) {
      setLastUpdated(new Date())
    }
  }, [isLoading, lastUpdated])

  return {
    liveCount,
    members,
    liveStatusByMemberId,
    isLoading,
    lastUpdated,
    refresh,
  }
}
