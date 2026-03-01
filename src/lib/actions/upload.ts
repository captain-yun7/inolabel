'use server'

import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'inolable-images'
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

/** 인증 확인 헬퍼 */
async function requireAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('로그인이 필요합니다')
  return user
}

/** R2 설정 확인 */
function checkR2Config() {
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('서버 설정 오류: 이미지 업로드 서비스가 구성되지 않았습니다.')
  }
}

/**
 * 서버 액션: 이미지 업로드 (소용량, ~5MB 이하)
 */
export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  try {
    checkR2Config()
    await requireAuth()

    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) return { error: '파일이 없습니다' }
    if (!file.type.startsWith('image/')) return { error: '이미지 파일만 업로드 가능합니다' }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const key = `${folder}/${filename}`

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    return { url: `${R2_PUBLIC_URL}/${key}` }
  } catch (error) {
    console.error('Upload server action error:', error)
    const msg = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다'
    return { error: msg }
  }
}

/**
 * 멀티파트 업로드 시작 (대용량 파일용, ~5MB 이상)
 */
export async function startMultipartUpload(
  folder: string,
  filename: string,
  contentType: string
): Promise<{ uploadId?: string; key?: string; error?: string }> {
  try {
    checkR2Config()
    await requireAuth()

    if (!contentType.startsWith('image/')) return { error: '이미지 파일만 업로드 가능합니다' }

    const ext = filename.split('.').pop() || 'jpg'
    const key = `${folder}/${randomUUID()}.${ext}`

    const { UploadId } = await r2Client.send(new CreateMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }))

    if (!UploadId) return { error: '멀티파트 업로드 시작 실패' }

    return { uploadId: UploadId, key }
  } catch (error) {
    console.error('Start multipart upload error:', error)
    const msg = error instanceof Error ? error.message : '업로드 시작에 실패했습니다'
    return { error: msg }
  }
}

/**
 * 멀티파트 업로드 파트 전송
 */
export async function uploadPart(
  formData: FormData
): Promise<{ eTag?: string; error?: string }> {
  try {
    checkR2Config()
    await requireAuth()

    const uploadId = formData.get('uploadId') as string
    const key = formData.get('key') as string
    const partNumber = Number(formData.get('partNumber'))
    const chunk = formData.get('chunk') as File

    if (!uploadId || !key || !partNumber || !chunk) {
      return { error: '필수 파라미터가 누락되었습니다' }
    }

    const bytes = await chunk.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { ETag } = await r2Client.send(new UploadPartCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: buffer,
    }))

    return { eTag: ETag }
  } catch (error) {
    console.error('Upload part error:', error)
    const msg = error instanceof Error ? error.message : '파트 업로드에 실패했습니다'
    return { error: msg }
  }
}

/**
 * 멀티파트 업로드 완료
 */
export async function completeMultipartUpload(
  uploadId: string,
  key: string,
  parts: { partNumber: number; eTag: string }[]
): Promise<{ url?: string; error?: string }> {
  try {
    checkR2Config()
    await requireAuth()

    await r2Client.send(new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map(p => ({
          PartNumber: p.partNumber,
          ETag: p.eTag,
        })),
      },
    }))

    return { url: `${R2_PUBLIC_URL}/${key}` }
  } catch (error) {
    console.error('Complete multipart upload error:', error)
    const msg = error instanceof Error ? error.message : '업로드 완료에 실패했습니다'
    return { error: msg }
  }
}

/**
 * 멀티파트 업로드 취소 (에러 시 정리)
 */
export async function abortMultipartUpload(
  uploadId: string,
  key: string
): Promise<{ error?: string }> {
  try {
    checkR2Config()

    await r2Client.send(new AbortMultipartUploadCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    }))

    return {}
  } catch (error) {
    console.error('Abort multipart upload error:', error)
    return { error: '업로드 취소에 실패했습니다' }
  }
}
