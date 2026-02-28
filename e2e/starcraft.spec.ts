import { test, expect } from '@playwright/test'

test.describe('스타크래프트 티어표', () => {
  // 티어 데이터 로딩이 느릴 수 있으므로 타임아웃 확장
  test.setTimeout(90000)

  test.beforeEach(async ({ page }) => {
    await page.goto('/starcraft/tier', { timeout: 60000, waitUntil: 'domcontentloaded' })
  })

  test('페이지 로드 및 타이틀', async ({ page }) => {
    await expect(page.getByText('스타크래프트 티어표')).toBeVisible({ timeout: 30000 })
  })

  test('서브타이틀 표시', async ({ page }) => {
    await expect(page.getByText('SOOP 스타크래프트 스트리머 티어 랭킹')).toBeVisible({ timeout: 30000 })
  })

  test('티어 순서 표시', async ({ page }) => {
    await expect(page.getByText(/갓/).first()).toBeVisible({ timeout: 30000 })
  })

  test('TierBoard 컴포넌트 렌더링', async ({ page }) => {
    const content = page.locator('[class*="content"]').first()
    await expect(content).toBeVisible({ timeout: 30000 })
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 30000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})
