/**
 * 클라이언트용 이미지 업로드 유틸리티
 * - 4MB 이하: 서버 액션으로 직접 업로드
 * - 4MB 초과: Presigned URL로 브라우저에서 R2 직접 업로드 (Vercel 우회)
 */
import {
  uploadImageAction,
  getPresignedUploadUrl,
} from '@/lib/actions/upload'

const PRESIGNED_THRESHOLD = 4 * 1024 * 1024 // 4MB

/**
 * 이미지 업로드 (파일 크기에 따라 자동 분기)
 * uploadImageAction과 동일한 인터페이스
 */
export async function uploadImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || 'general'

  if (!file) return { error: '파일이 없습니다' }

  // 소용량: 서버 액션 직접 호출
  if (file.size <= PRESIGNED_THRESHOLD) {
    return uploadImageAction(formData)
  }

  // 대용량: Presigned URL로 브라우저에서 R2 직접 업로드
  try {
    // 1. 서버 액션으로 presigned URL 생성 (작은 요청)
    const urlResult = await getPresignedUploadUrl(folder, file.name, file.type)
    if (urlResult.error || !urlResult.presignedUrl || !urlResult.publicUrl) {
      return { error: urlResult.error || '업로드 URL 생성 실패' }
    }

    // 2. 브라우저에서 R2에 직접 PUT (Vercel 경유 안 함, CORS로 허용)
    const response = await fetch(urlResult.presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      return { error: `업로드 실패 (${response.status}): ${errorText}` }
    }

    return { url: urlResult.publicUrl }
  } catch (error) {
    const msg = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다'
    return { error: msg }
  }
}
