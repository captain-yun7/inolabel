/**
 * 글로벌 에러 핸들러
 * 
 * API 라우트, 서버 컴포넌트 등에서 발생하는 에러를 일관되게 처리합니다.
 */

import { logger } from './logger'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context
    
    // Error 클래스 확장 시 프로토타입 체인 유지
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 일반적인 에러 타입들
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource}을(를) 찾을 수 없습니다.`, 404, true, { resource })
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '로그인이 필요합니다.') {
    super(message, 401, true)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '접근 권한이 없습니다.') {
    super(message, 403, true)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, fields?: Record<string, string>) {
    super(message, 400, true, { fields })
  }
}

export class DatabaseError extends AppError {
  constructor(operation: string, originalError?: unknown) {
    super(`데이터베이스 오류가 발생했습니다.`, 500, false, {
      operation,
      originalError: originalError instanceof Error ? originalError.message : String(originalError),
    })
  }
}

/**
 * API 응답 에러 형식
 */
export interface ErrorResponse {
  error: {
    message: string
    code?: string
    details?: Record<string, unknown>
  }
}

/**
 * 에러를 API 응답 형식으로 변환
 */
export function formatErrorResponse(error: unknown): {
  body: ErrorResponse
  status: number
} {
  // AppError 인스턴스인 경우
  if (error instanceof AppError) {
    return {
      body: {
        error: {
          message: error.message,
          code: error.constructor.name,
          details: error.context,
        },
      },
      status: error.statusCode,
    }
  }

  // Supabase 에러
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const supabaseError = error as { code: string; message: string }
    return {
      body: {
        error: {
          message: supabaseError.message || '데이터베이스 오류',
          code: supabaseError.code,
        },
      },
      status: 500,
    }
  }

  // 일반 Error
  if (error instanceof Error) {
    return {
      body: {
        error: {
          message: process.env.NODE_ENV === 'development' 
            ? error.message 
            : '서버 오류가 발생했습니다.',
          code: 'INTERNAL_ERROR',
        },
      },
      status: 500,
    }
  }

  // 알 수 없는 에러
  return {
    body: {
      error: {
        message: '알 수 없는 오류가 발생했습니다.',
        code: 'UNKNOWN_ERROR',
      },
    },
    status: 500,
  }
}

/**
 * API 라우트 에러 핸들러 래퍼
 */
export function withErrorHandler<T extends (...args: Parameters<T>) => Promise<Response>>(
  handler: T,
  options?: {
    logPrefix?: string
  }
): T {
  return (async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (error) {
      const { body, status } = formatErrorResponse(error)
      
      // 로깅
      if (error instanceof AppError && error.isOperational) {
        logger.warn(`${options?.logPrefix || 'API'} Error: ${error.message}`, {
          context: error.context,
        })
      } else {
        logger.error(`${options?.logPrefix || 'API'} Error`, error)
      }

      return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }) as T
}

/**
 * async 함수 에러 래퍼
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  options?: {
    fallback?: T
    logPrefix?: string
    rethrow?: boolean
  }
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    logger.error(`${options?.logPrefix || 'Function'} Error`, error)
    
    if (options?.rethrow) {
      throw error
    }
    
    return options?.fallback
  }
}
