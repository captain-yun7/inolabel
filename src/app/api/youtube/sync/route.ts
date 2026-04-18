import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { createClient } from '@supabase/supabase-js'

const YOUTUBE_CHANNEL_KIM = process.env.YOUTUBE_CHANNEL_KIM
const YOUTUBE_CHANNEL_INOLABEL = process.env.YOUTUBE_CHANNEL_INOLABEL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const FETCH_TIMEOUT = 15_000

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
 * 두 채널(김인호TV, 김인호의 이노레이블)의 RSS를 가져와서
 * youtube_videos 테이블에 upsert
 *
 * Vercel Cron으로 3시간마다 호출
 *
 * GET /api/youtube/sync
 */
export async function GET(request: Request) {
  // Vercel Cron 인증 (프로덕션)
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!YOUTUBE_CHANNEL_KIM || !YOUTUBE_CHANNEL_INOLABEL) {
    return NextResponse.json({
      error: 'YOUTUBE_CHANNEL_KIM 또는 YOUTUBE_CHANNEL_INOLABEL 환경변수가 설정되지 않았습니다.',
    }, { status: 500 })
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({
      error: 'Supabase 환경변수가 설정되지 않았습니다.',
    }, { status: 500 })
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
    channels.map(ch => fetchChannelVideos(ch.id))
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

  // video_id 기준 upsert (중복 자동 제거)
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

  return NextResponse.json({
    synced: allRecords.length,
    upserted: count,
    errors: errors.length > 0 ? errors : undefined,
    message: `${allRecords.length}개 영상 동기화 완료`,
  })
}

async function fetchChannelVideos(channelId: string): Promise<YouTubeVideoRecord[]> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const response = await fetch(rssUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: { 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`RSS HTTP ${response.status}`)
  }

  const xml = await response.text()
  const parser = new XMLParser({ ignoreAttributes: false })
  const rss = parser.parse(xml)

  const entries = rss?.feed?.entry
  if (!entries) return []

  const entryList = Array.isArray(entries) ? entries : [entries]
  const channelTitle = (rss?.feed?.author?.name as string) || ''

  return entryList.map((entry: Record<string, unknown>) => {
    const videoId = entry['yt:videoId'] as string
    const link = entry.link as { '@_href'?: string } | { '@_href'?: string }[]
    const altLink = Array.isArray(link)
      ? link.find(l => l['@_href']?.includes('youtube.com'))?.['@_href'] || ''
      : (link?.['@_href'] || '')

    const isShort = altLink.includes('/shorts/')

    const mediaGroup = entry['media:group'] as Record<string, unknown> | undefined
    const community = mediaGroup?.['media:community'] as Record<string, unknown> | undefined
    const stats = community?.['media:statistics'] as Record<string, string> | undefined
    const viewCount = parseInt(stats?.['@_views'] || '0', 10)

    const thumbnail = (mediaGroup?.['media:thumbnail'] as Record<string, string> | undefined)?.['@_url']
      || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    return {
      video_id: videoId,
      channel_id: channelId,
      channel_title: channelTitle || null,
      content_type: isShort ? 'shorts' as const : 'video' as const,
      title: entry.title as string,
      thumbnail,
      view_count: viewCount,
      published_at: entry.published as string,
    }
  })
}
