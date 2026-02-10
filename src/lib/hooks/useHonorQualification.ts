'use client'

import { useEffect, useState } from 'react'
import { useAuthContext, useSupabaseContext } from '@/lib/context'
import { USE_MOCK_DATA } from '@/lib/config'
import { hasHonorPageQualification } from '@/lib/mock'

interface HonorQualificationResult {
  isQualified: boolean
  isLoading: boolean
  rank: number | null
  seasonId: number | null
}

export function useHonorQualification(): HonorQualificationResult {
  const supabase = useSupabaseContext()
  const { user, profile, isLoading: authLoading } = useAuthContext()
  const [isQualified, setIsQualified] = useState(false)
  const [rank, setRank] = useState<number | null>(null)
  const [seasonId, setSeasonId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQualification = async () => {
      setIsLoading(true)
      if (authLoading) return

      if (!user) {
        setIsQualified(false)
        setRank(null)
        setSeasonId(null)
        setIsLoading(false)
        return
      }

      if (profile?.role === 'admin' || profile?.role === 'superadmin') {
        setIsQualified(true)
        setRank(null)
        setSeasonId(null)
        setIsLoading(false)
        return
      }

      if (USE_MOCK_DATA) {
        setIsQualified(hasHonorPageQualification(user.id))
        setRank(null)
        setSeasonId(null)
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('vip_rewards')
        .select('rank, season_id')
        .eq('profile_id', user.id)
        .lte('rank', 3)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('헌정 자격 조회 실패:', error)
        setIsQualified(false)
        setRank(null)
        setSeasonId(null)
        setIsLoading(false)
        return
      }

      const reward = Array.isArray(data) ? data[0] : null
      const rewardRank = reward?.rank ?? null
      setRank(rewardRank)
      setSeasonId(reward?.season_id ?? null)
      setIsQualified(rewardRank !== null && rewardRank <= 3)
      setIsLoading(false)
    }

    fetchQualification()
  }, [authLoading, user, profile, supabase])

  return { isQualified, isLoading, rank, seasonId }
}
