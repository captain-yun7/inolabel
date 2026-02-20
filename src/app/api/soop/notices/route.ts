import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getChannelHome, extractBjId } from '@/lib/soop/api'

type SocialLinks = Partial<Record<'pandatv' | 'chzzk' | 'youtube' | 'twitch' | 'sooptv' | 'soop', string>>

interface MemberNotice {
  title_no: number
  title: string
  content: string
  write_dt: string
  read_cnt: number
  comment_cnt: number
  memberName: string
  memberImage: string | null
  bjId: string
}

// 서버 메모리 캐시 (5분)
let cachedNotices: MemberNotice[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000

/**
 * 전체 멤버 SOOP 공지사항 일괄 조회 (5분 캐시)
 *
 * GET /api/soop/notices
 */
export async function GET() {
  // 캐시 히트
  if (cachedNotices && Date.now() - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ data: cachedNotices, cached: true })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase 설정이 누락되었습니다' },
      { status: 500 }
    )
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  // 활성 멤버 조회 (이름, 이미지, social_links)
  const { data: members, error } = await supabase
    .from('organization')
    .select('name, image_url, social_links')
    .eq('is_active', true)

  if (error || !members) {
    return NextResponse.json(
      { error: '멤버 조회 실패' },
      { status: 500 }
    )
  }

  // SOOP bjId가 있는 멤버 추출 (이름 기준 중복 제거)
  const seen = new Set<string>()
  const soopMembers: { name: string; image_url: string | null; bjId: string }[] = []

  for (const member of members) {
    if (seen.has(member.name)) continue
    seen.add(member.name)

    const links = (member.social_links || {}) as SocialLinks
    const soopUrl = links.soop || links.sooptv
    if (!soopUrl) continue

    const bjId = extractBjId(soopUrl)
    if (bjId) {
      soopMembers.push({ name: member.name, image_url: member.image_url, bjId })
    }
  }

  // 3개씩 배치로 공지사항 수집
  const allNotices: MemberNotice[] = []
  const concurrency = 3

  for (let i = 0; i < soopMembers.length; i += concurrency) {
    const batch = soopMembers.slice(i, i + concurrency)
    const results = await Promise.all(
      batch.map(async (member) => {
        try {
          const data = await getChannelHome(member.bjId)
          if (!data) return []
          return data.posts.slice(0, 3).map((post) => ({
            ...post,
            memberName: member.name,
            memberImage: member.image_url,
            bjId: member.bjId,
          }))
        } catch {
          return []
        }
      })
    )
    allNotices.push(...results.flat())
  }

  // 날짜순 정렬 (최신 먼저)
  allNotices.sort((a, b) => new Date(b.write_dt).getTime() - new Date(a.write_dt).getTime())

  // 캐시 저장
  cachedNotices = allNotices
  cacheTimestamp = Date.now()

  return NextResponse.json({ data: allNotices, cached: false })
}
