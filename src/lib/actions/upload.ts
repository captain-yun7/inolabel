'use server'

import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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
 * 서버 액션: 이미지 업로드 (소용량, ~4MB 이하)
 * Vercel body size 제한 내에서 서버 액션으로 직접 처리
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
 * 서버 액션: Presigned URL 생성 (대용량 파일용, ~4MB 이상)
 * 클라이언트가 이 URL로 R2에 직접 PUT 업로드 → Vercel body 제한 우회
 */
export async function getPresignedUploadUrl(
  folder: string,
  filename: string,
  contentType: string
): Promise<{ presignedUrl?: string; key?: string; publicUrl?: string; error?: string }> {
  try {
    checkR2Config()
    await requireAuth()

    if (!contentType.startsWith('image/')) return { error: '이미지 파일만 업로드 가능합니다' }

    const ext = filename.split('.').pop() || 'jpg'
    const key = `${folder}/${randomUUID()}.${ext}`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 })

    return {
      presignedUrl,
      key,
      publicUrl: `${R2_PUBLIC_URL}/${key}`,
    }
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    const msg = error instanceof Error ? error.message : 'URL 생성에 실패했습니다'
    return { error: msg }
  }
}
