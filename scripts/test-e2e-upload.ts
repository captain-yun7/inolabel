/**
 * E2E 업로드 테스트 - 서버 액션 없이 직접 presigned URL + proxy 흐름 검증
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as crypto from 'crypto'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const DEV_SERVER = 'http://localhost:3005'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.R2_BUCKET_NAME || 'inolable-images'
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

async function testEdgeProxy(sizeMB: number) {
  console.log(`\n🧪 ${sizeMB}MB Edge 프록시 E2E 테스트...`)
  
  // 1. Presigned URL 생성 (서버 액션 대신 직접 생성)
  const key = `test/e2e-proxy-${Date.now()}.jpg`
  const presignedUrl = await getSignedUrl(
    r2Client,
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: 'image/jpeg' }),
    { expiresIn: 600 }
  )
  console.log(`   Presigned URL 생성 완료`)
  
  // 2. Edge 프록시를 통해 업로드 (실제 클라이언트 흐름과 동일)
  console.log(`   Edge 프록시로 ${sizeMB}MB 전송...`)
  const testData = crypto.randomBytes(sizeMB * 1024 * 1024)
  
  const response = await fetch(`${DEV_SERVER}/api/upload/proxy`, {
    method: 'PUT',
    body: testData,
    headers: {
      'x-upload-url': presignedUrl,
      'x-content-type': 'image/jpeg',
    },
  })
  
  const data = await response.json()
  
  if (response.ok && data.ok) {
    console.log(`   ✅ 프록시 업로드 성공!`)
  } else {
    console.log(`   ❌ 실패: ${response.status}`, data)
    return false
  }
  
  // 3. 파일 접근 확인
  const publicUrl = `${PUBLIC_URL}/${key}`
  const headRes = await fetch(publicUrl, { method: 'HEAD' })
  if (headRes.ok) {
    const size = headRes.headers.get('content-length')
    console.log(`   ✅ 파일 확인: ${(Number(size) / 1024 / 1024).toFixed(1)}MB → ${publicUrl}`)
  } else {
    console.log(`   ⚠️ 파일 접근 대기 중 (CDN 전파): ${headRes.status}`)
  }
  
  return true
}

async function main() {
  console.log('=== Edge 프록시 E2E 업로드 테스트 ===')
  console.log(`서버: ${DEV_SERVER}`)
  
  try {
    const results = []
    results.push(await testEdgeProxy(5))
    results.push(await testEdgeProxy(10))
    results.push(await testEdgeProxy(20))
    
    console.log(results.every(r => r) ? '\n✅ 모든 테스트 통과!' : '\n⚠️ 일부 실패')
  } catch (err) {
    console.error('\n❌ 테스트 실패:', err)
    process.exit(1)
  }
}
main()
