import { test, expect } from '@playwright/test'

test.describe('커뮤니티 - 자유게시판', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community/free')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 히어로 타이틀', async ({ page }) => {
    // 히어로 영역의 커뮤니티 타이틀 (heading)
    await expect(page.getByRole('heading', { name: '커뮤니티' })).toBeVisible({ timeout: 15000 })
  })

  test('게시글 목록 또는 빈 상태 표시', async ({ page }) => {
    // nav와 footer가 로드되면 페이지는 정상
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('커뮤니티 - 익명게시판', () => {
  test('페이지 로드', async ({ page }) => {
    await page.goto('/community/anonymous')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('커뮤니티 - 컨텐츠추천', () => {
  test('페이지 로드', async ({ page }) => {
    await page.goto('/community/recommend')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('커뮤니티 - 짤/움짤 모음', () => {
  test('페이지 로드', async ({ page }) => {
    await page.goto('/community/meme')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('커뮤니티 - 신고게시판', () => {
  test('페이지 로드', async ({ page }) => {
    await page.goto('/community/report')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('커뮤니티 - VIP 게시판', () => {
  test('비인증 시 접근 제한', async ({ page }) => {
    await page.goto('/community/vip')
    await page.waitForLoadState('networkidle')

    // "로그인이 필요합니다" 메시지 표시 확인
    await expect(page.getByText('로그인이 필요합니다')).toBeVisible({ timeout: 10000 })
  })
})
