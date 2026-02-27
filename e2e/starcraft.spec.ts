import { test, expect } from '@playwright/test'

test.describe('스타크래프트 티어표', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/starcraft/tier')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 타이틀', async ({ page }) => {
    await expect(page.getByText('스타크래프트 티어표')).toBeVisible({ timeout: 15000 })
  })

  test('서브타이틀 표시', async ({ page }) => {
    await expect(page.getByText('SOOP 스타크래프트 스트리머 티어 랭킹')).toBeVisible({ timeout: 15000 })
  })

  test('티어 순서 표시', async ({ page }) => {
    // "갓 > 킹 > 잭 > 스페이드 > 0 ~ 8 > 유스" 텍스트
    await expect(page.getByText(/갓/).first()).toBeVisible({ timeout: 15000 })
  })

  test('TierBoard 컴포넌트 렌더링', async ({ page }) => {
    const content = page.locator('[class*="content"]').first()
    await expect(content).toBeVisible({ timeout: 15000 })
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('footer').first()).toBeVisible()
  })
})
