import { test, expect } from '@playwright/test'

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // 클라이언트 렌더링 대기
    await page.waitForLoadState('networkidle')
  })

  test('페이지 타이틀 확인', async ({ page }) => {
    await expect(page).toHaveTitle(/INOLABEL/)
  })

  test('Navbar 존재 및 주요 메뉴 확인', async ({ page }) => {
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()

    // 주요 메뉴 버튼/링크 (nav 스코프 내에서 검색)
    await expect(nav.getByText('이노레이블', { exact: true })).toBeVisible()
    await expect(nav.getByText('스타크래프트', { exact: true })).toBeVisible()
    await expect(nav.getByText('커뮤니티', { exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: '타임라인' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '시그목록' })).toBeVisible()
  })

  test('Hero 섹션 표시', async ({ page }) => {
    const hero = page.locator('[class*="hero"]').first()
    await expect(hero).toBeVisible()
  })

  test('LIVE NOW / 실시간 멤버 섹션 표시', async ({ page }) => {
    await expect(page.getByText('LIVE NOW')).toBeVisible()
    await expect(page.getByText('실시간 멤버')).toBeVisible()
  })

  test('자유게시판 인기글 프리뷰 섹션 표시', async ({ page }) => {
    // 인기글 섹션 헤더
    await expect(page.getByText('자유게시판 인기글')).toBeVisible({ timeout: 15000 })
    // 커뮤니티 프리뷰의 전체보기 링크 (href=/community/free)
    await expect(page.locator('a[href="/community/free"]', { hasText: '전체보기' })).toBeVisible()
  })

  test('Footer 존재', async ({ page }) => {
    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()
  })

  test('로고 클릭 시 홈 이동', async ({ page }) => {
    await page.goto('/live')
    await page.waitForLoadState('networkidle')
    // nav 내부 로고 링크 클릭
    await page.locator('nav a[href="/"]').first().click()
    await expect(page).toHaveURL('/')
  })

  test('비인증 상태에서 로그인 버튼 표시', async ({ page }) => {
    await expect(page.getByText('로그인')).toBeVisible()
  })
})
