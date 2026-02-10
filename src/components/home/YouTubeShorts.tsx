'use client'

import { useEffect, useState } from 'react'
import styles from './YouTubeShorts.module.css'

interface ShortsVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

export default function YouTubeShorts() {
  const [shorts, setShorts] = useState<ShortsVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await fetch('/api/youtube/shorts?limit=10')
        const { data } = await res.json()
        setShorts(data || [])
      } catch (err) {
        console.error('Failed to fetch shorts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShorts()
  }, [])

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <span className={styles.badge}>SHORTS</span>
          <h3 className={styles.title}>유튜브 쇼츠</h3>
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

  if (shorts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <span className={styles.badge}>SHORTS</span>
          <h3 className={styles.title}>유튜브 쇼츠</h3>
        </div>
        <div className={styles.empty}>
          쇼츠 콘텐츠 준비 중입니다
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>SHORTS</span>
        <h3 className={styles.title}>유튜브 쇼츠</h3>
      </div>
      <div className={styles.scrollContainer}>
        <div className={styles.grid}>
          {shorts.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/shorts/${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.thumbnail}>
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
          ))}
        </div>
      </div>
    </section>
  )
}
