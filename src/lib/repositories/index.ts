/**
 * Repository Factory - Clean Architecture
 *
 * 데이터 접근 계층 추상화
 * - USE_MOCK_DATA=true → MockDataProvider
 * - USE_MOCK_DATA=false → SupabaseDataProvider
 *
 * SOLID Principles Applied:
 * - S: 각 Repository는 단일 도메인 책임
 * - O: 새 Provider 추가 시 기존 코드 수정 불필요
 * - L: 모든 Provider는 IDataProvider 인터페이스 준수
 * - I: 필요한 Repository만 사용
 * - D: 추상화(Interface)에 의존
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { USE_MOCK_DATA } from '@/lib/config'
import { IDataProvider, DataProviderType } from './types'
import { mockDataProvider } from './mock'
import { SupabaseDataProvider } from './supabase'

// Re-export types
export * from './types'
export { MockDataProvider } from './mock'
export { SupabaseDataProvider } from './supabase'

/**
 * Create DataProvider based on environment configuration
 *
 * @example
 * // In component or hook
 * const provider = createDataProvider(supabase)
 * const rankings = await provider.rankings.getRankings({})
 */
export function createDataProvider(
  supabase?: SupabaseClient,
  forceType?: DataProviderType
): IDataProvider {
  const providerType = forceType ?? (USE_MOCK_DATA ? 'mock' : 'supabase')

  switch (providerType) {
    case 'mock':
      return mockDataProvider

    case 'supabase':
      if (!supabase) {
        throw new Error('Supabase client is required for supabase provider')
      }
      return new SupabaseDataProvider(supabase)

    default:
      throw new Error(`Unknown provider type: ${providerType}`)
  }
}

/**
 * Get Mock DataProvider instance (singleton)
 * 테스트나 개발 환경에서 직접 사용
 */
export function getMockProvider(): IDataProvider {
  return mockDataProvider
}
