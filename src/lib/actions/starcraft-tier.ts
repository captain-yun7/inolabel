'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { StarcraftTier, StarcraftTierMember, StarcraftTierWithMembers, StarcraftRace } from '@/types/database'

// 모든 티어 + 멤버 조회 (공개)
export async function getTiersWithMembers(): Promise<{
  data: StarcraftTierWithMembers[] | null
  error: string | null
}> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: tiers, error: tiersError } = await supabase
      .from('starcraft_tiers')
      .select('*')
      .order('display_order', { ascending: true })

    if (tiersError) throw tiersError

    const { data: members, error: membersError } = await supabase
      .from('starcraft_tier_members')
      .select('*')
      .order('position_order', { ascending: true })

    if (membersError) throw membersError

    const tiersWithMembers: StarcraftTierWithMembers[] = (tiers || []).map((tier: StarcraftTier) => ({
      ...tier,
      members: (members || []).filter((m: StarcraftTierMember) => m.tier_id === tier.id),
    }))

    return { data: tiersWithMembers, error: null }
  } catch (error) {
    console.error('getTiersWithMembers error:', error)
    return { data: null, error: '티어 데이터를 불러오는 데 실패했습니다' }
  }
}

// 티어에 멤버 추가 (관리자용)
export async function addTierMember(data: {
  tier_id: number
  player_name: string
  race?: StarcraftRace | null
  image_url?: string | null
  soop_id?: string | null
  description?: string | null
}): Promise<{ data: StarcraftTierMember | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    // 현재 유저 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: '로그인이 필요합니다' }

    // 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'superadmin', 'moderator'].includes(profile.role)) {
      return { data: null, error: '권한이 없습니다' }
    }

    // 현재 티어의 최대 position_order 조회
    const { data: maxOrder } = await supabase
      .from('starcraft_tier_members')
      .select('position_order')
      .eq('tier_id', data.tier_id)
      .order('position_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.position_order ?? -1) + 1

    const { data: member, error } = await supabase
      .from('starcraft_tier_members')
      .insert({
        tier_id: data.tier_id,
        player_name: data.player_name,
        race: data.race || null,
        image_url: data.image_url || null,
        soop_id: data.soop_id || null,
        description: data.description || null,
        position_order: nextOrder,
        added_by: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return { data: member, error: null }
  } catch (error) {
    console.error('addTierMember error:', error)
    return { data: null, error: '멤버 추가에 실패했습니다' }
  }
}

// 멤버 삭제 (관리자용)
export async function removeTierMember(memberId: number): Promise<{ error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '로그인이 필요합니다' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'superadmin', 'moderator'].includes(profile.role)) {
      return { error: '권한이 없습니다' }
    }

    const { error } = await supabase
      .from('starcraft_tier_members')
      .delete()
      .eq('id', memberId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('removeTierMember error:', error)
    return { error: '멤버 삭제에 실패했습니다' }
  }
}

// 멤버 수정 (관리자용)
export async function updateTierMember(
  memberId: number,
  data: {
    player_name?: string
    race?: StarcraftRace | null
    image_url?: string | null
    soop_id?: string | null
    description?: string | null
    tier_id?: number
    position_order?: number
  }
): Promise<{ error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '로그인이 필요합니다' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'superadmin', 'moderator'].includes(profile.role)) {
      return { error: '권한이 없습니다' }
    }

    const { error } = await supabase
      .from('starcraft_tier_members')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('updateTierMember error:', error)
    return { error: '멤버 수정에 실패했습니다' }
  }
}
