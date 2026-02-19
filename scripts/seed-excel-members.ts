/**
 * 이노레이블 엑셀부 멤버 데이터 시딩
 *
 * 사용법: npx tsx scripts/seed-excel-members.ts
 */

import { getServiceClient, checkError } from './lib/supabase'

const supabase = getServiceClient()

interface MemberData {
  unit: 'excel' | 'crew'
  name: string
  role: string
  position_order: number
  social_links: Record<string, string>
  is_active: boolean
}

const excelMembers: MemberData[] = [
  {
    unit: 'excel',
    name: '[BJ]김인호',
    role: '대표',
    position_order: 1,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/pookygamja',
      instagram: 'https://www.instagram.com/kiminho22',
      youtube: 'https://www.youtube.com/@kiminho22',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '꽃부기♥',
    role: '차장',
    position_order: 2,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/flowerboogie',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '이월♥',
    role: '과장',
    position_order: 3,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/bc3yu2fl',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '누리-',
    role: '실장',
    position_order: 4,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/nooree',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '청아♥',
    role: '비서',
    position_order: 5,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/subin0750',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '애지니♡',
    role: '사원',
    position_order: 6,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/yeeeee00',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '설탱♥',
    role: '사원',
    position_order: 7,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/baek224983',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '임로아♥',
    role: '사원',
    position_order: 8,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/jh5918',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '서하빈♡',
    role: '신입',
    position_order: 9,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/lindao3o',
    },
    is_active: true,
  },
  {
    unit: 'excel',
    name: '밤비♥',
    role: '신입',
    position_order: 10,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/sonhj2244',
    },
    is_active: true,
  },
]

async function main() {
  console.log('🏢 이노레이블 엑셀부 멤버 데이터 시딩 시작...\n')

  // 1. 기존 엑셀부 데이터 확인
  const { data: existing } = await supabase
    .from('organization')
    .select('id, name, role')
    .eq('unit', 'excel')
    .order('position_order')

  if (existing && existing.length > 0) {
    console.log(`⚠️  기존 엑셀부 멤버 ${existing.length}명 발견:`)
    for (const m of existing) {
      console.log(`   - [${m.role}] ${m.name} (id: ${m.id})`)
    }
    console.log('\n🗑️  기존 데이터 삭제 중...')
    const { error: delError } = await supabase
      .from('organization')
      .delete()
      .eq('unit', 'excel')
    if (delError) {
      console.error('❌ 삭제 실패:', delError.message)
      process.exit(1)
    }
    console.log('✅ 기존 데이터 삭제 완료\n')
  }

  // 2. 새 멤버 삽입
  console.log('📝 새 멤버 삽입 중...')
  const { data: inserted, error } = await supabase
    .from('organization')
    .insert(excelMembers)
    .select('id, name, role, position_order')

  if (error) {
    console.error('❌ 삽입 실패:', error.message)
    process.exit(1)
  }

  // 3. 대표의 id를 parent_id로 설정 (계층 구조)
  const representative = inserted?.find(m => m.role === '대표')
  if (representative) {
    const childIds = inserted!
      .filter(m => m.role !== '대표')
      .map(m => m.id)

    if (childIds.length > 0) {
      const { error: updateError } = await supabase
        .from('organization')
        .update({ parent_id: representative.id })
        .in('id', childIds)

      if (updateError) {
        console.error('⚠️  parent_id 설정 실패:', updateError.message)
      } else {
        console.log(`✅ parent_id 설정 완료 (대표 id: ${representative.id})`)
      }
    }
  }

  // 4. 결과 출력
  console.log('\n✅ 엑셀부 멤버 삽입 완료!\n')
  console.log('┌────┬─────────────┬──────┬───────┐')
  console.log('│ ID │ 이름        │ 직급 │ 순서  │')
  console.log('├────┼─────────────┼──────┼───────┤')
  for (const m of inserted!) {
    const id = String(m.id).padStart(2)
    const name = m.name.padEnd(10)
    const role = m.role.padEnd(4)
    const order = String(m.position_order).padStart(2)
    console.log(`│ ${id} │ ${name} │ ${role} │   ${order}  │`)
  }
  console.log('└────┴─────────────┴──────┴───────┘')
  console.log(`\n총 ${inserted!.length}명 삽입 완료`)
}

main().catch(console.error)
