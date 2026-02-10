/**
 * Mock Posts Data
 * 커뮤니티 게시글
 */

import type { Post } from '@/types/database'

export const mockPosts: Post[] = [
  {
    id: 1,
    board_type: 'free',
    title: '오늘 아이린 방송 너무 재밌었어요!',
    content: '오늘 방송에서 게임하는 거 보고 진짜 웃겨서 배아팠어요 ㅋㅋㅋ\n다음 방송도 기대됩니다!',
    author_id: 'user-1',
    view_count: 234,
    like_count: 45,
    comment_count: 12,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T22:30:00Z',
    updated_at: '2024-12-20T22:30:00Z',
  },
  {
    id: 2,
    board_type: 'free',
    title: '팬아트 그려봤습니다',
    content: '처음으로 팬아트 그려봤어요!\n실력이 많이 부족하지만 좋게 봐주세요 ㅎㅎ',
    author_id: 'user-3',
    view_count: 567,
    like_count: 89,
    comment_count: 23,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:00:00Z',
    updated_at: '2024-12-19T15:00:00Z',
  },
  {
    id: 3,
    board_type: 'vip',
    title: 'VIP 전용 굿즈 후기',
    content: 'VIP 굿즈 받았는데 퀄리티가 대박이에요!\n포토카드 퀄리티 실화인가요...',
    author_id: 'user-1',
    view_count: 123,
    like_count: 34,
    comment_count: 8,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:00:00Z',
    updated_at: '2024-12-18T10:00:00Z',
  },
  {
    id: 4,
    board_type: 'free',
    title: '콜라보 방송 언제 또 하나요?',
    content: '저번 콜라보 방송이 너무 재밌었는데\n다음 콜라보는 언제인지 아시는 분?',
    author_id: 'user-4',
    view_count: 189,
    like_count: 21,
    comment_count: 5,
    is_anonymous: true,
    is_deleted: false,
    created_at: '2024-12-17T18:00:00Z',
    updated_at: '2024-12-17T18:00:00Z',
  },
]
