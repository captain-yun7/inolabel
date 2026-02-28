'use client'

import { useEffect } from 'react'
import { useSupabaseContext, useAuthContext } from '@/lib/context'

/**
 * 온라인 프레즌스 트래커
 * 인증된 사용자가 사이트에 접속하면 Supabase Realtime Presence 채널에 참여
 * 관리자 대시보드에서 현재 접속자 수를 표시하는 데 사용
 */
export default function OnlinePresence() {
  const supabase = useSupabaseContext()
  const { user } = useAuthContext()

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel('online-users', {
      config: { presence: { key: user.id } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        // 프레즌스 동기화 (대시보드에서 읽음)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user])

  return null
}
