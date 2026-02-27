import { test, expect } from '@playwright/test'

test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 폼 요소 확인', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()
    await expect(page.getByText('이노레이블에 오신 것을 환영합니다')).toBeVisible()

    // 폼 필드
    await expect(page.getByLabel('이메일 / 아이디')).toBeVisible()
    await expect(page.getByLabel('비밀번호')).toBeVisible()
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()
  })

  test('빈 폼 제출 시 유효성 에러', async ({ page }) => {
    await page.getByRole('button', { name: '로그인' }).click()

    // Mantine form validation 에러 메시지
    await expect(page.getByText('이메일을 입력해주세요')).toBeVisible()
  })

  test('잘못된 자격증명으로 에러 메시지', async ({ page }) => {
    await page.getByLabel('이메일 / 아이디').fill('wrong@test.com')
    await page.getByLabel('비밀번호').fill('wrongpassword')
    await page.getByRole('button', { name: '로그인' }).click()

    // 에러 메시지 대기 (Alert 컴포넌트)
    await expect(page.getByText('이메일 또는 비밀번호가 올바르지 않습니다.').first()).toBeVisible({ timeout: 10000 })
  })

  test('회원가입 링크', async ({ page }) => {
    const signupLink = page.getByRole('link', { name: '회원가입' })
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await expect(page).toHaveURL('/signup')
  })

  test('비밀번호 찾기 링크', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: '비밀번호 찾기' })
    await expect(forgotLink).toBeVisible()
    await forgotLink.click()
    await expect(page).toHaveURL('/forgot-password')
  })

  test('정상 로그인 후 리다이렉트', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL
    const password = process.env.TEST_USER_PASSWORD

    if (!email || !password) {
      test.skip()
      return
    }

    await page.getByLabel('이메일 / 아이디').fill(email)
    await page.getByLabel('비밀번호').fill(password)
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page).toHaveURL('/', { timeout: 15000 })
  })
})

test.describe('회원가입 페이지', () => {
  test('페이지 로드', async ({ page }) => {
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: '회원가입' })).toBeVisible({ timeout: 15000 })
  })
})

test.describe('비밀번호 찾기 페이지', () => {
  test('페이지 로드', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('비밀번호').first()).toBeVisible({ timeout: 15000 })
  })
})
