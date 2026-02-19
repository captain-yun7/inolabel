/**
 * 이노레이블 스타부(crew) 멤버 데이터 시딩
 * + 스타크래프트 티어 멤버 데이터 시딩
 *
 * 사용법: npx tsx scripts/seed-crew-members.ts
 */

import { getServiceClient } from './lib/supabase'

const supabase = getServiceClient()

interface CrewMember {
  unit: 'crew'
  name: string
  role: string
  position_order: number
  social_links: Record<string, string>
  is_active: boolean
}

// 스타부 조직 멤버
const crewMembers: CrewMember[] = [
  {
    unit: 'crew',
    name: '[BJ]김인호',
    role: '이사장',
    position_order: 1,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/pookygamja',
      instagram: 'https://www.instagram.com/kiminho22',
      youtube: 'https://www.youtube.com/@kiminho22',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: 'Action김성대',
    role: '총장',
    position_order: 2,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/tjdeosks',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: 'Organ.임진묵',
    role: '부총장',
    position_order: 3,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/organ333',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: 'Mini변현제',
    role: '교수',
    position_order: 4,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/bye1013',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: 'Sacsri이예훈',
    role: '교수',
    position_order: 5,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/gnsl418',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '산적왕윤수철',
    role: '교수',
    position_order: 6,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/snfjdro369',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '잉어킹구성훈',
    role: '교수',
    position_order: 7,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/rladuddo99',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '어윤수soO',
    role: '교수',
    position_order: 8,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/djdbstn',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '김범수P',
    role: '교수',
    position_order: 9,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/bumsoo552',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '다나짱♥',
    role: '학생',
    position_order: 10,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/cyj982002',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '이유란ㅇ',
    role: '학생',
    position_order: 11,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/forweourus',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '박듀듀:P',
    role: '학생',
    position_order: 12,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/parkle1006',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '[B]라운이',
    role: '학생',
    position_order: 13,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/dmsthfdldia',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '비타밍♥',
    role: '학생',
    position_order: 14,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/seemin88',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '김설♥♥',
    role: '학생',
    position_order: 15,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/rnfma14',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '수니양.',
    role: '학생',
    position_order: 16,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/nasd06',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '다뉴',
    role: '학생',
    position_order: 17,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/danu619',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '아리송이♡',
    role: '학생',
    position_order: 18,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/vldpfm2',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '김말랑♥',
    role: '학생',
    position_order: 19,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/5eulgii',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '-연또-',
    role: '학생',
    position_order: 20,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/kjy3443',
    },
    is_active: true,
  },
  {
    unit: 'crew',
    name: '밤하밍',
    role: '학생',
    position_order: 21,
    social_links: {
      soop: 'https://www.sooplive.co.kr/station/haeun5513',
    },
    is_active: true,
  },
]

// 스타크래프트 티어 멤버 데이터
// tier_name → 해당 티어에 배치할 멤버들
const tierMemberData: Record<string, { player_name: string; race: 'terran' | 'zerg' | 'protoss' }[]> = {
  '갓티어': [
    { player_name: 'Action김성대', race: 'zerg' },
    { player_name: 'Mini변현제', race: 'protoss' },
  ],
  '킹티어': [
    { player_name: 'Sacsri이예훈', race: 'zerg' },
    { player_name: '산적왕윤수철', race: 'protoss' },
    { player_name: '잉어킹구성훈', race: 'terran' },
  ],
  '잭티어': [
    { player_name: 'Organ.임진묵', race: 'terran' },
    { player_name: '어윤수soO', race: 'zerg' },
    { player_name: '김범수P', race: 'protoss' },
  ],
  '2티어': [
    { player_name: '다나짱♥', race: 'protoss' },
  ],
  '3티어': [
    { player_name: '[BJ]김인호', race: 'zerg' },
    { player_name: '이유란ㅇ', race: 'zerg' },
    { player_name: '박듀듀:P', race: 'protoss' },
  ],
  '5티어': [
    { player_name: '[B]라운이', race: 'protoss' },
  ],
  '6티어': [
    { player_name: '비타밍♥', race: 'terran' },
    { player_name: '김설♥♥', race: 'zerg' },
    { player_name: '수니양.', race: 'terran' },
  ],
  '7티어': [
    { player_name: '다뉴', race: 'zerg' },
    { player_name: '아리송이♡', race: 'protoss' },
    { player_name: '김말랑♥', race: 'terran' },
  ],
  '8티어': [
    { player_name: '-연또-', race: 'zerg' },
  ],
  '유스티어': [
    { player_name: '밤하밍', race: 'terran' },
  ],
}

async function main() {
  console.log('🎮 이노레이블 스타부(crew) 멤버 + 티어 멤버 시딩 시작...\n')

  // ─── Part 1: 스타부 조직 멤버 ───
  console.log('═══ Part 1: 스타부 조직 멤버 ═══\n')

  // 기존 crew 데이터 확인
  const { data: existingCrew } = await supabase
    .from('organization')
    .select('id, name, role')
    .eq('unit', 'crew')
    .order('position_order')

  if (existingCrew && existingCrew.length > 0) {
    console.log(`⚠️  기존 스타부 멤버 ${existingCrew.length}명 발견. 삭제 후 재생성합니다.`)
    const { error: delError } = await supabase
      .from('organization')
      .delete()
      .eq('unit', 'crew')
    if (delError) {
      console.error('❌ 삭제 실패:', delError.message)
      process.exit(1)
    }
    console.log('✅ 기존 crew 데이터 삭제 완료\n')
  }

  // 스타부 멤버 삽입
  console.log('📝 스타부 멤버 삽입 중...')
  const { data: insertedCrew, error: crewError } = await supabase
    .from('organization')
    .insert(crewMembers)
    .select('id, name, role, position_order')

  if (crewError) {
    console.error('❌ 스타부 멤버 삽입 실패:', crewError.message)
    process.exit(1)
  }

  // 이사장의 id를 parent_id로 설정
  const chairman = insertedCrew?.find(m => m.role === '이사장')
  if (chairman) {
    const childIds = insertedCrew!
      .filter(m => m.role !== '이사장')
      .map(m => m.id)

    if (childIds.length > 0) {
      const { error: updateError } = await supabase
        .from('organization')
        .update({ parent_id: chairman.id })
        .in('id', childIds)

      if (updateError) {
        console.error('⚠️  parent_id 설정 실패:', updateError.message)
      } else {
        console.log(`✅ parent_id 설정 완료 (이사장 id: ${chairman.id})`)
      }
    }
  }

  console.log(`\n✅ 스타부 멤버 ${insertedCrew!.length}명 삽입 완료!\n`)
  for (const m of insertedCrew!) {
    console.log(`   [${m.role}] ${m.name}`)
  }

  // ─── Part 2: 스타크래프트 티어 멤버 ───
  console.log('\n═══ Part 2: 스타크래프트 티어 멤버 ═══\n')

  // 기존 티어 멤버 삭제
  const { data: existingTierMembers } = await supabase
    .from('starcraft_tier_members')
    .select('id')

  if (existingTierMembers && existingTierMembers.length > 0) {
    console.log(`⚠️  기존 티어 멤버 ${existingTierMembers.length}명 발견. 삭제 후 재생성합니다.`)
    const { error: delError } = await supabase
      .from('starcraft_tier_members')
      .delete()
      .gte('id', 0)
    if (delError) {
      console.error('❌ 티어 멤버 삭제 실패:', delError.message)
      process.exit(1)
    }
    console.log('✅ 기존 티어 멤버 삭제 완료\n')
  }

  // 티어 목록 조회
  const { data: tiers, error: tiersError } = await supabase
    .from('starcraft_tiers')
    .select('id, name')
    .order('display_order')

  if (tiersError || !tiers) {
    console.error('❌ 티어 목록 조회 실패:', tiersError?.message)
    process.exit(1)
  }

  // 티어 이름 → id 맵
  const tierMap = new Map<string, number>()
  for (const t of tiers) {
    tierMap.set(t.name, t.id)
  }

  // 티어 멤버 삽입
  console.log('📝 티어 멤버 삽입 중...')
  let totalInserted = 0

  for (const [tierName, members] of Object.entries(tierMemberData)) {
    const tierId = tierMap.get(tierName)
    if (!tierId) {
      console.error(`⚠️  티어 "${tierName}" 찾을 수 없음. 건너뜀.`)
      continue
    }

    const rows = members.map((m, idx) => ({
      tier_id: tierId,
      player_name: m.player_name,
      race: m.race,
      position_order: idx,
    }))

    const { data: inserted, error } = await supabase
      .from('starcraft_tier_members')
      .insert(rows)
      .select('id, player_name, race')

    if (error) {
      console.error(`❌ ${tierName} 멤버 삽입 실패:`, error.message)
      continue
    }

    console.log(`   ✅ ${tierName}: ${inserted!.map(m => `${m.player_name}(${m.race})`).join(', ')}`)
    totalInserted += inserted!.length
  }

  console.log(`\n✅ 총 ${totalInserted}명 티어 멤버 삽입 완료!`)

  // 종합 요약
  console.log('\n═══ 시딩 완료 요약 ═══')
  console.log(`   스타부 조직: ${insertedCrew!.length}명`)
  console.log(`   티어 멤버: ${totalInserted}명`)
}

main().catch(console.error)
