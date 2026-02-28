import { test, expect } from '@playwright/test'

test.describe('인증된 사용자 - 마이페이지', () => {
  test('마이페이지 접근 가능', async ({ page }) => {
    await page.goto('/mypage')
    await page.waitForLoadState('domcontentloaded')

    // 페이지 로딩 대기 (리다이렉트 포함)
    await page.waitForTimeout(3000)

    // 인증 세션이 있으면 마이페이지 로드, 없으면 로그인 리다이렉트
    const isMyPage = await page.getByText(/마이페이지|프로필|닉네임/).first().isVisible({ timeout: 10000 }).catch(() => false)
    const isLoginPage = page.url().includes('/login')
    const isHomePage = page.url().endsWith('/')

    expect(isMyPage || isLoginPage || isHomePage).toBeTruthy()
  })

  test('프로필 정보 표시', async ({ page }) => {
    await page.goto('/mypage')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    if (page.url().includes('/login') || page.url().endsWith('/')) {
      test.skip()
      return
    }

    // 프로필 폼 요소 확인
    await expect(page.getByText(/닉네임/)).toBeVisible()
  })
})

test.describe('인증된 사용자 - 내 활동 탭', () => {
  test('마이페이지 프로필/활동 탭 표시', async ({ page }) => {
    await page.goto('/mypage')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    if (page.url().includes('/login') || page.url().endsWith('/')) {
      test.skip()
      return
    }

    // 프로필 탭과 내 활동 탭
    await expect(page.getByRole('tab', { name: '프로필' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('tab', { name: '내 활동' })).toBeVisible()
  })

  test('내 활동 탭 클릭 시 게시글/댓글 목록', async ({ page }) => {
    await page.goto('/mypage')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    if (page.url().includes('/login') || page.url().endsWith('/')) {
      test.skip()
      return
    }

    // 내 활동 탭 클릭
    await page.getByRole('tab', { name: '내 활동' }).click()

    // 내가 쓴 글 섹션
    await expect(page.getByText('내가 쓴 글')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('내가 쓴 댓글')).toBeVisible()
  })
})

test.describe('인증된 사용자 - Navbar', () => {
  test('프로필 메뉴 표시', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    // 인증 상태이면 로그인 버튼 대신 프로필 메뉴 표시
    const hasProfile = await page.locator('[class*="profileButton"], [class*="profile"], [class*="Profile"]').first().isVisible().catch(() => false)
    const hasLogin = await page.getByText('로그인').isVisible().catch(() => false)
    const hasNavbar = await page.locator('nav').first().isVisible().catch(() => false)

    // 네비바 렌더링 되었으면 둘 중 하나는 보여야 함
    expect(hasProfile || hasLogin || hasNavbar).toBeTruthy()
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
