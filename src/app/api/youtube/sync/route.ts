import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_KIM = process.env.YOUTUBE_CHANNEL_KIM
const YOUTUBE_CHANNEL_INOLABEL = process.env.YOUTUBE_CHANNEL_INOLABEL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const FETCH_TIMEOUT = 20_000
const MAX_PER_CHANNEL = 50 // 채널당 최근 50개 영상까지 조회
const SHORTS_URL_CHECK_TIMEOUT = 5_000

interface YouTubeVideoRecord {
  video_id: string
  channel_id: string
  channel_title: string | null
  content_type: 'video' | 'shorts'
  title: string
  thumbnail: string | null
  view_count: number
  published_at: string
}

/**
 * YouTube 채널 동기화 cron API
 *
 * 두 채널(김인호TV, 김인호의 이노레이블)에서 최근 50개 영상을
 * YouTube Data API v3로 조회하여 youtube_videos 테이블에 upsert
 *
 * 쇼츠/영상 구분: youtube.com/shorts/{id} URL로 HEAD 요청
 * - 쇼츠: 200 OK
 * - 일반 영상: 303 리다이렉트 (/watch?v=...)
 * YouTube 자체 판별 방식이라 duration 기반보다 정확함
 *
 * Vercel Cron으로 3시간마다 호출
 * GET /api/youtube/sync
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY 환경변수가 설정되지 않았습니다.' }, { status: 500 })
  }
  if (!YOUTUBE_CHANNEL_KIM || !YOUTUBE_CHANNEL_INOLABEL) {
    return NextResponse.json({
      error: 'YOUTUBE_CHANNEL_KIM 또는 YOUTUBE_CHANNEL_INOLABEL 환경변수가 설정되지 않았습니다.',
    }, { status: 500 })
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const channels = [
    { id: YOUTUBE_CHANNEL_KIM, label: 'KIM' },
    { id: YOUTUBE_CHANNEL_INOLABEL, label: 'INOLABEL' },
  ]

  const errors: string[] = []
  const allRecords: YouTubeVideoRecord[] = []

  const results = await Promise.allSettled(
    channels.map(ch => fetchChannelVideosViaAPI(ch.id, YOUTUBE_API_KEY!))
  )

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const ch = channels[i]
    if (result.status === 'fulfilled') {
      allRecords.push(...result.value)
    } else {
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
      errors.push(`${ch.label}(${ch.id}): ${reason}`)
      console.error(`[YouTube Sync] ${ch.label} 실패:`, reason)
    }
  }

  if (allRecords.length === 0) {
    return NextResponse.json(
      { error: '모든 채널에서 영상을 가져오지 못했습니다.', errors },
      { status: 500 }
    )
  }

  const { error: upsertError, count } = await supabase
    .from('youtube_videos')
    .upsert(allRecords, { onConflict: 'video_id', count: 'exact' })

  if (upsertError) {
    console.error('[YouTube Sync] DB upsert 실패:', upsertError)
    return NextResponse.json(
      { error: 'DB 저장 실패', details: upsertError.message },
      { status: 500 }
    )
  }

  const stats = {
    total: allRecords.length,
    videos: allRecords.filter(r => r.content_type === 'video').length,
    shorts: allRecords.filter(r => r.content_type === 'shorts').length,
  }

  return NextResponse.json({
    synced: allRecords.length,
    upserted: count,
    stats,
    errors: errors.length > 0 ? errors : undefined,
    message: `${allRecords.length}개 영상 동기화 완료 (video ${stats.videos} / shorts ${stats.shorts})`,
  })
}

/**
 * YouTube Data API v3로 채널 최근 영상 조회
 * 1. 채널 uploads 플레이리스트 ID 추출 (UC... → UU...)
 * 2. playlistItems로 영상 ID 50개 조회
 * 3. videos.list로 duration, 조회수, 썸네일 등 상세 정보 조회
 */
async function fetchChannelVideosViaAPI(channelId: string, apiKey: string): Promise<YouTubeVideoRecord[]> {
  // uploads 플레이리스트 ID: UC{rest} → UU{rest}
  const uploadsPlaylistId = 'UU' + channelId.substring(2)

  // 1. 플레이리스트에서 영상 ID 목록 조회
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsPlaylistId}&maxResults=${MAX_PER_CHANNEL}&part=contentDetails&key=${apiKey}`
  const playlistRes = await fetch(playlistUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })
  if (!playlistRes.ok) {
    const errText = await playlistRes.text()
    throw new Error(`playlistItems HTTP ${playlistRes.status}: ${errText.slice(0, 200)}`)
  }
  const playlistData = await playlistRes.json() as {
    items?: Array<{ contentDetails: { videoId: string } }>
  }
  const videoIds = (playlistData.items || []).map(item => item.contentDetails.videoId)
  if (videoIds.length === 0) return []

  // 2. 영상 상세 정보 (조회수, 썸네일 등) 배치 조회
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(',')}&part=snippet,statistics&key=${apiKey}`
  const videosRes = await fetch(videosUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  })
  if (!videosRes.ok) {
    const errText = await videosRes.text()
    throw new Error(`videos HTTP ${videosRes.status}: ${errText.slice(0, 200)}`)
  }
  const videosData = await videosRes.json() as {
    items?: Array<{
      id: string
      snippet: {
        title: string
        channelTitle: string
        publishedAt: string
        thumbnails: Record<string, { url: string } | undefined>
      }
      statistics: { viewCount?: string }
    }>
  }
  const items = videosData.items || []

  // 3. 각 영상이 shorts인지 URL로 확인 (병렬 HEAD 요청)
  const shortsMap = await checkShortsByURL(items.map(v => v.id))

  return items.map(v => {
    const thumb = v.snippet.thumbnails.maxres?.url
      || v.snippet.thumbnails.standard?.url
      || v.snippet.thumbnails.high?.url
      || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`

    return {
      video_id: v.id,
      channel_id: channelId,
      channel_title: v.snippet.channelTitle || null,
      content_type: shortsMap[v.id] ? 'shorts' : 'video',
      title: v.snippet.title,
      thumbnail: thumb,
      view_count: parseInt(v.statistics.viewCount || '0', 10),
      published_at: v.snippet.publishedAt,
    }
  })
}

/**
 * youtube.com/shorts/{id} URL로 HEAD 요청하여 쇼츠 여부 판별
 * - 200 OK → 쇼츠
 * - 3xx 리다이렉트 → 일반 영상
 */
async function checkShortsByURL(videoIds: string[]): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {}

  await Promise.allSettled(videoIds.map(async id => {
    try {
      const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(SHORTS_URL_CHECK_TIMEOUT),
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      })
      result[id] = res.status === 200
    } catch {
      // 네트워크 실패시 일반 영상으로 간주 (fallback)
      result[id] = false
    }
  }))

  return result
}
