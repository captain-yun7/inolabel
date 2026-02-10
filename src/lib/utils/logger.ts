/**
 * 프로덕션 로깅 유틸리티
 *
 * 개발 환경에서만 콘솔에 출력하고,
 * 프로덕션에서는 에러 트래킹 서비스로 전송합니다.
 * 
 * Sentry 연동 준비:
 * 1. npm install @sentry/nextjs
 * 2. npx @sentry/wizard@latest -i nextjs
 * 3. SENTRY_DSN 환경변수 설정
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  /** 에러 컨텍스트 정보 */
  context?: Record<string, unknown>
  /** 사용자 ID (선택) */
  userId?: string
  /** 태그 (선택) */
  tags?: string[]
}

interface ErrorTracker {
  captureException: (error: unknown, options?: {
    extra?: Record<string, unknown>
    user?: { id: string }
    tags?: Record<string, string>
  }) => void
  captureMessage: (message: string, level?: 'info' | 'warning' | 'error') => void
}

// 에러 트래킹 서비스 인스턴스 (Sentry 등)
let errorTracker: ErrorTracker | null = null

/**
 * 에러 트래킹 서비스 초기화
 * Sentry 등 외부 서비스 연동 시 호출
 */
export function initErrorTracker(tracker: ErrorTracker) {
  errorTracker = tracker
}

/**
 * 로그 레벨별 출력 여부
 * 프로덕션에서는 error만 트래킹 서비스로 전송
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * 프로덕션 안전 로거
 */
export const logger = {
  /**
   * 디버그 로그 (개발 환경에서만 출력)
   */
  debug(message: string, options?: LoggerOptions) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, options?.context || '')
    }
  },

  /**
   * 정보 로그 (개발 환경에서만 출력)
   */
  info(message: string, options?: LoggerOptions) {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, options?.context || '')
    }
  },

  /**
   * 경고 로그 (개발 환경에서만 출력)
   */
  warn(message: string, options?: LoggerOptions) {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, options?.context || '')
    }
  },

  /**
   * 에러 로그
   * - 개발: 콘솔 출력
   * - 프로덕션: 에러 트래킹 서비스로 전송
   */
  error(message: string, error?: unknown, options?: LoggerOptions) {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error, options?.context || '')
    }

    if (isProduction && errorTracker) {
      errorTracker.captureException(error || new Error(message), {
        extra: {
          message,
          ...options?.context,
        },
        user: options?.userId ? { id: options.userId } : undefined,
        tags: options?.tags?.reduce((acc, tag) => ({ ...acc, [tag]: 'true' }), {} as Record<string, string>),
      })
    }
  },

  /**
   * API 에러 로그
   * API 라우트에서 발생한 에러를 기록합니다.
   */
  apiError(endpoint: string, error: unknown, options?: LoggerOptions) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    this.error(`API Error [${endpoint}]: ${errorMessage}`, error, {
      ...options,
      context: {
        ...options?.context,
        endpoint,
      },
    })
  },

  /**
   * 데이터베이스 에러 로그
   */
  dbError(operation: string, table: string, error: unknown, options?: LoggerOptions) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    this.error(`DB Error [${table}/${operation}]: ${errorMessage}`, error, {
      ...options,
      context: {
        ...options?.context,
        operation,
        table,
      },
    })
  },
}

/**
 * 콘솔 출력을 환경별로 제어하는 유틸리티
 */
export const safeConsole = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) console.error(...args)
  },
}

export default logger
