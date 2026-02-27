import { test, expect } from '@playwright/test'

test.describe('데스크톱 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('이노레이블 드롭다운 메뉴', async ({ page }) => {
    const nav = page.locator('nav')
    const menuButton = nav.getByText('이노레이블', { exact: true })
    await menuButton.hover()

    // 드롭다운 항목 확인 (nav 내부에서 검색)
    await expect(nav.getByText('라이브', { exact: true })).toBeVisible()
    await expect(nav.getByText('조직도', { exact: true })).toBeVisible()
  })

  test('스타크래프트 드롭다운 메뉴', async ({ page }) => {
    const nav = page.locator('nav')
    const menuButton = nav.getByText('스타크래프트', { exact: true })
    await menuButton.hover()

    await expect(nav.getByText('티어표', { exact: true })).toBeVisible()
  })

  test('커뮤니티 드롭다운 메뉴', async ({ page }) => {
    const nav = page.locator('nav')
    const menuButton = nav.getByText('커뮤니티', { exact: true })
    await menuButton.hover()

    // 드롭다운 내 항목들 (nav 스코프)
    await expect(nav.getByRole('link', { name: /자유게시판/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /익명게시판/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /컨텐츠추천/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /짤, 움짤 모음/ })).toBeVisible()
    await expect(nav.getByRole('link', { name: /신고게시판/ })).toBeVisible()
  })

  test('타임라인 직접 링크 이동', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: '타임라인' }).click()
    await expect(page).toHaveURL('/rg/history')
  })

  test('시그목록 직접 링크 이동', async ({ page }) => {
    await page.locator('nav').getByRole('link', { name: '시그목록' }).click()
    await expect(page).toHaveURL('/rg/sig')
  })

  test('드롭다운에서 라이브 페이지 이동', async ({ page }) => {
    const nav = page.locator('nav')
    await nav.getByText('이노레이블', { exact: true }).hover()
    await nav.getByRole('link', { name: /라이브/ }).click()
    await expect(page).toHaveURL('/rg/live')
  })

  test('드롭다운에서 자유게시판 이동', async ({ page }) => {
    const nav = page.locator('nav')
    await nav.getByText('커뮤니티', { exact: true }).hover()
    await nav.getByRole('link', { name: /자유게시판/ }).click()
    await expect(page).toHaveURL('/community/free')
  })
})

test.describe('모바일 네비게이션', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('햄버거 메뉴 토글', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 햄버거 메뉴 버튼 - nav 안의 button 중 hamburger span을 포함하는 것
    const hamburger = page.locator('nav button[class*="mobile"]').first()
    await expect(hamburger).toBeVisible({ timeout: 10000 })
    await hamburger.click()

    // 모바일 메뉴 열림 확인 - 메뉴 항목이 보이는지
    await expect(page.getByText('이노레이블', { exact: true }).last()).toBeVisible()
  })

  test('모바일 메뉴에서 로그인 버튼', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hamburger = page.locator('nav button[class*="mobile"]').first()
    await hamburger.click()

    await expect(page.getByText('로그인').last()).toBeVisible()
  })
})
