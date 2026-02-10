import { NextRequest, NextResponse } from 'next/server'
import { checkLiveStatus, checkMultipleLiveStatus } from '@/lib/soop/api'

/**
 * SOOP TV 라이브 상태 프록시 API (CORS 우회)
 *
 * GET /api/soop/live?bjId=xxx - 단일 채널 조회
 * GET /api/soop/live?bjIds=xxx,yyy,zzz - 여러 채널 조회
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bjId = searchParams.get('bjId')
  const bjIds = searchParams.get('bjIds')

  if (!bjId && !bjIds) {
    return NextResponse.json(
      { error: 'bjId 또는 bjIds 파라미터가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    if (bjIds) {
      const ids = bjIds.split(',').map(id => id.trim()).filter(Boolean)
      const statuses = await checkMultipleLiveStatus(ids)
      return NextResponse.json({ data: statuses })
    }

    const status = await checkLiveStatus(bjId!)
    return NextResponse.json({ data: status })
  } catch (error) {
    console.error('SOOP live API error:', error)
    return NextResponse.json(
      { error: '라이브 상태 조회에 실패했습니다' },
      { status: 500 }
    )
  }
}
