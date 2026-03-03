import { getPosts } from '@/lib/actions/posts'
import BoardClient from '../free/BoardClient'

export default async function RecommendBoardPage() {
  const postsResult = await getPosts({ boardType: 'recommend', page: 1, limit: 20 })

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
      category: '추천',
      hasImages: /<img[^>]*>/i.test(p.content || ''),
    }
  })

  return (
    <BoardClient
      config={{
        boardType: 'recommend',
        activeTab: 'recommend',
        heroTitle: '컨텐츠추천',
        heroSubtitle: '추천 콘텐츠를 공유하는 공간',
        categoryLabel: '추천',
        searchTypes: ['all', 'title', 'author'],
        showPopularBadge: true,
      }}
      initialPosts={initialPosts}
      initialCount={postsResult.data?.count || 0}
    />
  )
}
