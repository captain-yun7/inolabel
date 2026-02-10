/**
 * Mock Live Status Data
 * 라이브 방송 상태
 */

import type { LiveStatus } from '@/types/database'
import { getCurrentTimestamp } from './utils'

export const mockLiveStatus: LiveStatus[] = [
  {
    id: 1,
    member_id: 1, // 가애 (R대표)
    platform: 'pandatv',
    stream_url: 'https://www.pandalive.co.kr/gaea',
    thumbnail_url: '/assets/members/gaea.jpg',
    is_live: true,
    viewer_count: 5823,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 2,
    member_id: 2, // 린아 (G대표)
    platform: 'pandatv',
    stream_url: 'https://www.pandalive.co.kr/rina',
    thumbnail_url: '/assets/members/rina.jpg',
    is_live: true,
    viewer_count: 4921,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 3,
    member_id: 3, // 나노 (팀장)
    platform: 'pandatv',
    stream_url: 'https://www.pandalive.co.kr/nano',
    thumbnail_url: '/assets/members/nano.jpg',
    is_live: true,
    viewer_count: 2341,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 4,
    member_id: 5, // 유나
    platform: 'pandatv',
    stream_url: 'https://www.pandalive.co.kr/yuna',
    thumbnail_url: '/assets/members/yuna.jpg',
    is_live: true,
    viewer_count: 1876,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 5,
    member_id: 7, // 나나
    platform: 'pandatv',
    stream_url: 'https://www.pandalive.co.kr/nana',
    thumbnail_url: '/assets/members/nana.jpg',
    is_live: true,
    viewer_count: 1520,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 6,
    member_id: 10, // 이태린
    platform: 'pandatv',
    stream_url: 'https://www.pandalive.co.kr/taerin',
    thumbnail_url: '/assets/members/taerin.jpg',
    is_live: true,
    viewer_count: 1320,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 7,
    member_id: 11, // 지유
    platform: 'youtube',
    stream_url: 'https://youtube.com/live/jiyu',
    thumbnail_url: '/assets/members/jiyu.jpg',
    is_live: true,
    viewer_count: 980,
    last_checked: getCurrentTimestamp(),
  },
  {
    id: 8,
    member_id: 13, // 시아
    platform: 'youtube',
    stream_url: 'https://youtube.com/live/sia',
    thumbnail_url: '/assets/members/sia.jpg',
    is_live: true,
    viewer_count: 756,
    last_checked: getCurrentTimestamp(),
  },
]
