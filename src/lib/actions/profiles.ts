'use server'

import { adminAction, authAction, publicAction, type ActionResult } from './index'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { InsertTables, UpdateTables, Profile } from '@/types/database'

type ProfileInsert = InsertTables<'profiles'>
type ProfileUpdate = UpdateTables<'profiles'>

/**
 * 프로필 생성 (Admin)
 */
export async function createProfile(
  data: ProfileInsert
): Promise<ActionResult<Profile>> {
  return adminAction(async (supabase) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return profile
  }, ['/admin/members'])
}

/**
 * 프로필 수정 (Admin)
 */
export async function updateProfileByAdmin(
  id: string,
  data: ProfileUpdate
): Promise<ActionResult<Profile>> {
  return adminAction(async (supabase) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return profile
  }, ['/admin/members', '/ranking'])
}

/**
 * 프로필 삭제 (Admin) - 연관 데이터 cascade 정리 후 삭제
 */
export async function deleteProfile(
  id: string
): Promise<ActionResult<null>> {
  return adminAction(async () => {
    const serviceClient = createServiceRoleClient()

    // FK 참조하는 테이블의 연관 데이터를 먼저 정리
    // 1. 댓글 삭제 (comments.author_id)
    await serviceClient.from('comments').delete().eq('author_id', id)
    // 2. 게시글 좋아요 삭제 (post_likes.user_id) - CASCADE 있지만 확실하게
    await serviceClient.from('post_likes').delete().eq('user_id', id)
    // 3. 게시글 삭제 (posts.author_id)
    await serviceClient.from('posts').delete().eq('author_id', id)
    // 4. VIP 메시지 댓글 삭제 (vip_message_comments.author_id)
    await serviceClient.from('vip_message_comments').delete().eq('author_id', id)
    // 5. VIP 개인 메시지 삭제 (vip_personal_messages)
    await serviceClient.from('vip_personal_messages').delete().eq('vip_profile_id', id)
    await serviceClient.from('vip_personal_messages').delete().eq('author_id', id)
    // 6. BJ 감사 메시지 삭제 (bj_thank_you_messages.vip_profile_id)
    await serviceClient.from('bj_thank_you_messages').delete().eq('vip_profile_id', id)
    // 7. VIP 리워드 삭제 (vip_rewards.profile_id)
    await serviceClient.from('vip_rewards').delete().eq('profile_id', id)
    // 8. nullable FK들은 NULL로 설정
    await serviceClient.from('organization').update({ profile_id: null }).eq('profile_id', id)
    await serviceClient.from('donations').update({ donor_id: null }).eq('donor_id', id)
    await serviceClient.from('schedules').update({ created_by: null }).eq('created_by', id)
    await serviceClient.from('notices').update({ author_id: null }).eq('author_id', id)
    await serviceClient.from('rank_battle_records').update({ donor_id: null }).eq('donor_id', id)
    await serviceClient.from('total_donation_rankings').update({ donor_id: null }).eq('donor_id', id)
    await serviceClient.from('season_donation_rankings').update({ donor_id: null }).eq('donor_id', id)
    // payment_logs, donation_requests, signatures_images는 스키마에 없으면 skip

    // 프로필 삭제
    const { error } = await serviceClient
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return null
  }, ['/admin/members'])
}

/**
 * 역할 변경 (Admin)
 */
export async function updateUserRole(
  id: string,
  role: Profile['role']
): Promise<ActionResult<Profile>> {
  return adminAction(async (supabase) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return profile
  }, ['/admin/members'])
}

/**
 * 닉네임 중복 체크
 */
export async function checkNicknameDuplicate(
  nickname: string,
  excludeUserId?: string
): Promise<ActionResult<boolean>> {
  return publicAction(async (supabase) => {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)

    if (excludeUserId) {
      query = query.neq('id', excludeUserId)
    }

    const { data, error } = await query.limit(1)

    if (error) throw new Error(error.message)
    return (data?.length || 0) > 0
  })
}

/**
 * 자신의 프로필 수정 (닉네임 중복 체크 포함)
 */
export async function updateMyProfile(
  data: Pick<ProfileUpdate, 'nickname' | 'avatar_url'>
): Promise<ActionResult<Profile>> {
  return authAction(async (supabase, userId) => {
    // 닉네임 중복 체크
    if (data.nickname) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', data.nickname)
        .neq('id', userId)
        .limit(1)

      if (existing && existing.length > 0) {
        throw new Error('이미 사용 중인 닉네임입니다.')
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return profile
  }, ['/mypage'])
}

/**
 * 비밀번호 변경
 */
export async function changePassword(
  newPassword: string
): Promise<ActionResult<null>> {
  return authAction(async (supabase) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw new Error(error.message)
    return null
  })
}

/**
 * 회원 탈퇴
 */
export async function deleteMyAccount(): Promise<ActionResult<null>> {
  return authAction(async (supabase, userId) => {
    // 1. 프로필 삭제 (soft delete 또는 익명화 처리 가능)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) throw new Error(profileError.message)

    // 2. Supabase Auth에서 사용자 삭제는 Admin API로만 가능
    // 클라이언트에서 signOut 처리
    await supabase.auth.signOut()

    return null
  })
}

/**
 * 프로필 목록 조회 (Admin)
 */
export async function getProfiles(options?: {
  page?: number
  limit?: number
  role?: Profile['role']
  unit?: 'excel' | 'crew'
}): Promise<ActionResult<{ data: Profile[]; count: number }>> {
  return adminAction(async (supabase) => {
    const { page = 1, limit = 20, role, unit } = options || {}
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('total_donation', { ascending: false })
      .range(from, to)

    if (role) {
      query = query.eq('role', role)
    }
    if (unit) {
      query = query.eq('unit', unit)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)
    return { data: data || [], count: count || 0 }
  })
}

/**
 * 프로필 조회 (공개)
 */
export async function getProfileById(
  id: string
): Promise<ActionResult<Profile | null>> {
  return publicAction(async (supabase) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message)
    }
    return data
  })
}

/**
 * Top N 후원자 조회 (공개)
 */
export async function getTopDonors(
  limit: number = 50
): Promise<ActionResult<Profile[]>> {
  return publicAction(async (supabase) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .gt('total_donation', 0)
      .order('total_donation', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  })
}
