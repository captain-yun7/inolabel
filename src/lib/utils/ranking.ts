/**
 * 랭킹 관련 유틸리티 함수
 * 순위 아이콘, 클래스, 이니셜 생성 등
 */

import { Crown, Medal, Award, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type RankTier = 'gold' | 'silver' | 'bronze' | 'elite' | 'default'

/**
 * 순위에 해당하는 아이콘 컴포넌트 반환
 * @param rank - 순위 (1, 2, 3)
 * @param variant - 'standard' (1=Crown, 2=Medal, 3=Award) | 'minimal' (1=Crown, 2,3=Star)
 * @returns LucideIcon 컴포넌트 또는 null
 */
export const getRankIcon = (
  rank: number,
  variant: 'standard' | 'minimal' = 'standard'
): LucideIcon | null => {
  if (rank === 1) return Crown
  if (variant === 'minimal') {
    return rank <= 3 ? Star : null
  }
  if (rank === 2) return Medal
  if (rank === 3) return Award
  return null
}

/**
 * 순위에 해당하는 색상 티어 반환
 * @param rank - 순위
 * @param variant - 'standard' | 'elite' (2,3위 동일 처리)
 * @returns RankTier 문자열
 */
export const getRankTier = (
  rank: number,
  variant: 'standard' | 'elite' = 'standard'
): RankTier => {
  if (rank === 1) return 'gold'
  if (variant === 'elite' && rank <= 3) return 'elite'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return 'default'
}

/**
 * 닉네임에서 이니셜 생성
 * @param name - 닉네임
 * @param options - { koreanMax: 한글 최대 글자수, englishMax: 영어 최대 글자수 }
 * @returns 이니셜 문자열
 */
export const getInitials = (
  name: string,
  options?: { koreanMax?: number; englishMax?: number }
): string => {
  const { koreanMax = 2, englishMax = 2 } = options || {}
  const cleaned = name.replace(/[^가-힣a-zA-Z]/g, '')

  if (/[가-힣]/.test(cleaned)) {
    return cleaned.slice(0, koreanMax)
  }
  return cleaned.slice(0, englishMax).toUpperCase()
}
