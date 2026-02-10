/**
 * Tailwind CSS 클래스 병합 유틸리티
 * shadcn/ui 컴포넌트에서 사용
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 여러 클래스 값을 병합하고 Tailwind 충돌을 해결
 * @param inputs - 클래스 값들 (문자열, 배열, 객체 등)
 * @returns 병합된 클래스 문자열
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
