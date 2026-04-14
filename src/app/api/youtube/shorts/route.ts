import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * YouTube Shorts 목록 조회 API (DB 기반)
 *
 * media_content 테이블에서 content_type='shorts'인 항목을 조회
 * 데이터는 /api/youtube/sync cron에 의해 주기적으로 갱신됨
 *
 * GET /api/youtube/shorts?limit=10
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json({ data: [], error: 'Supabase 미설정' })
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase
    .from('media_content')
    .select('id, title, thumbnail_url, video_url, created_at')
    .eq('content_type', 'shorts')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Shorts DB query error:', error)
    return NextResponse.json({ data: [], error: error.message })
  }

  // 기존 클라이언트 인터페이스 호환
  const shorts = (data || []).map(row => {
    const videoId = extractVideoId(row.video_url)
    return {
      id: videoId || String(row.id),
      title: row.title,
      thumbnail: row.thumbnail_url || '',
      publishedAt: row.created_at,
    }
  })

  return NextResponse.json({ data: shorts })
}

function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match?.[1] || null
}
