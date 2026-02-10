import { test, expect } from '@playwright/test'

test.describe('랭킹 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ranking')
  })

  test('랭킹 페이지 로드', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toContainText(/랭킹|Ranking/i)
  })

  test('랭킹 리스트 표시', async ({ page }) => {
    // 랭킹 카드/리스트 존재 확인
    const rankingList = page.locator('[class*="ranking"], [class*="rank"]').first()
    await expect(rankingList).toBeVisible()
  })

  test('Top 3 포디움 표시', async ({ page }) => {
    // Top 3 섹션 확인 (있는 경우)
    const podium = page.locator('[class*="podium"], [class*="top-3"]').first()
    
    if (await podium.isVisible()) {
      // 1, 2, 3위 표시 확인
      await expect(page.locator('text=/1위|1st|gold/i').first()).toBeVisible()
    }
  })

  test('유닛 필터 동작', async ({ page }) => {
    // 유닛 필터 버튼 찾기
    const excelFilter = page.locator('button:has-text("EXCEL"), [data-unit="excel"]').first()
    const crewFilter = page.locator('button:has-text("CREW"), [data-unit="crew"]').first()
    
    if (await excelFilter.isVisible()) {
      await excelFilter.click()
      // 필터 활성화 확인
      await expect(excelFilter).toHaveClass(/active|selected/)
    }
  })

  test('시즌 필터 존재', async ({ page }) => {
    // 시즌 선택 드롭다운 또는 탭 확인
    const seasonFilter = page.locator('[class*="season"], select, [role="combobox"]').first()
    await expect(seasonFilter).toBeVisible()
  })
})

test.describe('VIP 페이지', () => {
  test('VIP 페이지 접근', async ({ page }) => {
    await page.goto('/ranking/vip')
    
    // VIP 페이지 로드 확인 (또는 로그인 리다이렉트)
    const isVipPage = await page.locator('text=/VIP|SECRET/i').first().isVisible()
    const isLoginRedirect = page.url().includes('/login')
    
    expect(isVipPage || isLoginRedirect).toBeTruthy()
  })
})
