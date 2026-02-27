import { test, expect } from '@playwright/test'

test.describe('공지사항 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notice')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 타이틀', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '공지사항', exact: true })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('INOLABEL 공식 공지 및 소식')).toBeVisible()
  })

  test('카테고리 탭 표시', async ({ page }) => {
    // 카테고리 탭 버튼들 확인
    await expect(page.getByRole('button', { name: '전체' }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: '공지' })).toBeVisible()
    await expect(page.getByRole('button', { name: '이벤트' })).toBeVisible()
  })

  test('검색 입력 필드 존재', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('공지 목록 또는 빈 상태 표시', async ({ page }) => {
    // 페이지가 로드되면 공지 목록, 빈 상태, 또는 로딩 상태 중 하나
    const hasContent = await page.getByText(/등록된 공지사항|공지사항을 불러오는 중/).first().isVisible({ timeout: 10000 }).catch(() => false)
    const hasRows = await page.locator('table, [class*="row"]').first().isVisible().catch(() => false)

    expect(hasContent || hasRows).toBeTruthy()
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })
})
