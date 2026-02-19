/**
 * 스타크래프트 티어 데이터 시딩
 *
 * 티어 순서: 갓 > 킹 > 잭 > 스페이드 > 0 > 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8 > 유스
 * 종족 컬러: 테란(파랑) / 저그(보라) / 프로토스(노랑주황)
 *
 * 사용법: npx tsx scripts/seed-starcraft-tiers.ts
 */

import { getServiceClient } from './lib/supabase'

const supabase = getServiceClient()

const tiers = [
  { name: '갓티어',      display_order: 1,  color: '#ff4444', description: '최상위 티어' },
  { name: '킹티어',      display_order: 2,  color: '#ff6b35', description: '상위 티어' },
  { name: '잭티어',      display_order: 3,  color: '#ffa234', description: '준상위 티어' },
  { name: '스페이드티어', display_order: 4,  color: '#ffcc00', description: '중상위 티어' },
  { name: '0티어',       display_order: 5,  color: '#44cc44', description: '기준 티어' },
  { name: '1티어',       display_order: 6,  color: '#33bbaa', description: null },
  { name: '2티어',       display_order: 7,  color: '#3399cc', description: null },
  { name: '3티어',       display_order: 8,  color: '#4488dd', description: null },
  { name: '4티어',       display_order: 9,  color: '#5577cc', description: null },
  { name: '5티어',       display_order: 10, color: '#6666bb', description: null },
  { name: '6티어',       display_order: 11, color: '#7755aa', description: null },
  { name: '7티어',       display_order: 12, color: '#886699', description: null },
  { name: '8티어',       display_order: 13, color: '#997788', description: null },
  { name: '유스티어',    display_order: 14, color: '#999999', description: '신입/육성 티어' },
]

async function main() {
  console.log('🎮 스타크래프트 티어 데이터 시딩 시작...\n')

  // 기존 데이터 확인
  const { data: existing } = await supabase
    .from('starcraft_tiers')
    .select('id, name')
    .order('display_order')

  if (existing && existing.length > 0) {
    console.log(`⚠️  기존 티어 ${existing.length}개 발견. 삭제 후 재생성합니다.`)
    const { error: delError } = await supabase
      .from('starcraft_tier_members')
      .delete()
      .gte('id', 0)
    if (delError) console.log('   멤버 삭제:', delError.message)

    const { error: delTierError } = await supabase
      .from('starcraft_tiers')
      .delete()
      .gte('id', 0)
    if (delTierError) {
      console.error('❌ 티어 삭제 실패:', delTierError.message)
      process.exit(1)
    }
    console.log('✅ 기존 데이터 삭제 완료\n')
  }

  // 티어 삽입
  console.log('📝 티어 삽입 중...')
  const { data: inserted, error } = await supabase
    .from('starcraft_tiers')
    .insert(tiers)
    .select('id, name, display_order, color')

  if (error) {
    console.error('❌ 삽입 실패:', error.message)
    process.exit(1)
  }

  console.log('\n✅ 스타크래프트 티어 삽입 완료!\n')
  console.log('┌────┬──────────────┬──────┬─────────┐')
  console.log('│ ID │ 이름         │ 순서 │ 컬러    │')
  console.log('├────┼──────────────┼──────┼─────────┤')
  for (const t of inserted!) {
    const id = String(t.id).padStart(2)
    const name = t.name.padEnd(10)
    const order = String(t.display_order).padStart(2)
    console.log(`│ ${id} │ ${name} │   ${order} │ ${t.color} │`)
  }
  console.log('└────┴──────────────┴──────┴─────────┘')

  console.log(`\n총 ${inserted!.length}개 티어 삽입 완료`)
  console.log('\n📌 종족 컬러 가이드:')
  console.log('   테란: #3b82f6 (파랑)')
  console.log('   저그:  #a855f7 (보라)')
  console.log('   프로토스: #f59e0b (노랑주황)')
}

main().catch(console.error)
