import { test, expect } from '@playwright/test'

test.describe('라이브 방송 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rg/live')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 타이틀', async ({ page }) => {
    await expect(page.getByText('라이브 방송')).toBeVisible()
    await expect(page.getByText('이노레이블 멤버들의 실시간 방송 현황')).toBeVisible()
  })

  test('유닛 필터 버튼 존재', async ({ page }) => {
    await expect(page.locator('button[data-unit="all"]')).toBeVisible()
    await expect(page.locator('button[data-unit="excel"]')).toBeVisible()
    await expect(page.locator('button[data-unit="crew"]')).toBeVisible()
  })

  test('유닛 필터 클릭 시 active 상태 변경', async ({ page }) => {
    const excelBtn = page.locator('button[data-unit="excel"]')
    await excelBtn.click()
    await expect(excelBtn).toHaveClass(/active/)

    const crewBtn = page.locator('button[data-unit="crew"]')
    await crewBtn.click()
    await expect(crewBtn).toHaveClass(/active/)
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('조직도 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rg/org')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 타이틀', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '조직도' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('이노레이블 구성원을 소개합니다')).toBeVisible()
  })

  test('유닛 탭 전환', async ({ page }) => {
    const unitTabs = page.locator('[class*="unitTab"]')
    const tabCount = await unitTabs.count()
    expect(tabCount).toBeGreaterThanOrEqual(2)

    if (tabCount >= 2) {
      await unitTabs.nth(1).click()
      await expect(unitTabs.nth(1)).toHaveClass(/active/)
    }
  })

  test('멤버 카드 표시', async ({ page }) => {
    const cards = page.locator('[class*="grid"]').first()
    await expect(cards).toBeVisible({ timeout: 10000 })
  })
})

test.describe('타임라인 페이지', () => {
  test('페이지 로드 및 타이틀', async ({ page }) => {
    await page.goto('/rg/history')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('CHRONICLES')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: '타임라인' })).toBeVisible()
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await page.goto('/rg/history')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })
})

test.describe('시그리스트 페이지', () => {
  test('페이지 로드 및 타이틀', async ({ page }) => {
    await page.goto('/rg/sig')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('시그리스트')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('이노레이블 멤버별 시그니처 리액션 모음')).toBeVisible()
  })

  test('Navbar와 Footer 존재', async ({ page }) => {
    await page.goto('/rg/sig')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })
})
