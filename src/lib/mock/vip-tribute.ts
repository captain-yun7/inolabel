/**
 * VIP Tribute Page Mock Data
 *
 * Top 1-3 후원자를 위한 헌정 페이지 데이터
 * - Gold (1위): #FFD700
 * - Silver (2위): #C0C0C0
 * - Bronze (3위): #CD7F32
 */

import type {
  VipTributeData,
  TributeRank,
  TributeTheme,
  TributeProfile,
  TributeVideo,
  TributeGalleryImage,
  TributeDonation
} from '@/types/common'

// 테마 매핑
export const TRIBUTE_THEMES: Record<TributeRank, TributeTheme> = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
}

// 테마 컬러
export const TRIBUTE_COLORS: Record<TributeTheme, { primary: string; glow: string; gradient: string }> = {
  gold: {
    primary: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.4)',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  },
  silver: {
    primary: '#C0C0C0',
    glow: 'rgba(192, 192, 192, 0.4)',
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
  },
  bronze: {
    primary: '#CD7F32',
    glow: 'rgba(205, 127, 50, 0.4)',
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
  },
}

// Mock Profiles (Top 3 후원자와 일치 - 프로필 사진 없음 → 이니셜 표시)
const mockTributeProfiles: Record<TributeRank, TributeProfile> = {
  1: {
    id: 'user-6',
    nickname: '핑크하트',
    avatarUrl: null, // 후원자는 프로필 사진 없음 → 이니셜 표시
    totalDonation: 45000,
    joinedAt: '2024-06-01',
  },
  2: {
    id: 'user-1',
    nickname: 'gul***',
    avatarUrl: null,
    totalDonation: 38002,
    joinedAt: '2024-01-15',
  },
  3: {
    id: 'user-5',
    nickname: '영원한서포터',
    avatarUrl: null,
    totalDonation: 30000,
    joinedAt: '2024-05-01',
  },
}

// Mock Videos
const mockTributeVideos: Record<TributeRank, TributeVideo | null> = {
  1: {
    id: 1,
    url: 'https://example.com/tribute/gold-video.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop',
    title: '스카이팬더님을 위한 특별 영상',
    duration: 180,
  },
  2: {
    id: 2,
    url: 'https://example.com/tribute/silver-video.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=640&h=360&fit=crop',
    title: '팬더러브님을 위한 감사 영상',
    duration: 150,
  },
  3: {
    id: 3,
    url: 'https://example.com/tribute/bronze-video.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=640&h=360&fit=crop',
    title: '별빛하늘님을 위한 헌정 영상',
    duration: 120,
  },
}

// Mock Gallery Images
const mockGalleryImages: Record<TributeRank, TributeGalleryImage[]> = {
  1: [
    { id: 1, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop', title: 'Gold Exclusive #1', description: '스카이팬더님만을 위한 특별 사진' },
    { id: 2, url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop', title: 'Gold Exclusive #2', description: '친필 사인 포토' },
    { id: 3, url: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&h=800&fit=crop', title: 'Gold Exclusive #3', description: '비하인드 컷' },
    { id: 4, url: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&h=800&fit=crop', title: 'Gold Exclusive #4', description: '스페셜 에디션' },
  ],
  2: [
    { id: 5, url: 'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&h=800&fit=crop', title: 'Silver Exclusive #1', description: '팬더러브님 전용' },
    { id: 6, url: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800&h=800&fit=crop', title: 'Silver Exclusive #2', description: '친필 사인' },
    { id: 7, url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop', title: 'Silver Exclusive #3', description: '스페셜 포토' },
  ],
  3: [
    { id: 8, url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=800&fit=crop', title: 'Bronze Exclusive #1', description: '별빛하늘님 전용' },
    { id: 9, url: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=800&h=800&fit=crop', title: 'Bronze Exclusive #2', description: '친필 사인' },
  ],
}

// Mock Donation Timeline
const mockDonationTimeline: Record<TributeRank, TributeDonation[]> = {
  1: [
    { id: 1, amount: 10000000, message: '항상 응원합니다!', createdAt: '2024-12-25', seasonName: '시즌 4' },
    { id: 2, amount: 5000000, message: '생일 축하해요!', createdAt: '2024-11-20', seasonName: '시즌 4' },
    { id: 3, amount: 8000000, message: '오늘도 화이팅!', createdAt: '2024-10-15', seasonName: '시즌 4' },
    { id: 4, amount: 3000000, message: null, createdAt: '2024-09-10', seasonName: '시즌 3' },
    { id: 5, amount: 7000000, message: '최고의 방송!', createdAt: '2024-08-05', seasonName: '시즌 3' },
  ],
  2: [
    { id: 6, amount: 8000000, message: '사랑해요!', createdAt: '2024-12-20', seasonName: '시즌 4' },
    { id: 7, amount: 4000000, message: '응원합니다', createdAt: '2024-11-15', seasonName: '시즌 4' },
    { id: 8, amount: 6000000, message: null, createdAt: '2024-10-10', seasonName: '시즌 4' },
  ],
  3: [
    { id: 9, amount: 5000000, message: '화이팅!', createdAt: '2024-12-15', seasonName: '시즌 4' },
    { id: 10, amount: 3500000, message: '오늘도 즐거웠어요', createdAt: '2024-11-10', seasonName: '시즌 4' },
  ],
}

// Personal Messages
const personalMessages: Record<TributeRank, string> = {
  1: `핑크하트님, 항상 최고의 응원을 보내주셔서 진심으로 감사합니다.

처음 방송을 시작했을 때부터 지금까지 변함없이 함께해주신 덕분에 매일 방송이 즐겁습니다. 힘들 때마다 핑크하트님의 따뜻한 메시지를 보며 힘을 얻곤 해요.

앞으로도 함께해주실 거죠? 사랑합니다!

- 나노 드림`,
  2: `gul***님, 변함없는 응원에 진심으로 감사드려요.

항상 채팅에서 응원해주시고, 다른 팬분들도 챙겨주시는 모습이 정말 따뜻해요. gul***님 덕분에 우리 방송 분위기가 항상 좋은 것 같아요.

앞으로도 함께 좋은 추억 많이 만들어요!

- 나노 드림`,
  3: `영원한서포터님, 따뜻한 응원 항상 감사합니다.

닉네임처럼 정말 영원한 서포터가 되어주시는 것 같아 감동이에요. 조용히 응원해주시는 모습이 정말 따뜻합니다.

앞으로도 좋은 방송으로 보답할게요!

- 나노 드림`,
}

// Special Badges
const specialBadges: Record<TributeRank, string[]> = {
  1: ['Champion', 'Founding Member', 'Legend', 'Top Supporter'],
  2: ['Elite', 'Founding Member', 'Veteran'],
  3: ['Premium', 'Veteran'],
}

/**
 * Top 1-3 Tribute Data 생성
 */
export const mockVipTributeData: Record<TributeRank, VipTributeData> = {
  1: {
    rank: 1,
    theme: 'gold',
    seasonId: 4,
    seasonName: '시즌 4',
    profile: mockTributeProfiles[1],
    personalMessage: personalMessages[1],
    streamerSignature: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=100&fit=crop',
    dedicationVideo: mockTributeVideos[1],
    exclusiveGallery: mockGalleryImages[1],
    donationTimeline: mockDonationTimeline[1],
    specialBadges: specialBadges[1],
  },
  2: {
    rank: 2,
    theme: 'silver',
    seasonId: 4,
    seasonName: '시즌 4',
    profile: mockTributeProfiles[2],
    personalMessage: personalMessages[2],
    streamerSignature: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=100&fit=crop',
    dedicationVideo: mockTributeVideos[2],
    exclusiveGallery: mockGalleryImages[2],
    donationTimeline: mockDonationTimeline[2],
    specialBadges: specialBadges[2],
  },
  3: {
    rank: 3,
    theme: 'bronze',
    seasonId: 4,
    seasonName: '시즌 4',
    profile: mockTributeProfiles[3],
    personalMessage: personalMessages[3],
    streamerSignature: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=300&h=100&fit=crop',
    dedicationVideo: mockTributeVideos[3],
    exclusiveGallery: mockGalleryImages[3],
    donationTimeline: mockDonationTimeline[3],
    specialBadges: specialBadges[3],
  },
}

/**
 * 순위로 Tribute 데이터 조회
 */
export function getVipTributeByRank(rank: number): VipTributeData | null {
  if (rank < 1 || rank > 3) return null
  return mockVipTributeData[rank as TributeRank] || null
}

/**
 * 사용자 ID로 Tribute 데이터 조회
 */
export function getVipTributeByUserId(userId: string): VipTributeData | null {
  for (const rank of [1, 2, 3] as TributeRank[]) {
    const tribute = mockVipTributeData[rank]
    if (tribute.profile.id === userId) {
      return tribute
    }
  }
  return null
}

/**
 * 순위가 Top 3인지 확인
 */
export function isTop3Rank(rank: number): rank is TributeRank {
  return rank >= 1 && rank <= 3
}

/**
 * 테마 색상 조회
 */
export function getTributeThemeColors(theme: TributeTheme) {
  return TRIBUTE_COLORS[theme]
}

/**
 * 순위에서 테마 조회
 */
export function getRankTheme(rank: TributeRank): TributeTheme {
  return TRIBUTE_THEMES[rank]
}
