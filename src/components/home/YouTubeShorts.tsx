'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './YouTubeShorts.module.css'

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  viewCount: number
}

function formatViewCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(count >= 100000 ? 0 : 1)}만회`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천회`
  return `${count}회`
}

type TabType = 'videos' | 'shorts'

export default function YouTubeShorts() {
  const [activeTab, setActiveTab] = useState<TabType>('shorts')
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [shorts, setShorts] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async (type: TabType) => {
      try {
        const res = await fetch(`/api/youtube/shorts?limit=15&type=${type}`)
        const json = await res.json()
        if (json.error) setErrorMsg(json.error)
        return json.data || []
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err)
        return []
      }
    }

    const init = async () => {
      setIsLoading(true)
      setErrorMsg(null)
      const [videosData, shortsData] = await Promise.all([
        fetchData('videos'),
        fetchData('shorts'),
      ])
      setVideos(videosData)
      setShorts(shortsData)
      setIsLoading(false)
    }

    init()
  }, [])

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateScrollButtons()
  }, [activeTab, videos, shorts, isLoading, updateScrollButtons])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollButtons)
  }, [updateScrollButtons, isLoading, activeTab])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = activeTab === 'videos' ? 272 : 152 // width + gap
    const scrollAmount = cardWidth * 3
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const currentData = activeTab === 'videos' ? videos : shorts
  const isShorts = activeTab === 'shorts'

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <span className={styles.badge}>YouTube</span>
          <h3 className={styles.title}>유튜브</h3>
          <div className={styles.tabs}>
            <button className={styles.tab}>영상</button>
            <button className={`${styles.tab} ${styles.tabActive}`}>쇼츠</button>
          </div>
        </div>
        <div className={styles.scrollContainer}>
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>YouTube</span>
        <h3 className={styles.title}>유튜브</h3>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'videos' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            영상
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'shorts' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('shorts')}
          >
            쇼츠
          </button>
        </div>
      </div>

      {currentData.length === 0 ? (
        <div className={styles.empty}>
          {errorMsg
            ? '일시적으로 영상을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.'
            : isShorts ? '쇼츠 콘텐츠 준비 중입니다' : '영상 콘텐츠 준비 중입니다'}
        </div>
      ) : (
        <div className={styles.carouselWrapper}>
          {canScrollLeft && (
            <button
              className={`${styles.navButton} ${styles.navLeft}`}
              onClick={() => scroll('left')}
              aria-label="이전"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className={styles.scrollContainer} ref={scrollRef}>
            <div className={styles.grid}>
              {currentData.map((video) => {
                const videoUrl = isShorts
                  ? `https://www.youtube.com/shorts/${video.id}`
                  : `https://www.youtube.com/watch?v=${video.id}`

                return (
                  <a
                    key={video.id}
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.card}
                    data-type={activeTab}
                  >
                    <div className={isShorts ? styles.thumbnail : styles.thumbnailWide}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                      />
                      <div className={styles.playOverlay}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className={styles.cardTitle}>{video.title}</span>
                    {video.viewCount > 0 && (
                      <span className={styles.cardMeta}>
                        조회수 {formatViewCount(video.viewCount)}
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
          {canScrollRight && (
            <button
              className={`${styles.navButton} ${styles.navRight}`}
              onClick={() => scroll('right')}
              aria-label="다음"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </section>
  )
}
