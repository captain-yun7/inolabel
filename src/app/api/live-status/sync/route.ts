import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
// 통합 모듈 사용 (API 실패 시 스크래퍼로 자동 전환)
import { extractChannelId, checkMultipleChannels } from '@/lib/api/pandatv-unified'
import { checkMultipleLiveStatus as checkSoopMultiple, extractBjId, getSoopStreamUrl } from '@/lib/soop/api'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SYNC_SECRET = process.env.LIVE_STATUS_SYNC_SECRET

type SocialLinks = Partial<Record<'pandatv' | 'chzzk' | 'youtube' | 'twitch' | 'sooptv' | 'soop', string>>

interface SyncResult {
  total: number
  updated: number
  live: number
  errors: string[]
  tierTotal?: number
  tierLive?: number
}

export async function POST(request: Request) {
  // 인증 확인
  if (SYNC_SECRET) {
    const provided = request.headers.get('x-cron-secret')
    if (!provided || provided !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Missing Supabase service role configuration' },
      { status: 500 }
    )
  }

  const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY)
  const now = new Date().toISOString()
  const result: SyncResult = { total: 0, updated: 0, live: 0, errors: [] }

  // organization 테이블에서 활성 멤버 조회
  const { data: members, error } = await supabase
    .from('organization')
    .select('id, social_links, is_live')
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!members || members.length === 0) {
    return NextResponse.json({ message: 'No members to sync', ...result })
  }

  // live_status 테이블 업데이트 데이터 준비
  const liveStatusRows: {
    member_id: number
    platform: 'pandatv' | 'sooptv'
    stream_url: string
    thumbnail_url: string | null
    stream_title: string | null
    is_live: boolean
    viewer_count: number
    last_checked: string
  }[] = []

  // organization 테이블 업데이트 준비
  const orgUpdates: { id: number; is_live: boolean }[] = []

  // --- PandaTV 채널 동기화 ---
  const pandatvMembers: { memberId: number; channelId: string; currentIsLive: boolean }[] = []

  for (const member of members) {
    const socialLinks = (member.social_links || {}) as SocialLinks
    const pandatvUrl = socialLinks.pandatv

    if (pandatvUrl) {
      const channelId = extractChannelId(pandatvUrl)
      if (channelId) {
        pandatvMembers.push({
          memberId: member.id,
          channelId,
          currentIsLive: member.is_live,
        })
      }
    }
  }

  if (pandatvMembers.length > 0) {
    const channelIds = pandatvMembers.map((m) => m.channelId)
    const liveStatuses = await checkMultipleChannels(channelIds, 3)
    const statusMap = new Map(liveStatuses.map((s) => [s.channelId, s]))

    for (const member of pandatvMembers) {
      const status = statusMap.get(member.channelId)

      if (!status) {
        result.errors.push(`No status for PandaTV channel: ${member.channelId}`)
        continue
      }

      if (status.error) {
        result.errors.push(`PandaTV ${member.channelId}: ${status.error}`)
        continue
      }

      liveStatusRows.push({
        member_id: member.memberId,
        platform: 'pandatv',
        stream_url: `https://www.pandalive.co.kr/${member.channelId}`,
        thumbnail_url: status.thumbnailUrl || null,
        stream_title: status.title || null,
        is_live: status.isLive,
        viewer_count: status.viewerCount || 0,
        last_checked: now,
      })

      if (status.isLive !== member.currentIsLive) {
        orgUpdates.push({ id: member.memberId, is_live: status.isLive })
      }

      if (status.isLive) result.live++
    }
  }

  // --- SOOP TV 채널 동기화 ---
  const soopMembers: { memberId: number; bjId: string; currentIsLive: boolean }[] = []

  for (const member of members) {
    const socialLinks = (member.social_links || {}) as SocialLinks
    const soopUrl = socialLinks.sooptv || socialLinks.soop

    if (soopUrl) {
      const bjId = extractBjId(soopUrl)
      if (bjId) {
        soopMembers.push({
          memberId: member.id,
          bjId,
          currentIsLive: member.is_live,
        })
      }
    }
  }

  if (soopMembers.length > 0) {
    const bjIds = soopMembers.map((m) => m.bjId)
    const soopStatuses = await checkSoopMultiple(bjIds, 3)
    const soopStatusMap = new Map(soopStatuses.map((s) => [s.bjId, s]))

    for (const member of soopMembers) {
      const status = soopStatusMap.get(member.bjId)

      if (!status) {
        result.errors.push(`No status for SOOP channel: ${member.bjId}`)
        continue
      }

      liveStatusRows.push({
        member_id: member.memberId,
        platform: 'sooptv',
        stream_url: getSoopStreamUrl(member.bjId),
        thumbnail_url: status.thumbnailUrl || null,
        stream_title: status.title || null,
        is_live: status.isLive,
        viewer_count: status.viewerCount || 0,
        last_checked: now,
      })

      // organization 업데이트 (PandaTV에서 이미 업데이트 안 된 경우만)
      const alreadyUpdated = orgUpdates.some(u => u.id === member.memberId)
      if (!alreadyUpdated && status.isLive !== member.currentIsLive) {
        orgUpdates.push({ id: member.memberId, is_live: status.isLive })
      }

      if (status.isLive) result.live++
    }
  }

  result.total = pandatvMembers.length + soopMembers.length

  if (result.total === 0) {
    return NextResponse.json({ message: 'No channels found to sync', ...result })
  }

  // live_status 테이블 upsert
  if (liveStatusRows.length > 0) {
    const { error: upsertError } = await supabase
      .from('live_status')
      .upsert(liveStatusRows, { onConflict: 'member_id,platform' })

    if (upsertError) {
      result.errors.push(`live_status upsert: ${upsertError.message}`)
    } else {
      result.updated = liveStatusRows.length
    }
  }

  // organization 테이블 is_live 업데이트
  for (const update of orgUpdates) {
    const { error: updateError } = await supabase
      .from('organization')
      .update({ is_live: update.is_live })
      .eq('id', update.id)

    if (updateError) {
      result.errors.push(`organization update (${update.id}): ${updateError.message}`)
    }
  }

  // --- 스타크래프트 티어 멤버 라이브 싱크 ---
  let tierTotal = 0
  let tierLive = 0

  const { data: tierMembers, error: tierError } = await supabase
    .from('starcraft_tier_members')
    .select('id, soop_id, is_live')
    .not('soop_id', 'is', null)

  if (tierError) {
    result.errors.push(`tier members query: ${tierError.message}`)
  } else if (tierMembers && tierMembers.length > 0) {
    tierTotal = tierMembers.length
    const tierBjIds = tierMembers.map(m => m.soop_id!).filter(Boolean)
    const tierStatuses = await checkSoopMultiple(tierBjIds, 5)
    const tierStatusMap = new Map(tierStatuses.map(s => [s.bjId, s]))

    for (const member of tierMembers) {
      const status = tierStatusMap.get(member.soop_id!)
      if (!status) continue

      const isLive = status.isLive
      if (isLive) tierLive++

      // 상태가 변경되었거나 라이브 중인 경우만 업데이트
      if (isLive !== member.is_live || isLive) {
        const { error: tierUpdateError } = await supabase
          .from('starcraft_tier_members')
          .update({
            is_live: isLive,
            live_title: isLive ? (status.title || null) : null,
            live_thumbnail: isLive ? (status.thumbnailUrl || null) : null,
            viewer_count: isLive ? (status.viewerCount || 0) : 0,
            live_checked_at: now,
          })
          .eq('id', member.id)

        if (tierUpdateError) {
          result.errors.push(`tier member update (${member.id}): ${tierUpdateError.message}`)
        }
      }
    }
  }

  result.tierTotal = tierTotal
  result.tierLive = tierLive

  return NextResponse.json({
    message: 'Sync completed',
    ...result,
    timestamp: now,
  })
}

// GET 요청으로도 호출 가능 (개발/테스트용)
export async function GET(request: Request) {
  // GET 요청은 x-cron-secret 헤더 대신 쿼리 파라미터로 인증
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (SYNC_SECRET && secret !== SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // POST와 동일한 로직 실행
  const fakeRequest = new Request(request.url, {
    method: 'POST',
    headers: secret ? { 'x-cron-secret': secret } : {},
  })

  return POST(fakeRequest)
}
