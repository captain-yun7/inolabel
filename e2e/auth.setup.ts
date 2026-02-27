import { test as setup, expect } from '@playwright/test'

const USER_FILE = '.auth/user.json'
const ADMIN_FILE = '.auth/admin.json'

setup('일반 사용자 로그인 세션 저장', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    console.warn('TEST_USER_EMAIL / TEST_USER_PASSWORD 환경변수가 설정되지 않았습니다. 스킵합니다.')
    // 빈 세션 파일 생성 (의존 프로젝트 실행 허용)
    await page.context().storageState({ path: USER_FILE })
    return
  }

  await page.goto('/login')
  await page.getByLabel('이메일 / 아이디').fill(email)
  await page.getByLabel('비밀번호').fill(password)
  await page.getByRole('button', { name: '로그인' }).click()

  // 로그인 성공 후 홈으로 리다이렉트 대기
  await expect(page).toHaveURL('/', { timeout: 15000 })

  await page.context().storageState({ path: USER_FILE })
})

setup('관리자 로그인 세션 저장', async ({ page }) => {
  const email = process.env.TEST_ADMIN_EMAIL
  const password = process.env.TEST_ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD 환경변수가 설정되지 않았습니다. 스킵합니다.')
    await page.context().storageState({ path: ADMIN_FILE })
    return
  }

  await page.goto('/login')
  await page.getByLabel('이메일 / 아이디').fill(email)
  await page.getByLabel('비밀번호').fill(password)
  await page.getByRole('button', { name: '로그인' }).click()

  await expect(page).toHaveURL('/', { timeout: 15000 })

  await page.context().storageState({ path: ADMIN_FILE })
})
