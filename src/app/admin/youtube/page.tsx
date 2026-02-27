'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Youtube,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Film,
  Clapperboard,
} from 'lucide-react'
import styles from '../shared.module.css'

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
}

type VideoTab = 'shorts' | 'videos'

export default function YouTubeManagePage() {
  const [activeTab, setActiveTab] = useState<VideoTab>('shorts')
  const [shorts, setShorts] = useState<YouTubeVideo[]>([])
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async (type: VideoTab) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/youtube/shorts?type=${type}&limit=20`)
      const data = await res.json()

      if (data.error) {
        setError(data.message || data.error)
      }

      if (type === 'shorts') {
        setShorts(data.data || [])
      } else {
        setVideos(data.data || [])
      }
    } catch {
      setError('YouTube API 호출에 실패했습니다.')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchVideos(activeTab)
  }, [activeTab, fetchVideos])

  const currentVideos = activeTab === 'shorts' ? shorts : videos

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Youtube size={24} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>유튜브 관리</h1>
            <p className={styles.subtitle}>YouTube 채널 영상 목록 확인 및 관리</p>
          </div>
        </div>
        <button
          onClick={() => fetchVideos(activeTab)}
          className={styles.addButton}
          disabled={isLoading}
          style={{ background: '#ff0000' }}
        >
          <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
          <span>새로고침</span>
        </button>
      </header>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('shorts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '8px',
            border: `1px solid ${activeTab === 'shorts' ? '#ff0000' : 'var(--card-border)'}`,
            background: activeTab === 'shorts' ? 'rgba(255,0,0,0.1)' : 'var(--card-bg)',
            color: activeTab === 'shorts' ? '#ff0000' : 'var(--text-secondary)',
            fontWeight: activeTab === 'shorts' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}
        >
          <Clapperboard size={16} />
          쇼츠
          {shorts.length > 0 && <span style={{ opacity: 0.6 }}>({shorts.length})</span>}
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '8px',
            border: `1px solid ${activeTab === 'videos' ? '#ff0000' : 'var(--card-border)'}`,
            background: activeTab === 'videos' ? 'rgba(255,0,0,0.1)' : 'var(--card-bg)',
            color: activeTab === 'videos' ? '#ff0000' : 'var(--text-secondary)',
            fontWeight: activeTab === 'videos' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}
        >
          <Film size={16} />
          영상
          {videos.length > 0 && <span style={{ opacity: 0.6 }}>({videos.length})</span>}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px',
          color: '#ffc107',
          fontSize: '0.875rem',
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* API Key Info */}
      <div style={{
        padding: '1rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        fontSize: '0.8125rem',
        color: 'var(--text-tertiary)',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--text-secondary)' }}>환경변수 설정</strong>
        <div style={{ marginTop: '0.5rem' }}>
          <code>YOUTUBE_API_KEY</code> - YouTube Data API v3 키<br />
          <code>YOUTUBE_CHANNEL_ID_SHORTS</code> - 쇼츠 채널 ID<br />
          <code>YOUTUBE_CHANNEL_ID_MAIN</code> - 메인 채널 ID
        </div>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '3rem',
          color: 'var(--text-tertiary)',
        }}>
          <RefreshCw size={24} className={styles.spinning} />
        </div>
      ) : currentVideos.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem',
          color: 'var(--text-tertiary)',
        }}>
          <Youtube size={48} style={{ opacity: 0.3 }} />
          <p>{activeTab === 'shorts' ? '쇼츠' : '영상'}이 없습니다</p>
          <p style={{ fontSize: '0.8125rem' }}>
            YouTube API 키와 채널 ID가 올바르게 설정되어 있는지 확인하세요.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {currentVideos.map((video) => (
            <div
              key={video.id}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                }}>
                  {video.title}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                }}>
                  <span>{formatDate(video.publishedAt)}</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: '#ff0000',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                    }}
                  >
                    <ExternalLink size={12} />
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
