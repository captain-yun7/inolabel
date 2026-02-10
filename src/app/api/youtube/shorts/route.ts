import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
}

// 10분 캐시
let cachedShorts: YouTubeVideo[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 10 * 60 * 1000

/**
 * YouTube Shorts 목록 조회 API
 *
 * GET /api/youtube/shorts?limit=10
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)

  // API 키 미설정 시 빈 배열 반환
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json({
      data: [],
      message: 'YouTube API가 설정되지 않았습니다. YOUTUBE_API_KEY와 YOUTUBE_CHANNEL_ID 환경변수를 설정하세요.',
    })
  }

  // 캐시 확인
  if (cachedShorts && Date.now() - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ data: cachedShorts.slice(0, limit) })
  }

  try {
    // YouTube Data API v3로 최신 Shorts 검색
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('channelId', YOUTUBE_CHANNEL_ID)
    searchUrl.searchParams.set('maxResults', '50')
    searchUrl.searchParams.set('order', 'date')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('videoDuration', 'short') // Shorts는 60초 이하
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const response = await fetch(searchUrl.toString())

    if (!response.ok) {
      const errorText = await response.text()
      console.error('YouTube API error:', errorText)
      return NextResponse.json(
        { data: cachedShorts?.slice(0, limit) || [], error: 'YouTube API 호출 실패' },
        { status: 200 } // 에러여도 캐시된 데이터 반환
      )
    }

    const data = await response.json()

    const shorts: YouTubeVideo[] = (data.items || []).map((item: {
      id: { videoId: string }
      snippet: {
        title: string
        thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }
        publishedAt: string
        channelTitle: string
      }
    }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url
        || item.snippet.thumbnails?.medium?.url
        || item.snippet.thumbnails?.default?.url
        || '',
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
    }))

    // 캐시 업데이트
    cachedShorts = shorts
    cacheTimestamp = Date.now()

    return NextResponse.json({ data: shorts.slice(0, limit) })
  } catch (error) {
    console.error('YouTube Shorts fetch error:', error)
    return NextResponse.json(
      { data: cachedShorts?.slice(0, limit) || [], error: '쇼츠를 불러오는 데 실패했습니다' },
      { status: 200 }
    )
  }
}
