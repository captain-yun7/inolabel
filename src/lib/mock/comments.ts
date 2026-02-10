/**
 * Mock Comments Data
 * 커뮤니티 게시글 댓글
 *
 * Database 스키마와 일치하는 타입 사용
 */

import type { Comment } from '@/types/database'

/**
 * Comments Mock Data
 * 게시글별 댓글 (대댓글 포함)
 */
export const mockComments: Comment[] = [
  // Post 1 댓글 (12개)
  {
    id: 1,
    post_id: 1,
    author_id: 'user-2',
    content: '저도 봤어요! 진짜 너무 웃겼음 ㅋㅋㅋ',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T22:35:00Z',
  },
  {
    id: 2,
    post_id: 1,
    author_id: 'user-3',
    content: '아이린 게임 실력 레전드ㅋㅋㅋ',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T22:40:00Z',
  },
  {
    id: 3,
    post_id: 1,
    author_id: 'user-4',
    content: '다음 방송 언제인지 아시는 분?',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T22:45:00Z',
  },
  {
    id: 4,
    post_id: 1,
    author_id: 'user-5',
    content: '아마 내일 저녁이요!',
    parent_id: 3, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T22:50:00Z',
  },
  {
    id: 5,
    post_id: 1,
    author_id: 'user-6',
    content: '오 감사합니다!',
    parent_id: 3, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T22:55:00Z',
  },
  {
    id: 6,
    post_id: 1,
    author_id: 'user-7',
    content: '꿀잼 방송이었어요',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:00:00Z',
  },
  {
    id: 7,
    post_id: 1,
    author_id: 'user-8',
    content: '클립 있으면 공유해주세요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:05:00Z',
  },
  {
    id: 8,
    post_id: 1,
    author_id: 'user-9',
    content: '저도 보고 싶어요 ㅠㅠ',
    parent_id: 7, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:10:00Z',
  },
  {
    id: 9,
    post_id: 1,
    author_id: 'user-10',
    content: '역대급 방송이었음',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:15:00Z',
  },
  {
    id: 10,
    post_id: 1,
    author_id: 'user-11',
    content: '인정합니다 ㅋㅋ',
    parent_id: 9, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:20:00Z',
  },
  {
    id: 11,
    post_id: 1,
    author_id: 'user-12',
    content: '방송 끝나고 아쉬웠어요',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:25:00Z',
  },
  {
    id: 12,
    post_id: 1,
    author_id: 'user-13',
    content: '다음 방송도 기대됩니다!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-20T23:30:00Z',
  },

  // Post 2 댓글 (23개) - 팬아트
  {
    id: 13,
    post_id: 2,
    author_id: 'user-1',
    content: '와 대박이에요! 너무 잘 그리셨어요',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:10:00Z',
  },
  {
    id: 14,
    post_id: 2,
    author_id: 'user-4',
    content: '실력자시네요 👍',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:15:00Z',
  },
  {
    id: 15,
    post_id: 2,
    author_id: 'user-5',
    content: '이거 본인이 그린 거 맞아요?? 대박',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:20:00Z',
  },
  {
    id: 16,
    post_id: 2,
    author_id: 'user-3',
    content: '넵 감사합니다 ㅎㅎ',
    parent_id: 15, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:25:00Z',
  },
  {
    id: 17,
    post_id: 2,
    author_id: 'user-6',
    content: '색감이 너무 예뻐요',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:30:00Z',
  },
  {
    id: 18,
    post_id: 2,
    author_id: 'user-7',
    content: '타임랩스 있으면 보고 싶어요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:35:00Z',
  },
  {
    id: 19,
    post_id: 2,
    author_id: 'user-8',
    content: '이 정도면 전문가 아닌가요?',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:40:00Z',
  },
  {
    id: 20,
    post_id: 2,
    author_id: 'user-9',
    content: '인스타 있으신가요?',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:45:00Z',
  },
  {
    id: 21,
    post_id: 2,
    author_id: 'user-10',
    content: '다음 작품도 기대할게요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:50:00Z',
  },
  {
    id: 22,
    post_id: 2,
    author_id: 'user-11',
    content: '퀄리티 미쳤다...',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T15:55:00Z',
  },
  {
    id: 23,
    post_id: 2,
    author_id: 'user-12',
    content: '실력 어디서 배우셨어요?',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:00:00Z',
  },
  {
    id: 24,
    post_id: 2,
    author_id: 'user-3',
    content: '독학으로 배웠어요!',
    parent_id: 23, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:05:00Z',
  },
  {
    id: 25,
    post_id: 2,
    author_id: 'user-13',
    content: '와 대단해요',
    parent_id: 24, // 대대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:10:00Z',
  },
  {
    id: 26,
    post_id: 2,
    author_id: 'user-14',
    content: '프린트해서 방에 걸어두고 싶어요',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:15:00Z',
  },
  {
    id: 27,
    post_id: 2,
    author_id: 'user-15',
    content: '이거 엽서로 나오면 좋겠다',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:20:00Z',
  },
  {
    id: 28,
    post_id: 2,
    author_id: 'user-16',
    content: '인정 ㅋㅋ',
    parent_id: 27, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:25:00Z',
  },
  {
    id: 29,
    post_id: 2,
    author_id: 'user-17',
    content: '예술이다 예술',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:30:00Z',
  },
  {
    id: 30,
    post_id: 2,
    author_id: 'user-18',
    content: '손재주 부럽습니다',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:35:00Z',
  },
  {
    id: 31,
    post_id: 2,
    author_id: 'user-19',
    content: '다른 멤버도 그려주세요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:40:00Z',
  },
  {
    id: 32,
    post_id: 2,
    author_id: 'user-3',
    content: '다음엔 나노 그려볼게요!',
    parent_id: 31, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:45:00Z',
  },
  {
    id: 33,
    post_id: 2,
    author_id: 'user-20',
    content: '기대됩니다!',
    parent_id: 32, // 대대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:50:00Z',
  },
  {
    id: 34,
    post_id: 2,
    author_id: 'user-21',
    content: '좋아요 눌렀어요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T16:55:00Z',
  },
  {
    id: 35,
    post_id: 2,
    author_id: 'user-22',
    content: '최고예요 👏',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-19T17:00:00Z',
  },

  // Post 3 댓글 (8개) - VIP 게시판
  {
    id: 36,
    post_id: 3,
    author_id: 'user-2',
    content: '저도 받았어요! 진짜 퀄리티 대박',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:15:00Z',
  },
  {
    id: 37,
    post_id: 3,
    author_id: 'user-4',
    content: '포토카드 어떤 멤버 나왔어요?',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:20:00Z',
  },
  {
    id: 38,
    post_id: 3,
    author_id: 'user-1',
    content: '나노랑 아이린 나왔어요!',
    parent_id: 37, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:25:00Z',
  },
  {
    id: 39,
    post_id: 3,
    author_id: 'user-4',
    content: '오 부럽다 ㅠㅠ',
    parent_id: 38, // 대대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:30:00Z',
  },
  {
    id: 40,
    post_id: 3,
    author_id: 'user-5',
    content: 'VIP 굿즈 다음 시즌에도 나오나요?',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:35:00Z',
  },
  {
    id: 41,
    post_id: 3,
    author_id: 'user-6',
    content: '아마 나올 것 같아요!',
    parent_id: 40, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:40:00Z',
  },
  {
    id: 42,
    post_id: 3,
    author_id: 'user-7',
    content: 'VIP 혜택 최고 👍',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:45:00Z',
  },
  {
    id: 43,
    post_id: 3,
    author_id: 'user-8',
    content: '다음 굿즈도 기대됩니다',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-18T10:50:00Z',
  },

  // Post 4 댓글 (5개) - 콜라보 관련
  {
    id: 44,
    post_id: 4,
    author_id: 'user-1',
    content: '저도 궁금해요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-17T18:10:00Z',
  },
  {
    id: 45,
    post_id: 4,
    author_id: 'user-2',
    content: '아직 공지 없는 것 같아요',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-17T18:15:00Z',
  },
  {
    id: 46,
    post_id: 4,
    author_id: 'user-3',
    content: '다음 달에 한다고 들었는데...',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-17T18:20:00Z',
  },
  {
    id: 47,
    post_id: 4,
    author_id: 'user-5',
    content: '오 진짜요? 기대됩니다!',
    parent_id: 46, // 대댓글
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-17T18:25:00Z',
  },
  {
    id: 48,
    post_id: 4,
    author_id: 'user-6',
    content: '공지 나오면 알려주세요!',
    parent_id: null,
    is_anonymous: false,
    is_deleted: false,
    created_at: '2024-12-17T18:30:00Z',
  },
]

/**
 * 게시글 ID로 댓글 조회
 */
export function getCommentsByPostId(postId: number): Comment[] {
  return mockComments.filter(c => c.post_id === postId && !c.is_deleted)
}

/**
 * 게시글 ID로 최상위 댓글만 조회
 */
export function getRootCommentsByPostId(postId: number): Comment[] {
  return mockComments.filter(c => c.post_id === postId && c.parent_id === null && !c.is_deleted)
}

/**
 * 부모 댓글 ID로 대댓글 조회
 */
export function getRepliesByParentId(parentId: number): Comment[] {
  return mockComments.filter(c => c.parent_id === parentId && !c.is_deleted)
}

/**
 * 댓글 ID로 단일 댓글 조회
 */
export function getCommentById(id: number): Comment | null {
  return mockComments.find(c => c.id === id && !c.is_deleted) || null
}

/**
 * 게시글별 댓글 수 조회
 */
export function getCommentCountByPostId(postId: number): number {
  return mockComments.filter(c => c.post_id === postId && !c.is_deleted).length
}
