import { NextRequest, NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { createClient } from '@supabase/supabase-js'

// 두 채널 모두에서 영상을 가져옴
const YOUTUBE_CHANNEL_ID_SHORTS = process.env.YOUTUBE_CHANNEL_ID_SHORTS || process.env.YOUTUBE_CHANNEL_ID
const YOUTUBE_CHANNEL_ID_MAIN = process.env.YOUTUBE_CHANNEL_ID_MAIN

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
  viewCount: number
}

// 타입별 캐시
const cache: Record<string, { data: YouTubeVideo[]; timestamp: number }> = {}
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6시간
const FETCH_TIMEOUT = 10_000

/**
 * YouTube RSS 기반 영상 조회 (API 키 불필요, 쿼터 제한 없음)
 *
 * RSS 피드의 link URL로 shorts/videos 자동 구분:
 * - /shorts/ → 쇼츠
 * - /watch?v= → 일반 영상
 *
 * 조회수도 RSS media:statistics에서 가져옴
 *
 * GET /api/youtube/shorts?limit=10&type=shorts
 * GET /api/youtube/shorts?limit=10&type=videos
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 15)
  const type = searchParams.get('type') === 'videos' ? 'videos' : 'shorts'

  // 캐시 확인
  const cached = cache[type]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ data: cached.data.slice(0, limit) })
  }

  try {
    // 두 채널 RSS를 모두 가져오기
    const channelIds = [YOUTUBE_CHANNEL_ID_MAIN, YOUTUBE_CHANNEL_ID_SHORTS].filter(Boolean) as string[]

    if (channelIds.length === 0) {
      return NextResponse.json({ data: [], message: '채널 ID 환경변수를 설정하세요.' })
    }

    const allVideos: YouTubeVideo[] = []

    const results = await Promise.allSettled(
      channelIds.map(id => fetchRSS(id))
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value)
      }
    }

    // RSS에서 하나도 못 가져왔으면 DB 캐시에서 읽기
    if (allVideos.length === 0) {
      const dbData = await loadFromDB(type)
      if (dbData.length > 0) {
        console.log(`[YouTube RSS] RSS 실패 → DB 캐시에서 ${type} ${dbData.length}개 로드`)
        return NextResponse.json({ data: dbData.slice(0, limit), source: 'db_cache' })
      }
    }

    const rssVideos = allVideos as RSSVideo[]
    const filtered = type === 'shorts'
      ? rssVideos.filter(v => v._isShort)
      : rssVideos.filter(v => !v._isShort)

    // 최신순 정렬 + _isShort 제거
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    const videos: YouTubeVideo[] = filtered.map(({ _isShort, ...rest }) => rest)

    // 캐시 업데이트 (메모리 + DB)
    cache[type] = { data: videos, timestamp: Date.now() }
    if (videos.length > 0) {
      saveToDB(type, videos).catch(err => console.error('[YouTube DB Cache] 저장 실패:', err))
    }

    return NextResponse.json({ data: videos.slice(0, limit) })
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError'
    console.error(`[YouTube RSS] ${isTimeout ? 'TIMEOUT' : 'FETCH_ERROR'}:`, error)

    // RSS 실패 시 DB 캐시에서 읽기
    const dbData = await loadFromDB(type)
    if (dbData.length > 0) {
      console.log(`[YouTube RSS] 에러 → DB 캐시에서 ${type} ${dbData.length}개 로드`)
      return NextResponse.json({ data: dbData.slice(0, limit), source: 'db_cache' })
    }

    return NextResponse.json(
      { data: cached?.data.slice(0, limit) || [], error: '영상을 불러오는 데 실패했습니다' },
      { status: 200 }
    )
  }
}

// DB 캐시 (site_settings 활용)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function saveToDB(type: string, videos: YouTubeVideo[]) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return
  await supabase.from('site_settings').upsert(
    { key: `youtube_cache_${type}`, value: JSON.stringify({ videos, updated_at: new Date().toISOString() }) },
    { onConflict: 'key' }
  )
}

async function loadFromDB(type: string): Promise<YouTubeVideo[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', `youtube_cache_${type}`)
    .maybeSingle()
  if (!data?.value) return []
  try {
    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
    return parsed.videos || []
  } catch {
    return []
  }
}

interface RSSVideo extends YouTubeVideo {
  _isShort: boolean
}

async function fetchRSS(channelId: string): Promise<RSSVideo[]> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const response = await fetch(rssUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })

  if (!response.ok) {
    console.error(`[YouTube RSS] Channel ${channelId} error: ${response.status}`)
    return []
  }

  const xml = await response.text()
  const parser = new XMLParser({ ignoreAttributes: false })
  const rss = parser.parse(xml)

  const entries = rss?.feed?.entry
  if (!entries) return []

  const entryList = Array.isArray(entries) ? entries : [entries]
  const channelTitle = rss?.feed?.author?.name || ''

  return entryList.map((entry: Record<string, unknown>) => {
    const videoId = entry['yt:videoId'] as string
    const link = entry.link as { '@_href'?: string } | { '@_href'?: string }[]
    const altLink = Array.isArray(link)
      ? link.find(l => l['@_href']?.includes('youtube.com'))?.['@_href'] || ''
      : (link?.['@_href'] || '')

    // RSS link로 shorts 여부 판별
    const isShort = altLink.includes('/shorts/')

    // RSS media:statistics에서 조회수
    const mediaGroup = entry['media:group'] as Record<string, unknown> | undefined
    const community = mediaGroup?.['media:community'] as Record<string, unknown> | undefined
    const stats = community?.['media:statistics'] as Record<string, string> | undefined
    const viewCount = parseInt(stats?.['@_views'] || '0', 10)

    const thumbnail = (mediaGroup?.['media:thumbnail'] as Record<string, string> | undefined)?.['@_url']
      || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    return {
      id: videoId,
      title: entry.title as string,
      thumbnail,
      publishedAt: entry.published as string,
      channelTitle,
      viewCount,
      _isShort: isShort,
    }
  })
}
