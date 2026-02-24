/**
 * goods 테이블 생성 + 샘플 데이터 삽입
 *
 * Supabase REST API로는 DDL 실행 불가하므로
 * postgrest-js의 raw SQL 실행을 시도하고,
 * 실패 시 fetch로 Supabase SQL API 호출
 */

import { getServiceClient } from './lib/supabase'

async function main() {
  const supabase = getServiceClient()

  // 먼저 테이블이 이미 있는지 확인 (insert 시도)
  const { error: checkError } = await supabase
    .from('goods')
    .select('id')
    .limit(1)

  if (checkError && checkError.message.includes('Could not find')) {
    console.log('❌ goods 테이블이 존재하지 않습니다.')
    console.log('')
    console.log('Supabase Dashboard SQL Editor에서 다음 SQL을 실행해주세요:')
    console.log('파일: scripts/sql/20260224_create-goods-table.sql')
    console.log('')
    console.log('https://supabase.com/dashboard/project/cdiptfmagemjfmsuphaj/sql/new')
    process.exit(1)
  }

  console.log('✅ goods 테이블 확인됨')

  // 기존 데이터 확인
  const { data: existing } = await supabase
    .from('goods')
    .select('id')

  if (existing && existing.length > 0) {
    console.log(`이미 ${existing.length}개 상품이 있습니다. 추가 삽입을 건너뜁니다.`)
    return
  }

  // 샘플 상품 삽입
  const { data, error } = await supabase
    .from('goods')
    .insert({
      name: 'INOLABEL 공식 로고 머그컵',
      price: 15000,
      image_url: '/assets/logo/inolabel_logo.png',
      description: 'INOLABEL 공식 로고가 새겨진 프리미엄 머그컵입니다. 350ml 용량으로 일상 속에서 INOLABEL의 감성을 느껴보세요.',
      detail_image_url: '/assets/logo/inolabel_logo.png',
      purchase_url: null,
      is_active: true,
    })
    .select()

  if (error) {
    console.error('❌ 삽입 실패:', error.message)
    return
  }

  console.log('✅ 샘플 상품 삽입 완료:', data)
}

main()
