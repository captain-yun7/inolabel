/**
 * VIP Content Mock Data
 *
 * VIP 전용 콘텐츠 데이터
 * - 멤버 감사 영상
 * - VIP 시그니처
 * - 감사 메시지
 */

import { getPlaceholderAvatar } from './utils'

export interface VipMemberVideo {
  id: number
  memberName: string
  memberUnit: 'excel' | 'crew'
  thumbnailUrl: string
  videoUrl: string
  message: string
}

export interface VipSignature {
  id: number
  memberName: string
  signatureUrl: string
  unit: 'excel' | 'crew'
}

export interface VipContent {
  memberVideos: VipMemberVideo[]
  thankYouMessage: string
  signatures: VipSignature[]
}

export const mockVipMemberVideos: VipMemberVideo[] = [
  {
    id: 1,
    memberName: '루나',
    memberUnit: 'excel',
    thumbnailUrl: getPlaceholderAvatar('Luna'),
    videoUrl: 'https://example.com/video/luna-thanks',
    message: 'VIP 여러분 덕분에 힘이 나요! 항상 감사합니다 💕'
  },
  {
    id: 2,
    memberName: '나노',
    memberUnit: 'excel',
    thumbnailUrl: getPlaceholderAvatar('Nano'),
    videoUrl: 'https://example.com/video/nano-thanks',
    message: '최고의 팬분들! 사랑해요 ✨'
  },
  {
    id: 3,
    memberName: '비비',
    memberUnit: 'crew',
    thumbnailUrl: getPlaceholderAvatar('Bibi'),
    videoUrl: 'https://example.com/video/bibi-thanks',
    message: '함께해서 행복해요! 앞으로도 잘 부탁드려요 🌟'
  },
  {
    id: 4,
    memberName: '조코',
    memberUnit: 'crew',
    thumbnailUrl: getPlaceholderAvatar('Joco'),
    videoUrl: 'https://example.com/video/joco-thanks',
    message: 'VIP 여러분이 최고! 💪'
  },
]

export const mockVipSignatures: VipSignature[] = [
  { id: 1, memberName: 'Luna', signatureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&q=80', unit: 'excel' },
  { id: 2, memberName: 'Nano', signatureUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop&q=80', unit: 'excel' },
  { id: 3, memberName: 'Bibi', signatureUrl: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&h=400&fit=crop&q=80', unit: 'crew' },
  { id: 4, memberName: 'Joco', signatureUrl: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=400&fit=crop&q=80', unit: 'crew' },
  { id: 5, memberName: 'Leo', signatureUrl: 'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=400&h=400&fit=crop&q=80', unit: 'excel' },
  { id: 6, memberName: 'Mote', signatureUrl: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=400&h=400&fit=crop&q=80', unit: 'crew' },
]

export const mockVipContent: VipContent = {
  memberVideos: mockVipMemberVideos,
  thankYouMessage: 'RG 패밀리의 VIP가 되어주셔서 진심으로 감사드립니다. 여러분의 사랑과 응원이 저희에게 큰 힘이 됩니다. 앞으로도 더 멋진 콘텐츠로 보답하겠습니다! 💕',
  signatures: mockVipSignatures,
}

/**
 * Top 1-3 VIP를 위한 헌정 페이지 데이터
 */
export interface VipRewardData {
  profileId: string
  seasonId: number
  rank: number
  personalMessage: string | null
  dedicationVideoUrl: string | null
  giftImages: { id: number; url: string; title: string }[]
}

export const mockVipRewards: VipRewardData[] = [
  {
    profileId: 'user-1',
    seasonId: 4,
    rank: 1,
    personalMessage: '스카이팬더님, 항상 최고의 응원을 보내주셔서 감사합니다. 덕분에 매일 방송이 즐겁습니다. 앞으로도 함께해주실 거죠? 사랑합니다! 💛',
    dedicationVideoUrl: null,
    giftImages: [
      { id: 1, url: '/assets/vip/gift-gold-1.jpg', title: 'Gold Member Special' },
      { id: 2, url: '/assets/vip/gift-gold-2.jpg', title: 'Exclusive Photo' },
    ],
  },
  {
    profileId: 'user-2',
    seasonId: 4,
    rank: 2,
    personalMessage: '팬더러브님, 변함없는 응원에 진심으로 감사드려요. 항상 채팅에서 응원해주셔서 힘이 나요! 🥈',
    dedicationVideoUrl: null,
    giftImages: [
      { id: 3, url: '/assets/vip/gift-silver-1.jpg', title: 'Silver Member Special' },
    ],
  },
  {
    profileId: 'user-3',
    seasonId: 4,
    rank: 3,
    personalMessage: '별빛하늘님, 따뜻한 응원 항상 감사합니다. 앞으로도 좋은 방송으로 보답할게요! 🥉',
    dedicationVideoUrl: null,
    giftImages: [
      { id: 4, url: '/assets/vip/gift-bronze-1.jpg', title: 'Bronze Member Special' },
    ],
  },
]

/**
 * 특정 사용자의 VIP 보상 조회
 */
export const getVipRewardByProfileId = (profileId: string): VipRewardData | null => {
  return mockVipRewards.find(r => r.profileId === profileId) || null
}

/**
 * 특정 순위의 VIP 보상 조회
 */
export const getVipRewardByRank = (rank: number): VipRewardData | null => {
  return mockVipRewards.find(r => r.rank === rank) || null
}
