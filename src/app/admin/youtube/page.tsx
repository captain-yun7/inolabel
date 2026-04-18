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
  Plus,
  Trash2,
  X,
  Database,
} from 'lucide-react'
import { createMediaContent, deleteMediaContent, getAllMediaContent } from '@/lib/actions/media'
import type { MediaContent } from '@/types/database'
import styles from '../shared.module.css'

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
}

type MainTab = 'api' | 'manual'
type VideoTab = 'shorts' | 'videos'

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.trim().match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function YouTubeManagePage() {
  const [mainTab, setMainTab] = useState<MainTab>('api')
  const [activeTab, setActiveTab] = useState<VideoTab>('shorts')
  const [shorts, setShorts] = useState<YouTubeVideo[]>([])
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 수동 관리
  const [dbMedia, setDbMedia] = useState<MediaContent[]>([])
  const [dbMediaCount, setDbMediaCount] = useState(0)
  const [dbLoading, setDbLoading] = useState(false)
  const [dbFilter, setDbFilter] = useState<'shorts' | 'vod'>('shorts')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({ url: '', title: '', contentType: 'shorts' as 'shorts' | 'vod' })
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

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

  const fetchDbMedia = useCallback(async () => {
    setDbLoading(true)
    const result = await getAllMediaContent({ contentType: dbFilter, limit: 50 })
    if (result.data) {
      setDbMedia(result.data.data)
      setDbMediaCount(result.data.count)
    }
    setDbLoading(false)
  }, [dbFilter])

  useEffect(() => {
    if (mainTab === 'api') {
      fetchVideos(activeTab)
    } else {
      fetchDbMedia()
    }
  }, [mainTab, activeTab, fetchVideos, fetchDbMedia])

  const handleAdd = async () => {
    const videoId = extractYouTubeId(addForm.url)
    if (!videoId) {
      setError('올바른 YouTube URL 또는 영상 ID를 입력하세요.')
      return
    }
    if (!addForm.title.trim()) {
      setError('제목을 입력하세요.')
      return
    }

    setAdding(true)
    setError(null)
    const result = await createMediaContent({
      content_type: addForm.contentType,
      title: addForm.title.trim(),
      video_url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      cloudflare_uid: null,
    })

    if (result.error) {
      setError(result.error)
    } else {
      setAddForm({ url: '', title: '', contentType: 'shorts' })
      setShowAddForm(false)
      fetchDbMedia()
    }
    setAdding(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('이 영상을 삭제하시겠습니까?')) return
    setDeleting(id)
    const result = await deleteMediaContent(id)
    if (result.error) {
      setError(result.error)
    } else {
      fetchDbMedia()
    }
    setDeleting(null)
  }

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
        {mainTab === 'api' && (
          <button
            onClick={() => fetchVideos(activeTab)}
            className={styles.addButton}
            disabled={isLoading}
            style={{ background: '#ff0000' }}
          >
            <RefreshCw size={16} className={isLoading ? styles.spinning : ''} />
            <span>새로고침</span>
          </button>
        )}
        {mainTab === 'manual' && (
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.addButton}
            style={{ background: '#ff0000' }}
          >
            <Plus size={16} />
            <span>수동 추가</span>
          </button>
        )}
      </header>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setMainTab('api')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '8px 8px 0 0',
            border: 'none',
            background: mainTab === 'api' ? 'rgba(255,0,0,0.1)' : 'transparent',
            color: mainTab === 'api' ? '#ff0000' : 'var(--text-tertiary)',
            fontWeight: mainTab === 'api' ? 600 : 400,
            cursor: 'pointer', fontSize: '0.875rem',
            borderBottom: mainTab === 'api' ? '2px solid #ff0000' : '2px solid transparent',
          }}
        >
          <Youtube size={16} />
          YouTube API
        </button>
        <button
          onClick={() => setMainTab('manual')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '8px 8px 0 0',
            border: 'none',
            background: mainTab === 'manual' ? 'rgba(255,0,0,0.1)' : 'transparent',
            color: mainTab === 'manual' ? '#ff0000' : 'var(--text-tertiary)',
            fontWeight: mainTab === 'manual' ? 600 : 400,
            cursor: 'pointer', fontSize: '0.875rem',
            borderBottom: mainTab === 'manual' ? '2px solid #ff0000' : '2px solid transparent',
          }}
        >
          <Database size={16} />
          수동 관리
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px', color: '#ffc107', fontSize: '0.875rem',
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {mainTab === 'api' && (
        <>
          {/* API Tab Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('shorts')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem', borderRadius: '8px',
                border: `1px solid ${activeTab === 'shorts' ? '#ff0000' : 'var(--card-border)'}`,
                background: activeTab === 'shorts' ? 'rgba(255,0,0,0.1)' : 'var(--card-bg)',
                color: activeTab === 'shorts' ? '#ff0000' : 'var(--text-secondary)',
                fontWeight: activeTab === 'shorts' ? 600 : 400,
                cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s',
              }}
            >
              <Clapperboard size={16} />
              쇼츠
              {shorts.length > 0 && <span style={{ opacity: 0.6 }}>({shorts.length})</span>}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem', borderRadius: '8px',
                border: `1px solid ${activeTab === 'videos' ? '#ff0000' : 'var(--card-border)'}`,
                background: activeTab === 'videos' ? 'rgba(255,0,0,0.1)' : 'var(--card-bg)',
                color: activeTab === 'videos' ? '#ff0000' : 'var(--text-secondary)',
                fontWeight: activeTab === 'videos' ? 600 : 400,
                cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s',
              }}
            >
              <Film size={16} />
              영상
              {videos.length > 0 && <span style={{ opacity: 0.6 }}>({videos.length})</span>}
            </button>
          </div>

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
              <code>YOUTUBE_CHANNEL_KIM</code> - 김인호 채널 ID<br />
              <code>YOUTUBE_CHANNEL_INOLABEL</code> - INOLABEL 채널 ID
            </div>
          </div>

          {/* Video Grid (API) */}
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              <RefreshCw size={24} className={styles.spinning} />
            </div>
          ) : currentVideos.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem', color: 'var(--text-tertiary)' }}>
              <Youtube size={48} style={{ opacity: 0.3 }} />
              <p>{activeTab === 'shorts' ? '쇼츠' : '영상'}이 없습니다</p>
              <p style={{ fontSize: '0.8125rem' }}>
                YouTube API 키와 채널 ID가 올바르게 설정되어 있는지 확인하세요.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {currentVideos.map((video) => (
                <div
                  key={video.id}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    overflow: 'hidden', transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <Image src={video.thumbnail} alt={video.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 280px" />
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <h3 style={{
                      fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)',
                      marginBottom: '0.5rem', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', lineHeight: 1.4,
                    }}>
                      {video.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      <span>{formatDate(video.publishedAt)}</span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ff0000', textDecoration: 'none', fontSize: '0.75rem' }}
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
        </>
      )}

      {mainTab === 'manual' && (
        <>
          {/* Add Form Modal */}
          {showAddForm && (
            <div style={{
              padding: '1.25rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>YouTube 영상 수동 추가</h3>
                <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>유형</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['shorts', 'vod'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setAddForm({ ...addForm, contentType: type })}
                        style={{
                          padding: '0.5rem 1rem', borderRadius: '6px',
                          border: `1px solid ${addForm.contentType === type ? '#ff0000' : 'var(--card-border)'}`,
                          background: addForm.contentType === type ? 'rgba(255,0,0,0.1)' : 'transparent',
                          color: addForm.contentType === type ? '#ff0000' : 'var(--text-secondary)',
                          cursor: 'pointer', fontSize: '0.8125rem', fontWeight: addForm.contentType === type ? 600 : 400,
                        }}
                      >
                        {type === 'shorts' ? '쇼츠' : 'VOD'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>YouTube URL 또는 영상 ID</label>
                  <input
                    type="text"
                    value={addForm.url}
                    onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... 또는 영상 ID"
                    style={{
                      width: '100%', padding: '0.625rem 0.75rem', borderRadius: '6px',
                      border: '1px solid var(--card-border)', background: 'var(--bg-primary)',
                      color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>제목</label>
                  <input
                    type="text"
                    value={addForm.title}
                    onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                    placeholder="영상 제목"
                    style={{
                      width: '100%', padding: '0.625rem 0.75rem', borderRadius: '6px',
                      border: '1px solid var(--card-border)', background: 'var(--bg-primary)',
                      color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  style={{
                    alignSelf: 'flex-end',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 1.25rem', borderRadius: '8px',
                    border: 'none', background: '#ff0000', color: '#fff',
                    fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    opacity: adding ? 0.6 : 1,
                  }}
                >
                  {adding ? <RefreshCw size={14} className={styles.spinning} /> : <Plus size={14} />}
                  추가
                </button>
              </div>
            </div>
          )}

          {/* DB Filter */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['shorts', 'vod'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDbFilter(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.25rem', borderRadius: '8px',
                  border: `1px solid ${dbFilter === type ? '#ff0000' : 'var(--card-border)'}`,
                  background: dbFilter === type ? 'rgba(255,0,0,0.1)' : 'var(--card-bg)',
                  color: dbFilter === type ? '#ff0000' : 'var(--text-secondary)',
                  fontWeight: dbFilter === type ? 600 : 400,
                  cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s',
                }}
              >
                {type === 'shorts' ? <><Clapperboard size={16} />쇼츠</> : <><Film size={16} />VOD</>}
                {dbMediaCount > 0 && <span style={{ opacity: 0.6 }}>({dbMediaCount})</span>}
              </button>
            ))}
          </div>

          {/* DB Media Grid */}
          {dbLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              <RefreshCw size={24} className={styles.spinning} />
            </div>
          ) : dbMedia.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem', color: 'var(--text-tertiary)' }}>
              <Database size={48} style={{ opacity: 0.3 }} />
              <p>등록된 {dbFilter === 'shorts' ? '쇼츠' : 'VOD'}가 없습니다</p>
              <p style={{ fontSize: '0.8125rem' }}>수동 추가 버튼으로 YouTube 영상을 등록하세요.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {dbMedia.map((media) => (
                <div
                  key={media.id}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    overflow: 'hidden', transition: 'border-color 0.2s',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    {media.thumbnail_url ? (
                      <Image src={media.thumbnail_url} alt={media.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 280px" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Film size={32} style={{ opacity: 0.3 }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <h3 style={{
                      fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)',
                      marginBottom: '0.5rem', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', lineHeight: 1.4,
                    }}>
                      {media.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      <span>{formatDate(media.created_at)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <a
                          href={media.video_url}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ff0000', textDecoration: 'none', fontSize: '0.75rem' }}
                        >
                          <ExternalLink size={12} />
                          보기
                        </a>
                        <button
                          onClick={() => handleDelete(media.id)}
                          disabled={deleting === media.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            background: 'none', border: 'none', color: 'var(--text-tertiary)',
                            cursor: 'pointer', fontSize: '0.75rem', padding: 0,
                            opacity: deleting === media.id ? 0.5 : 1,
                          }}
                        >
                          <Trash2 size={12} />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
