/**
 * SOOP TV 방송국에서 프로필 이미지를 가져와서 organization 테이블에 업데이트
 */
import { getServiceClient } from './lib/supabase'

const supabase = getServiceClient()
const CHANNEL_API_URL = 'https://chapi.sooplive.co.kr/api'

interface SocialLinks {
  soop?: string
  sooptv?: string
  pandatv?: string
  [key: string]: string | undefined
}

function extractBjId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /sooplive\.co\.kr\/station\/([a-zA-Z0-9_]+)/,
    /sooplive\.co\.kr\/([a-zA-Z0-9_]+)/,
    /soop\.co\.kr\/([a-zA-Z0-9_]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  if (/^[a-zA-Z0-9_]+$/.test(url)) return url
  return null
}

async function fetchProfileImage(bjId: string): Promise<string | null> {
  try {
    // /station 엔드포인트에 top-level profile_image가 있음
    const response = await fetch(`${CHANNEL_API_URL}/${bjId}/station`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.warn(`  API ${response.status} for ${bjId}`)
      return null
    }

    const data = await response.json()
    const img = data.profile_image as string | undefined
    if (img) {
      // protocol-relative URL을 https로 변환
      return img.startsWith('//') ? `https:${img}` : img
    }
    return null
  } catch (error) {
    console.warn(`  Failed to fetch ${bjId}:`, error)
    return null
  }
}

async function main() {
  console.log('=== SOOP TV 프로필 이미지 수집 ===\n')

  const { data: members, error } = await supabase
    .from('organization')
    .select('id, name, unit, social_links, image_url')
    .eq('is_active', true)
    .order('id')

  if (error || !members) {
    console.error('Failed to fetch members:', error)
    process.exit(1)
  }

  console.log(`총 ${members.length}명 멤버 발견\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const member of members) {
    const links = member.social_links as SocialLinks | null
    const soopUrl = links?.soop || links?.sooptv || links?.pandatv

    if (!soopUrl) {
      console.log(`[${member.id}] ${member.name} - SOOP URL 없음, 스킵`)
      skipped++
      continue
    }

    const bjId = extractBjId(soopUrl)
    if (!bjId) {
      console.log(`[${member.id}] ${member.name} - BJ ID 추출 실패 (${soopUrl}), 스킵`)
      skipped++
      continue
    }

    console.log(`[${member.id}] ${member.name} (${bjId}) ...`)

    const profileImage = await fetchProfileImage(bjId)

    if (!profileImage) {
      console.log(`  → 프로필 이미지 없음`)
      failed++
      continue
    }

    console.log(`  → ${profileImage}`)

    const { error: updateError } = await supabase
      .from('organization')
      .update({ image_url: profileImage })
      .eq('id', member.id)

    if (updateError) {
      console.error(`  → DB 업데이트 실패:`, updateError)
      failed++
    } else {
      console.log(`  → ✅ 업데이트 완료`)
      updated++
    }

    // API rate limit 방지
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`\n=== 결과 ===`)
  console.log(`업데이트: ${updated}명`)
  console.log(`스킵: ${skipped}명`)
  console.log(`실패: ${failed}명`)
}

main().catch(console.error)
