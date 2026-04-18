import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const YOUTUBE_CHANNEL_KIM = process.env.YOUTUBE_CHANNEL_KIM

/**
 * YouTube 영상/쇼츠 목록 조회 API (DB 기반)
 *
 * youtube_videos 테이블에서 조회
 * 데이터는 /api/youtube/sync cron이 3시간마다 갱신
 *
 * - type=videos: 김인호TV 채널의 일반 영상만 (최신순)
 * - type=shorts: 김인호TV + 이노레이블 두 채널의 쇼츠 (최신순)
 *
 * GET /api/youtube/shorts?limit=15&type=videos
 * GET /api/youtube/shorts?limit=15&type=shorts
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 15, 30)
  const type = searchParams.get('type') === 'videos' ? 'videos' : 'shorts'

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ data: [], error: 'Supabase 미설정' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let query = supabase
    .from('youtube_videos')
    .select('video_id, title, thumbnail, published_at, view_count, channel_title')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (type === 'videos') {
    // 영상 = KIM 채널만
    query = query.eq('content_type', 'video')
    if (YOUTUBE_CHANNEL_KIM) {
      query = query.eq('channel_id', YOUTUBE_CHANNEL_KIM)
    }
  } else {
    // 쇼츠 = 두 채널 모두 (content_type만 필터)
    query = query.eq('content_type', 'shorts')
  }

  const { data, error } = await query

  if (error) {
    console.error('[YouTube DB] 조회 실패:', error)
    return NextResponse.json({ data: [], error: error.message })
  }

  // 클라이언트 인터페이스 호환 (id, title, thumbnail, publishedAt, channelTitle, viewCount)
  const videos = (data || []).map(row => ({
    id: row.video_id,
    title: row.title,
    thumbnail: row.thumbnail || '',
    publishedAt: row.published_at,
    channelTitle: row.channel_title || '',
    viewCount: row.view_count || 0,
  }))

  return NextResponse.json({ data: videos, source: 'db' })
}
