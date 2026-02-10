'use server'

import { adminAction, publicAction, type ActionResult } from './index'
import type { InsertTables, UpdateTables, Season } from '@/types/database'

type SeasonInsert = InsertTables<'seasons'>
type SeasonUpdate = UpdateTables<'seasons'>

/**
 * 시즌 생성
 */
export async function createSeason(
  data: SeasonInsert
): Promise<ActionResult<Season>> {
  return adminAction(async (supabase) => {
    const { data: season, error } = await supabase
      .from('seasons')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return season
  }, ['/admin/seasons', '/ranking'])
}

/**
 * 시즌 수정
 */
export async function updateSeason(
  id: number,
  data: SeasonUpdate
): Promise<ActionResult<Season>> {
  return adminAction(async (supabase) => {
    const { data: season, error } = await supabase
      .from('seasons')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return season
  }, ['/admin/seasons', '/ranking'])
}

/**
 * 시즌 삭제
 */
export async function deleteSeason(
  id: number
): Promise<ActionResult<null>> {
  return adminAction(async (supabase) => {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return null
  }, ['/admin/seasons', '/ranking'])
}

/**
 * 활성 시즌 설정 (다른 시즌은 비활성화)
 */
export async function setActiveSeason(
  id: number
): Promise<ActionResult<Season>> {
  return adminAction(async (supabase) => {
    // 모든 시즌 비활성화
    await supabase
      .from('seasons')
      .update({ is_active: false })
      .neq('id', 0) // 모든 행

    // 선택된 시즌 활성화
    const { data: season, error } = await supabase
      .from('seasons')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return season
  }, ['/admin/seasons', '/ranking'])
}

/**
 * 모든 시즌 조회 (공개)
 */
export async function getSeasons(): Promise<ActionResult<Season[]>> {
  return publicAction(async (supabase) => {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  })
}

/**
 * 활성 시즌 조회 (공개)
 */
export async function getActiveSeason(): Promise<ActionResult<Season | null>> {
  return publicAction(async (supabase) => {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message)
    }
    return data
  })
}
