import { NextRequest, NextResponse } from 'next/server'
import { getChannelHome, getProfileImage } from '@/lib/soop/api'

/**
 * SOOP TV 채널 정보 프록시 API (CORS 우회)
 *
 * GET /api/soop/station?bjId=xxx - 채널 홈 정보 (게시글, VOD 등)
 * GET /api/soop/station?bjId=xxx&action=profile-image - 프로필 이미지만 조회
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bjId = searchParams.get('bjId')
  const action = searchParams.get('action')

  if (!bjId) {
    return NextResponse.json(
      { error: 'bjId 파라미터가 필요합니다' },
      { status: 400 }
    )
  }

  try {
    // 프로필 이미지만 조회
    if (action === 'profile-image') {
      const profileImage = await getProfileImage(bjId)
      if (!profileImage) {
        return NextResponse.json(
          { error: '프로필 이미지를 찾을 수 없습니다' },
          { status: 404 }
        )
      }
      return NextResponse.json({ profileImage })
    }

    // 기존: 채널 홈 정보 조회
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
