/**
 * organization 테이블 생성 + 엑셀부 멤버 시딩
 *
 * 사용법: npx tsx scripts/create-org-table.ts
 */

import { getServiceClient } from './lib/supabase'
import fs from 'fs'
import path from 'path'

const supabase = getServiceClient()

async function main() {
  // 1. 테이블 존재 여부 확인
  console.log('🔍 organization 테이블 확인 중...')

  const { data: testData, error: testError } = await supabase
    .from('organization')
    .select('id')
    .limit(1)

  if (testError && testError.message.includes('does not exist')) {
    console.log('❌ organization 테이블이 없습니다.')
    console.log('\n📋 Supabase Dashboard SQL Editor에서 아래 파일의 SQL을 실행해주세요:')
    console.log('   scripts/sql/create-organization.sql')
    console.log('\n📍 경로: https://supabase.com/dashboard/project/cdiptfmagemjfmsuphaj/sql/new')

    const sqlPath = path.join(__dirname, 'sql', 'create-organization.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log('\n─── SQL 내용 ───')
    console.log(sql)
    console.log('─── SQL 끝 ───\n')
    console.log('SQL 실행 후 다시 시드 스크립트를 실행해주세요:')
    console.log('   npx tsx scripts/seed-excel-members.ts')
    return
  }

  if (testError && !testError.message.includes('does not exist')) {
    // 테이블은 있지만 다른 에러
    console.log('⚠️  에러:', testError.message)
    return
  }

  // 테이블 존재하면 바로 시딩
  console.log('✅ organization 테이블 확인됨. 시딩 시작...\n')

  // seed-excel-members.ts의 로직 실행
  const { execSync } = await import('child_process')
  execSync('npx tsx scripts/seed-excel-members.ts', {
    stdio: 'inherit',
    cwd: process.cwd(),
  })
}

main().catch(console.error)
