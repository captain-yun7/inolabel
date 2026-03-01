/**
 * R2 버킷 CORS 규칙 설정 스크립트
 * 브라우저에서 presigned URL로 직접 업로드할 수 있도록 CORS 허용
 *
 * 사용법: npx tsx scripts/setup-r2-cors.ts
 */
import { getServiceClient } from './lib/supabase'
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'inolable-images'

async function main() {
  console.log(`\n🪣 R2 버킷: ${BUCKET_NAME}`)
  console.log('📋 CORS 규칙 설정 중...\n')

  const corsRules = {
    CORSRules: [
      {
        AllowedOrigins: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
        AllowedHeaders: ['*'],
        ExposeHeaders: ['ETag', 'Content-Length'],
        MaxAgeSeconds: 3600,
      },
    ],
  }

  try {
    await r2Client.send(
      new PutBucketCorsCommand({
        Bucket: BUCKET_NAME,
        CORSConfiguration: corsRules,
      })
    )
    console.log('✅ CORS 규칙 설정 완료!')

    // 확인
    const { CORSRules } = await r2Client.send(
      new GetBucketCorsCommand({ Bucket: BUCKET_NAME })
    )
    console.log('\n📋 현재 CORS 규칙:')
    console.log(JSON.stringify(CORSRules, null, 2))
  } catch (error) {
    console.error('❌ CORS 설정 실패:', error)
  }
}

main()
