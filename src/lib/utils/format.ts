/**
 * 통합 포맷팅 유틸리티 함수
 * 프로젝트 전체에서 사용되는 날짜/금액 포맷 함수 중앙화
 */

import { APP_CONFIG } from '../config'

/**
 * 날짜 문자열을 한국어 형식으로 포맷
 * @param dateStr - ISO 8601 또는 팬더티비 형식 날짜 문자열
 * @param options - Intl.DateTimeFormat 옵션
 * @returns 포맷된 날짜 문자열
 */
export const formatDate = (
  dateStr: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    if (isNaN(date.getTime())) {
      return dateStr as string
    }
    return new Intl.DateTimeFormat('ko-KR', options).format(date)
  } catch {
    return typeof dateStr === 'string' ? dateStr : ''
  }
}

/**
 * 날짜를 상대적 시간으로 표시 (예: "3일 전", "방금 전")
 * @param dateStr - 날짜 문자열 또는 Date 객체
 * @returns 상대적 시간 문자열
 */
export const formatRelativeTime = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    const diffWeek = Math.floor(diffDay / 7)
    const diffMonth = Math.floor(diffDay / 30)

    if (diffSec < 60) return '방금 전'
    if (diffMin < 60) return `${diffMin}분 전`
    if (diffHour < 24) return `${diffHour}시간 전`
    if (diffDay < 7) return `${diffDay}일 전`
    if (diffWeek < 4) return `${diffWeek}주 전`
    if (diffMonth < 12) return `${diffMonth}개월 전`
    return formatDate(date)
  } catch {
    return ''
  }
}

/**
 * 날짜를 간단한 형식으로 포맷 (YYYY.MM.DD)
 * @param dateStr - 날짜 문자열 또는 Date 객체
 * @returns 포맷된 날짜 문자열
 */
export const formatShortDate = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    if (isNaN(date.getTime())) {
      return typeof dateStr === 'string' ? dateStr : ''
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  } catch {
    return typeof dateStr === 'string' ? dateStr : ''
  }
}

/**
 * 금액을 하트 단위로 포맷
 * @param amount - 금액 숫자
 * @param unit - 단위 ('하트' 또는 '원')
 * @returns 포맷된 금액 문자열
 */
export const formatAmount = (
  amount: number,
  unit: '하트' | '원' = APP_CONFIG.donation.unit as '하트' | '원'
): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억 ${unit}`
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}만 ${unit}`
  }
  return `${amount.toLocaleString('ko-KR')} ${unit}`
}

/**
 * 숫자를 단축 형식으로 포맷 (예: 1.2K, 3.4M)
 * @param num - 숫자
 * @returns 포맷된 문자열
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString('ko-KR')
}

/**
 * 순위를 서수로 포맷 (예: 1st, 2nd, 3rd)
 * @param rank - 순위 숫자
 * @returns 포맷된 순위 문자열
 */
export const formatRank = (rank: number): string => {
  if (rank <= 0) return '-'
  if (rank === 1) return '1st'
  if (rank === 2) return '2nd'
  if (rank === 3) return '3rd'
  return `${rank}th`
}

/**
 * 순위를 한국어로 포맷 (예: 1위, 2위)
 * @param rank - 순위 숫자
 * @returns 포맷된 순위 문자열
 */
export const formatRankKo = (rank: number): string => {
  if (rank <= 0) return '-'
  return `${rank}위`
}

/**
 * 팬더티비 CSV 날짜 형식 파싱 (25.12.29 05:16:29 → Date)
 * @param dateStr - 팬더티비 형식 날짜 문자열
 * @returns Date 객체 또는 null
 */
export const parsePandaTvDate = (dateStr: string): Date | null => {
  try {
    const [datePart, timePart] = dateStr.split(' ')
    const [yy, mm, dd] = datePart.split('.')
    const year = parseInt(yy, 10) + 2000
    const month = parseInt(mm, 10) - 1
    const day = parseInt(dd, 10)

    if (timePart) {
      const [hh, mi, ss] = timePart.split(':')
      return new Date(year, month, day, parseInt(hh), parseInt(mi), parseInt(ss))
    }
    return new Date(year, month, day)
  } catch {
    return null
  }
}

/**
 * 시간을 HH:MM 형식으로 포맷
 * @param dateStr - 날짜/시간 문자열 또는 Date 객체
 * @returns 포맷된 시간 문자열
 */
export const formatTime = (dateStr: string | Date): string => {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    if (isNaN(date.getTime())) {
      return ''
    }
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return ''
  }
}

/**
 * 금액을 원화 단위로 포맷 (Admin 전용)
 * @param amount - 금액 숫자
 * @returns 포맷된 금액 문자열 (예: "1.5억원", "15만원")
 */
export const formatCurrency = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`
  }
  if (amount >= 10000) {
    return `${Math.floor(amount / 10000).toLocaleString()}만원`
  }
  return `${amount.toLocaleString()}원`
}

/**
 * 금액을 단위 없이 축약 형식으로 포맷
 * @param amount - 금액 숫자
 * @returns 포맷된 금액 문자열 (예: "1.5억", "15만")
 */
export const formatAmountShort = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`
  }
  if (amount >= 10000) {
    return `${Math.floor(amount / 10000).toLocaleString()}만`
  }
  return amount.toLocaleString('ko-KR')
}
