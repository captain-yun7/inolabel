'use client'

import { useState, useEffect, useRef, useCallback, RefObject } from 'react'

interface UseInfiniteScrollOptions {
  /** 뷰포트 도달 전 미리 로드할 여백 (px) */
  rootMargin?: string
  /** 로드 중일 때 추가 로드 방지 */
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  /** 감시할 요소에 연결할 ref */
  sentinelRef: RefObject<HTMLDivElement | null>
  /** 더 로드할 수 있는지 여부 */
  canLoadMore: boolean
  /** 더 로드할 수 있는지 설정 */
  setCanLoadMore: (value: boolean) => void
}

/**
 * 무한 스크롤 훅 - IntersectionObserver 기반
 *
 * @param onLoadMore - 더 로드해야 할 때 호출되는 콜백
 * @param options - 옵션
 * @returns sentinelRef를 페이지 하단에 배치하면 자동으로 onLoadMore 호출
 *
 * @example
 * const { sentinelRef, canLoadMore, setCanLoadMore } = useInfiniteScroll(loadMore)
 *
 * return (
 *   <>
 *     {items.map(...)}
 *     {canLoadMore && <div ref={sentinelRef} />}
 *   </>
 * )
 */
export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { rootMargin = '200px', enabled = true } = options
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const isLoadingRef = useRef(false)

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && enabled && canLoadMore && !isLoadingRef.current) {
        isLoadingRef.current = true
        try {
          await onLoadMore()
        } finally {
          isLoadingRef.current = false
        }
      }
    },
    [onLoadMore, enabled, canLoadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !enabled) return

    // SSR 환경 체크
    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold: 0,
    })

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersection, rootMargin, enabled])

  return {
    sentinelRef,
    canLoadMore,
    setCanLoadMore,
  }
}
