import { getPosts, getBestPosts } from '@/lib/actions/posts'
import { getNotices } from '@/lib/actions/notices'
import BoardClient from './BoardClient'

export default async function FreeBoardPage() {
  // 서버에서 초기 데이터 병렬 fetch
  const [postsResult, weeklyResult, monthlyResult, noticesResult] = await Promise.all([
    getPosts({ boardType: 'free', page: 1, limit: 20 }),
    getBestPosts({ boardType: 'free', period: 'weekly', limit: 5 }),
    getBestPosts({ boardType: 'free', period: 'monthly', limit: 5 }),
    getNotices({ limit: 3 }),
  ])

  // 게시글 변환
  const initialPosts = (postsResult.data?.data || []).map((p) => {
    const isAnon = p.is_anonymous || false
    const realNickname = p.author_nickname || '알 수 없음'
    return {
      id: p.id,
      title: p.title,
      authorName: isAnon ? '익명' : realNickname,
      authorRealName: isAnon ? realNickname : undefined,
      isAnonymous: isAnon,
      viewCount: p.view_count || 0,
      commentCount: p.comment_count || 0,
      likeCount: p.like_count || 0,
      createdAt: p.created_at,
      category: '잡담',
    }
  })

  // BEST 게시글 변환
  const mapBest = (data: typeof weeklyResult.data) =>
    (data || []).map(p => ({
      id: p.id,
      title: p.title,
      likeCount: p.like_count || 0,
      authorName: p.is_anonymous ? '익명' : (p.author_nickname || '알 수 없음'),
    }))

  // 공지 변환
  const initialNotices = (noticesResult.data || [])
    .filter(n => n.is_pinned)
    .slice(0, 3)
    .map(n => ({ id: n.id, title: n.title, createdAt: n.created_at }))

  return (
    <BoardClient
      config={{
        boardType: 'free',
        activeTab: 'free',
        heroTitle: '커뮤니티',
        heroSubtitle: 'INOLABEL 팬들과 소통하는 자유 공간',
        categoryLabel: '잡담',
        searchTypes: ['all', 'title', 'author'],
        showPopularBadge: true,
      }}
      initialPosts={initialPosts}
      initialCount={postsResult.data?.count || 0}
      initialWeeklyBest={mapBest(weeklyResult.data)}
      initialMonthlyBest={mapBest(monthlyResult.data)}
      initialNotices={initialNotices}
    />
  )
}
