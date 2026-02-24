import { getPosts } from '@/lib/actions/posts'
import BoardClient from '../free/BoardClient'

export default async function ReportBoardPage() {
  const postsResult = await getPosts({ boardType: 'report', page: 1, limit: 20 })

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
      category: '신고',
    }
  })

  return (
    <BoardClient
      config={{
        boardType: 'report',
        activeTab: 'report',
        heroTitle: '신고게시판',
        heroSubtitle: '신고 및 건의사항을 작성하는 공간',
        categoryLabel: '신고',
        searchTypes: ['all', 'title', 'author'],
        showPopularBadge: false,
      }}
      initialPosts={initialPosts}
      initialCount={postsResult.data?.count || 0}
    />
  )
}
