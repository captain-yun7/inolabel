/**
 * Mock Banners Data
 * 메인 히어로 슬라이더 배너
 */

// 확장된 Banner 타입 (프론트엔드 전용)
export interface MockBanner {
  id: number
  title: string
  subtitle: string
  description?: string
  imageUrl?: string
  memberImageUrl?: string // 멤버 사진 (Hero 좌측)
  bgGradient: string
  linkUrl?: string
  linkText?: string
  isActive: boolean
  displayOrder: number
  badges?: string[] // 뱃지 라벨 (EXCEL, STAR UNIT 등)
}

export const mockBanners: MockBanner[] = [
  {
    id: 1,
    title: 'LINA & GAAE',
    subtitle: 'RG MAIN PILLAR',
    description: 'RG 패밀리의 메인 스트리머를 소개합니다',
    // 어두운 배경 여성 - 얼굴 중앙
    memberImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&q=80',
    bgGradient: 'linear-gradient(125deg, #1a0a12 0%, #3d0f24 25%, #6b1a3d 45%, #8b2252 55%, #3d0f24 75%, #0a0508 100%)',
    linkUrl: '/rg/org',
    linkText: '멤버 보기',
    badges: ['EXCEL', 'STAR UNIT', 'RG', 'NEW MEMBER'],
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    title: 'SEASON 4',
    subtitle: 'NOW STREAMING',
    description: '시즌 4가 시작되었습니다! 새로운 콘텐츠를 만나보세요',
    // 중립적 배경 여성 상반신
    memberImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&q=80',
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1a3a5f 30%, #2d5a8a 50%, #1a3a5f 70%, #0a1628 100%)',
    linkUrl: '/schedule',
    linkText: '일정 확인',
    badges: ['SEASON 4', 'LIVE'],
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    title: 'VIP REWARDS',
    subtitle: 'TOP SUPPORTERS',
    description: '소중한 후원자분들께 특별한 혜택을 드립니다',
    // 보라색 톤과 어울리는 여성
    memberImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&q=80',
    bgGradient: 'linear-gradient(145deg, #0d0618 0%, #2a1045 25%, #4a1c6b 45%, #6b2d8a 55%, #2a1045 75%, #0d0618 100%)',
    linkUrl: '/ranking/vip',
    linkText: 'VIP 혜택',
    badges: ['VIP', 'EXCLUSIVE'],
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 4,
    title: 'EXCEL UNIT',
    subtitle: 'KOREAN BROADCAST',
    description: '한국 엑셀방송 크루를 만나보세요',
    // 여성 그룹 - 친밀한 분위기
    memberImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop&q=80',
    bgGradient: 'linear-gradient(130deg, #1a0510 0%, #4a0f28 20%, #8b2252 40%, #fd68ba 50%, #8b2252 60%, #4a0f28 80%, #1a0510 100%)',
    linkUrl: '/rg/org',
    linkText: '조직도 보기',
    badges: ['EXCEL', 'CREW'],
    isActive: true,
    displayOrder: 4,
  },
]
