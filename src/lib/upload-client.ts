/**
 * 클라이언트용 이미지 업로드 유틸리티
 * - 5MB 이하: 서버 액션으로 직접 업로드
 * - 5MB 초과: R2 멀티파트 업로드 (청크 분할, Vercel body size 제한 우회)
 */
import {
  uploadImageAction,
  startMultipartUpload,
  uploadPart,
  completeMultipartUpload,
  abortMultipartUpload,
} from '@/lib/actions/upload'

const MULTIPART_THRESHOLD = 5 * 1024 * 1024 // 5MB
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

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
  if (file.size <= MULTIPART_THRESHOLD) {
    return uploadImageAction(formData)
  }

  // 대용량: 멀티파트 업로드
  const initResult = await startMultipartUpload(folder, file.name, file.type)
  if (initResult.error || !initResult.uploadId || !initResult.key) {
    return { error: initResult.error || '업로드 시작 실패' }
  }

  const { uploadId, key } = initResult
  const totalParts = Math.ceil(file.size / CHUNK_SIZE)
  const parts: { partNumber: number; eTag: string }[] = []

  try {
    for (let i = 0; i < totalParts; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      const partFormData = new FormData()
      partFormData.append('uploadId', uploadId)
      partFormData.append('key', key)
      partFormData.append('partNumber', String(i + 1))
      partFormData.append('chunk', chunk)

      const partResult = await uploadPart(partFormData)
      if (partResult.error || !partResult.eTag) {
        throw new Error(partResult.error || `파트 ${i + 1} 업로드 실패`)
      }

      parts.push({ partNumber: i + 1, eTag: partResult.eTag })
    }

    return completeMultipartUpload(uploadId, key, parts)
  } catch (error) {
    await abortMultipartUpload(uploadId, key)
    const msg = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다'
    return { error: msg }
  }
}
