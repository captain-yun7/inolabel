'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'

interface GoodsPayload {
  name: string
  price: number
  image_url: string
  description?: string | null
  detail_image_url?: string | null
  purchase_url?: string | null
  is_active?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db() {
  const supabase = createServiceRoleClient()
  // goods 테이블이 database.ts 타입에 미등록이라 any 캐스팅
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('goods')
}

export async function getGoods() {
  const { data, error } = await db()
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data as GoodsItem[] | null, error: error?.message || null }
}

interface GoodsItem {
  id: number
  name: string
  price: number
  image_url: string
  description: string | null
  detail_image_url: string | null
  purchase_url: string | null
  is_active: boolean
}

export async function createGoods(payload: GoodsPayload) {
  const { data, error } = await db()
    .insert({
      name: payload.name,
      price: payload.price || 0,
      image_url: payload.image_url,
      description: payload.description || null,
      detail_image_url: payload.detail_image_url || null,
      purchase_url: payload.purchase_url || null,
      is_active: payload.is_active ?? true,
    })
    .select()
    .single()

  return { data: data as GoodsItem | null, error: error?.message || null }
}

export async function updateGoods(id: number, payload: Partial<GoodsPayload>) {
  const { error } = await db()
    .update(payload)
    .eq('id', id)

  return { error: error?.message || null }
}

export async function deleteGoods(id: number) {
  const { error } = await db()
    .delete()
    .eq('id', id)

  return { error: error?.message || null }
}

export async function bulkCreateGoods(items: GoodsPayload[]) {
  const { error } = await db()
    .insert(items.map(item => ({
      name: item.name,
      price: item.price || 0,
      image_url: item.image_url,
      description: item.description || null,
      detail_image_url: item.detail_image_url || null,
      purchase_url: item.purchase_url || null,
      is_active: item.is_active ?? true,
    })))

  return { error: error?.message || null }
}
