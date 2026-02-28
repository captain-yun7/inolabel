'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
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

/**
 * 서버 액션: 이미지 업로드
 * - R2 CORS 문제 우회 (서버→R2 직접 업로드)
 * - bodySizeLimit: '100mb' 설정으로 대용량 GIF 지원
 */
export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  try {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      return { error: '서버 설정 오류: 이미지 업로드 서비스가 구성되지 않았습니다.' }
    }

    // 인증 확인
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: '로그인이 필요합니다' }
    }

    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return { error: '파일이 없습니다' }
    }

    if (!file.type.startsWith('image/')) {
      return { error: '이미지 파일만 업로드 가능합니다' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const key = `${folder}/${filename}`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })

    await r2Client.send(command)

    const publicUrl = `${R2_PUBLIC_URL}/${key}`

    return { url: publicUrl }
  } catch (error) {
    console.error('Upload server action error:', error)
    return { error: '이미지 업로드에 실패했습니다' }
  }
}
