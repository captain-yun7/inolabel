'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

interface UseLazyLoadOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseLazyLoadReturn<T extends HTMLElement> {
  ref: RefObject<T | null>
  isVisible: boolean
  hasLoaded: boolean
}

/**
 * Lazy loading hook using IntersectionObserver
 * - threshold: 요소가 뷰포트에 몇 % 들어왔을 때 트리거 (0-1)
 * - rootMargin: 뷰포트 마진 (예: "100px" = 100px 전에 미리 로드)
 * - triggerOnce: true면 한 번 보이면 계속 visible 상태 유지
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn<T> {
  const { threshold = 0, rootMargin = '100px', triggerOnce = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // SSR 환경에서는 바로 visible로 처리
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      setHasLoaded(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting

        if (isInView) {
          setIsVisible(true)
          setHasLoaded(true)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible, hasLoaded }
}
