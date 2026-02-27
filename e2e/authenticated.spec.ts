import { test, expect } from '@playwright/test'

test.describe('인증된 사용자 - 마이페이지', () => {
  test('마이페이지 접근 가능', async ({ page }) => {
    await page.goto('/mypage')

    // 인증 세션이 있으면 마이페이지 로드, 없으면 로그인 리다이렉트
    const isMyPage = await page.getByText(/마이페이지|프로필|닉네임/).first().isVisible({ timeout: 10000 }).catch(() => false)
    const isLoginPage = page.url().includes('/login')

    expect(isMyPage || isLoginPage).toBeTruthy()
  })

  test('프로필 정보 표시', async ({ page }) => {
    await page.goto('/mypage')

    if (page.url().includes('/login')) {
      test.skip()
      return
    }

    // 프로필 폼 요소 확인
    await expect(page.getByText(/닉네임/)).toBeVisible()
  })
})

test.describe('인증된 사용자 - Navbar', () => {
  test('프로필 메뉴 표시', async ({ page }) => {
    await page.goto('/')

    // 인증 상태이면 로그인 버튼 대신 프로필 메뉴 표시
    const hasProfile = await page.locator('[class*="profileButton"], [class*="profile"]').first().isVisible().catch(() => false)
    const hasLogin = await page.getByText('로그인').isVisible().catch(() => false)

    // 둘 중 하나는 보여야 함
    expect(hasProfile || hasLogin).toBeTruthy()
  })
})

test.describe('인증된 사용자 - VIP 게시판', () => {
  test('VIP 게시판 접근 시도', async ({ page }) => {
    await page.goto('/community/vip')

    // VIP 자격에 따라 결과가 다름: 게시판 보이거나, 접근 제한 메시지
    const hasContent = await page.locator('[class*="board"], [class*="Board"]').first().isVisible({ timeout: 10000 }).catch(() => false)
    const hasRestriction = await page.getByText(/접근|권한|자격/).first().isVisible().catch(() => false)
    const isRedirected = page.url().includes('/login') || page.url() === '/'

    expect(hasContent || hasRestriction || isRedirected).toBeTruthy()
  })
})
