import { getServiceClient } from './lib/supabase'

const supabase = getServiceClient()

async function main() {
  const { data: comments } = await supabase
    .from('comments')
    .select('post_id')
    .eq('is_deleted', false)

  const counts: Record<number, number> = {}
  for (const c of comments || []) {
    counts[c.post_id] = (counts[c.post_id] || 0) + 1
  }

  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, comment_count')
    .eq('is_deleted', false)

  let updated = 0
  for (const post of allPosts || []) {
    const actualCount = counts[post.id] || 0
    if (post.comment_count !== actualCount) {
      const { error } = await supabase
        .from('posts')
        .update({ comment_count: actualCount })
        .eq('id', post.id)

      if (error) {
        console.error('Error updating post', post.id, error.message)
      } else {
        console.log('Updated post', post.id, ':', post.comment_count, '->', actualCount)
        updated++
      }
    }
  }

  console.log('\n총', updated, '개 게시글 comment_count 동기화 완료')
}

main()
