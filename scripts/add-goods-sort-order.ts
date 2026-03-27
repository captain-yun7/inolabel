/**
 * goods 테이블에 sort_order 컬럼 추가
 * npx tsx scripts/add-goods-sort-order.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey)

async function main() {
  console.log('goods 테이블 sort_order 컬럼 추가 중...')

  // 현재 goods 목록 조회
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: goods, error: fetchError } = await (supabase as any)
    .from('goods')
    .select('id, created_at')
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('goods 조회 실패:', fetchError.message)
    process.exit(1)
  }

  console.log(`현재 상품 수: ${goods?.length ?? 0}개`)

  // sort_order 컬럼이 이미 있는지 확인
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sample } = await (supabase as any)
    .from('goods')
    .select('sort_order')
    .limit(1)
    .maybeSingle()

  if (sample !== null && 'sort_order' in (sample || {})) {
    console.log('✅ sort_order 컬럼이 이미 존재합니다.')
    return
  }

  // Supabase PostgREST로는 DDL 실행 불가 → 안내 출력
  console.log()
  console.log('⚠️  sort_order 컬럼이 없습니다.')
  console.log('Supabase Dashboard SQL Editor에서 아래 SQL을 실행해주세요:')
  console.log()
  console.log('─'.repeat(60))
  console.log(`ALTER TABLE goods ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

UPDATE goods SET sort_order = sub.rownum
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rownum
  FROM goods
) sub
WHERE goods.id = sub.id;`)
  console.log('─'.repeat(60))
}

main().catch(console.error)
