import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Shorts 기준: 60초 이하
const SHORTS_MAX_DURATION = 60

/**
 * YouTube 채널 동기화 API
 *
 * Vercel Cron으로 주기적 호출 → YouTube 채널의 최신 영상을 media_content에 동기화
 * playlistItems.list (1유닛/호출) + videos.list (1유닛/호출) 사용으로 쿼터 절약
 *
 * GET /api/youtube/sync
 */
export async function GET(request: Request) {
  // Vercel Cron 인증 (프로덕션)
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json({
      error: 'YOUTUBE_API_KEY 또는 YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.',
    }, { status: 500 })
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({
      error: 'Supabase 환경변수가 설정되지 않았습니다.',
    }, { status: 500 })
  }

  const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    // 1. 채널의 uploads 플레이리스트 ID 조회
    const uploadsPlaylistId = await getUploadsPlaylistId(YOUTUBE_CHANNEL_ID)
    if (!uploadsPlaylistId) {
      return NextResponse.json({ error: '채널의 업로드 플레이리스트를 찾을 수 없습니다.' }, { status: 500 })
    }

    // 2. 최신 영상 목록 가져오기 (최대 50개)
    const playlistItems = await fetchPlaylistItems(uploadsPlaylistId, 50)
    if (playlistItems.length === 0) {
      return NextResponse.json({ synced: 0, message: '동기화할 영상이 없습니다.' })
    }

    // 3. 영상 상세 정보 가져오기 (duration, viewCount 등)
    const videoIds = playlistItems.map(item => item.videoId)
    const videoDetails = await fetchVideoDetails(videoIds)

    // 4. DB에 기존 영상 확인 (video_url 기준)
    const videoUrls = videoIds.map(id => `https://www.youtube.com/watch?v=${id}`)
    const { data: existing } = await supabase
      .from('media_content')
      .select('id, video_url, view_count')
      .in('video_url', videoUrls)

    const existingMap = new Map(
      (existing || []).map(row => [row.video_url, row])
    )

    // 5. Upsert 처리
    let inserted = 0
    let updated = 0

    for (const item of playlistItems) {
      const details = videoDetails.get(item.videoId)
      if (!details) continue

      const videoUrl = `https://www.youtube.com/watch?v=${item.videoId}`
      const durationSeconds = parseDuration(details.duration)
      const contentType = durationSeconds <= SHORTS_MAX_DURATION ? 'shorts' : 'vod'
      const viewCount = parseInt(details.viewCount || '0', 10)

      const existingRow = existingMap.get(videoUrl)

      if (existingRow) {
        // 기존 영상: 조회수, 썸네일 업데이트
        await supabase
          .from('media_content')
          .update({
            view_count: viewCount,
            thumbnail_url: item.thumbnail,
            title: item.title,
          })
          .eq('id', existingRow.id)
        updated++
      } else {
        // 새 영상: insert
        await supabase
          .from('media_content')
          .insert({
            content_type: contentType,
            title: item.title,
            description: item.description || null,
            thumbnail_url: item.thumbnail,
            video_url: videoUrl,
            duration: durationSeconds,
            view_count: viewCount,
            is_featured: false,
            part_number: 1,
            total_parts: 1,
          })
        inserted++
      }
    }

    return NextResponse.json({
      synced: playlistItems.length,
      inserted,
      updated,
      message: `동기화 완료: ${inserted}개 추가, ${updated}개 갱신`,
    })
  } catch (error) {
    console.error('YouTube sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'YouTube 동기화 실패' },
      { status: 500 }
    )
  }
}

/**
 * 채널 ID로 uploads 플레이리스트 ID 조회
 * channels.list = 1 유닛
 */
async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'contentDetails')
  url.searchParams.set('id', channelId)
  url.searchParams.set('key', YOUTUBE_API_KEY!)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = await res.json()
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null
}

/**
 * 플레이리스트의 영상 목록 조회
 * playlistItems.list = 1 유닛
 */
async function fetchPlaylistItems(
  playlistId: string,
  maxResults: number
): Promise<Array<{
  videoId: string
  title: string
  description: string | null
  thumbnail: string
  publishedAt: string
}>> {
  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('playlistId', playlistId)
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', YOUTUBE_API_KEY!)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`playlistItems API 실패: ${text}`)
  }

  const data = await res.json()

  return (data.items || []).map((item: {
    snippet: {
      resourceId: { videoId: string }
      title: string
      description: string
      thumbnails: Record<string, { url: string }>
      publishedAt: string
    }
  }) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description || null,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      '',
    publishedAt: item.snippet.publishedAt,
  }))
}

/**
 * 영상 상세 정보 조회 (duration, viewCount)
 * videos.list = 1 유닛 (최대 50개 한번에)
 */
async function fetchVideoDetails(
  videoIds: string[]
): Promise<Map<string, { duration: string; viewCount: string }>> {
  const result = new Map<string, { duration: string; viewCount: string }>()
  if (videoIds.length === 0) return result

  const url = new URL('https://www.googleapis.com/youtube/v3/videos')
  url.searchParams.set('part', 'contentDetails,statistics')
  url.searchParams.set('id', videoIds.join(','))
  url.searchParams.set('key', YOUTUBE_API_KEY!)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`videos API 실패: ${text}`)
  }

  const data = await res.json()

  for (const item of data.items || []) {
    result.set(item.id, {
      duration: item.contentDetails?.duration || 'PT0S',
      viewCount: item.statistics?.viewCount || '0',
    })
  }

  return result
}

/**
 * ISO 8601 duration → 초 변환
 * PT1H2M3S → 3723
 * PT45S → 45
 */
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)

  return hours * 3600 + minutes * 60 + seconds
}
