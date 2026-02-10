import { NextRequest, NextResponse } from 'next/server'
import { getChannelHome } from '@/lib/soop/api'

/**
 * SOOP TV 채널 정보 프록시 API (CORS 우회)
 *
 * GET /api/soop/station?bjId=xxx - 채널 홈 정보 (게시글, VOD 등)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bjId = searchParams.get('bjId')

  if (!bjId) {
    return NextResponse.json(
      { error: 'bjId 파라미터가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    const data = await getChannelHome(bjId)

    if (!data) {
      return NextResponse.json(
        { error: '채널 정보를 가져올 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('SOOP station API error:', error)
    return NextResponse.json(
      { error: '채널 정보 조회에 실패했습니다' },
      { status: 500 }
    )
  }
}
