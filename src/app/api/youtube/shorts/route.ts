import { NextRequest, NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

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

    const rssVideos = allVideos as RSSVideo[]
    const filtered = type === 'shorts'
      ? rssVideos.filter(v => v._isShort)
      : rssVideos.filter(v => !v._isShort)

    // 최신순 정렬 + _isShort 제거
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    const videos: YouTubeVideo[] = filtered.map(({ _isShort, ...rest }) => rest)

    // 캐시 업데이트
    cache[type] = { data: videos, timestamp: Date.now() }

    return NextResponse.json({ data: videos.slice(0, limit) })
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'TimeoutError'
    console.error(`[YouTube RSS] ${isTimeout ? 'TIMEOUT' : 'FETCH_ERROR'}:`, error)
    return NextResponse.json(
      { data: cached?.data.slice(0, limit) || [], error: '영상을 불러오는 데 실패했습니다' },
      { status: 200 }
    )
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
