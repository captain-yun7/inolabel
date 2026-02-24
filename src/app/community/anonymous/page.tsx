import { getPosts, getBestPosts } from '@/lib/actions/posts'
import BoardClient from '../free/BoardClient'

export default async function AnonymousBoardPage() {
  const [postsResult, weeklyResult, monthlyResult] = await Promise.all([
    getPosts({ boardType: 'anonymous', page: 1, limit: 20 }),
    getBestPosts({ boardType: 'anonymous', period: 'weekly', limit: 5 }),
    getBestPosts({ boardType: 'anonymous', period: 'monthly', limit: 5 }),
  ])

  const initialPosts = (postsResult.data?.data || []).map((p) => ({
    id: p.id,
    title: p.title,
    authorName: '익명',
    authorRealName: p.author_nickname || '알 수 없음',
    isAnonymous: true,
    viewCount: p.view_count || 0,
    commentCount: p.comment_count || 0,
    likeCount: p.like_count || 0,
    createdAt: p.created_at,
    category: '익명',
  }))

  const mapBest = (data: typeof weeklyResult.data) =>
    (data || []).map(p => ({
      id: p.id,
      title: p.title,
      likeCount: p.like_count || 0,
      authorName: '익명',
    }))

  return (
    <BoardClient
      config={{
        boardType: 'anonymous',
        activeTab: 'anonymous',
        heroTitle: '익명게시판',
        heroSubtitle: '익명으로 자유롭게 소통하는 공간',
        categoryLabel: '익명',
        searchTypes: ['all', 'title'],
        showPopularBadge: true,
      }}
      initialPosts={initialPosts}
      initialCount={postsResult.data?.count || 0}
      initialWeeklyBest={mapBest(weeklyResult.data)}
      initialMonthlyBest={mapBest(monthlyResult.data)}
    />
  )
}
