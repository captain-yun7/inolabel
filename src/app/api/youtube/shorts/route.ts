import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
// 쇼츠 채널 (@INOLABEL-KIMINHO)
const YOUTUBE_CHANNEL_ID_SHORTS = process.env.YOUTUBE_CHANNEL_ID_SHORTS || process.env.YOUTUBE_CHANNEL_ID
// 일반 영상 채널 (@kiminho22)
const YOUTUBE_CHANNEL_ID_MAIN = process.env.YOUTUBE_CHANNEL_ID_MAIN

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
}

// 타입별 캐시 (shorts / videos)
const cache: Record<string, { data: YouTubeVideo[]; timestamp: number }> = {}
const CACHE_TTL = 10 * 60 * 1000

/**
 * YouTube 영상 목록 조회 API
 *
 * GET /api/youtube/shorts?limit=10&type=shorts  - 쇼츠 (기본)
 * GET /api/youtube/shorts?limit=10&type=videos  - 일반 영상
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)
  const type = searchParams.get('type') === 'videos' ? 'videos' : 'shorts'

  const channelId = type === 'videos' ? YOUTUBE_CHANNEL_ID_MAIN : YOUTUBE_CHANNEL_ID_SHORTS

  // API 키 미설정 시 빈 배열 반환
  if (!YOUTUBE_API_KEY || !channelId) {
    return NextResponse.json({
      data: [],
      message: type === 'videos'
        ? 'YOUTUBE_CHANNEL_ID_MAIN 환경변수를 설정하세요.'
        : 'YouTube API가 설정되지 않았습니다. YOUTUBE_API_KEY와 YOUTUBE_CHANNEL_ID_SHORTS 환경변수를 설정하세요.',
    })
  }

  // 캐시 확인
  const cached = cache[type]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ data: cached.data.slice(0, limit) })
  }

  try {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('channelId', channelId)
    searchUrl.searchParams.set('maxResults', '50')
    searchUrl.searchParams.set('order', 'date')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)

    // 쇼츠는 60초 이하, 일반 영상은 medium 이상
    if (type === 'shorts') {
      searchUrl.searchParams.set('videoDuration', 'short')
    } else {
      searchUrl.searchParams.set('videoDuration', 'medium')
    }

    const response = await fetch(searchUrl.toString())

    if (!response.ok) {
      const errorText = await response.text()
      console.error('YouTube API error:', errorText)
      return NextResponse.json(
        { data: cached?.data.slice(0, limit) || [], error: 'YouTube API 호출 실패' },
        { status: 200 }
      )
    }

    const data = await response.json()

    const videos: YouTubeVideo[] = (data.items || []).map((item: {
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
    cache[type] = { data: videos, timestamp: Date.now() }

    return NextResponse.json({ data: videos.slice(0, limit) })
  } catch (error) {
    console.error('YouTube fetch error:', error)
    return NextResponse.json(
      { data: cached?.data.slice(0, limit) || [], error: '영상을 불러오는 데 실패했습니다' },
      { status: 200 }
    )
  }
}
