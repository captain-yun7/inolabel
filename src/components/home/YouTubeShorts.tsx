'use client'

import { useEffect, useState } from 'react'
import styles from './YouTubeShorts.module.css'

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

type TabType = 'videos' | 'shorts'

export default function YouTubeShorts() {
  const [activeTab, setActiveTab] = useState<TabType>('videos')
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [shorts, setShorts] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async (type: TabType) => {
      try {
        const res = await fetch(`/api/youtube/shorts?limit=10&type=${type}`)
        const { data } = await res.json()
        return data || []
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err)
        return []
      }
    }

    const init = async () => {
      setIsLoading(true)
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

  const currentData = activeTab === 'videos' ? videos : shorts
  const isShorts = activeTab === 'shorts'

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <span className={styles.badge}>YouTube</span>
          <h3 className={styles.title}>유튜브</h3>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.tabActive}`}>영상</button>
            <button className={styles.tab}>쇼츠</button>
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
          {isShorts ? '쇼츠 콘텐츠 준비 중입니다' : '영상 콘텐츠 준비 중입니다'}
        </div>
      ) : (
        <div className={styles.scrollContainer}>
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
                </a>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
