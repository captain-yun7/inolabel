import { getPosts, getBestPosts } from '@/lib/actions/posts'
import BoardClient from '../free/BoardClient'

export default async function MemeBoardPage() {
  const [postsResult, weeklyResult, monthlyResult] = await Promise.all([
    getPosts({ boardType: 'meme', page: 1, limit: 20 }),
    getBestPosts({ boardType: 'meme', period: 'weekly', limit: 5 }),
    getBestPosts({ boardType: 'meme', period: 'monthly', limit: 5 }),
  ])

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
      category: '짤',
      hasImages: /<img[^>]*>/i.test(p.content || ''),
    }
  })

  const mapBest = (data: typeof weeklyResult.data) =>
    (data || []).map(p => ({
      id: p.id,
      title: p.title,
      likeCount: p.like_count || 0,
      authorName: p.is_anonymous ? '익명' : (p.author_nickname || '알 수 없음'),
    }))

  return (
    <BoardClient
      config={{
        boardType: 'meme',
        activeTab: 'meme',
        heroTitle: '짤, 움짤 모음',
        heroSubtitle: '짤과 움짤을 공유하는 공간',
        categoryLabel: '짤',
        searchTypes: ['all', 'title', 'author'],
        showPopularBadge: true,
      }}
      initialPosts={initialPosts}
      initialCount={postsResult.data?.count || 0}
      initialWeeklyBest={mapBest(weeklyResult.data)}
      initialMonthlyBest={mapBest(monthlyResult.data)}
    />
  )
}
