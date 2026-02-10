/**
 * Supabase Error Utilities
 *
 * RLS 에러 및 Supabase 관련 에러 메시지를 사용자 친화적으로 변환
 */

import type { PostgrestError } from '@supabase/supabase-js'

export type CRUDAction = '등록' | '수정' | '삭제' | '조회'

/**
 * RLS 에러 메시지를 사용자 친화적으로 변환
 */
export function getRLSErrorMessage(error: PostgrestError, action: CRUDAction): string {
  const code = error.code
  const message = error.message?.toLowerCase() || ''

  // RLS 정책 위반
  if (code === '42501' || message.includes('permission denied') || message.includes('policy')) {
    return `${action} 권한이 없습니다. 관리자 계정으로 로그인했는지 확인하세요.\n\n(RLS 정책이 설정되지 않았을 수 있습니다. Supabase에서 scripts/supabase-setup.sql 실행 필요)`
  }

  // 함수 없음
  if (code === '42883' || (message.includes('function') && message.includes('does not exist'))) {
    return `필요한 함수가 없습니다. Supabase에서 scripts/supabase-setup.sql을 실행해주세요.`
  }

  // FK 제약 위반
  if (code === '23503' || message.includes('foreign key')) {
    return `${action} 실패: 연결된 데이터가 존재합니다. 먼저 관련 데이터를 삭제해주세요.`
  }

  // Unique 제약 위반
  if (code === '23505' || message.includes('unique') || message.includes('duplicate')) {
    return `${action} 실패: 이미 존재하는 데이터입니다.`
  }

  // 인증 필요
  if (message.includes('jwt') || message.includes('auth')) {
    return `로그인이 필요합니다. 다시 로그인해주세요.`
  }

  // 연결 오류
  if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
    return `네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.`
  }

  // 기본 메시지
  return `${action}에 실패했습니다: ${error.message}`
}

/**
 * 에러가 RLS 관련인지 확인
 */
export function isRLSError(error: PostgrestError): boolean {
  const code = error.code
  const message = error.message?.toLowerCase() || ''

  return code === '42501' ||
         message.includes('permission denied') ||
         message.includes('policy')
}

/**
 * 에러가 인증 관련인지 확인
 */
export function isAuthError(error: PostgrestError): boolean {
  const message = error.message?.toLowerCase() || ''
  return message.includes('jwt') || message.includes('auth')
}
