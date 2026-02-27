'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) return null
  return typeof data.value === 'string' ? data.value : JSON.stringify(data.value)
}

export async function updateSetting(key: string, value: string): Promise<{ error: string | null }> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) return { error: error.message }
  return { error: null }
}
