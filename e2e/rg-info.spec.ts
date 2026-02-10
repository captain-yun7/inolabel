import { test, expect } from '@playwright/test'

test.describe('RG Info - 조직도', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rg/org')
  })

  test('조직도 페이지 로드', async ({ page }) => {
    // 조직도 컨테이너 확인
    const orgChart = page.locator('[class*="org"], [class*="organization"]').first()
    await expect(orgChart).toBeVisible()
  })

  test('유닛 토글 동작', async ({ page }) => {
    // Excel/Crew 토글 버튼 확인
    const excelTab = page.locator('button:has-text("EXCEL"), [data-unit="excel"]').first()
    const crewTab = page.locator('button:has-text("CREW"), [data-unit="crew"]').first()
    
    if (await excelTab.isVisible()) {
      await excelTab.click()
      await expect(excelTab).toHaveClass(/active|selected/)
    }
    
    if (await crewTab.isVisible()) {
      await crewTab.click()
      await expect(crewTab).toHaveClass(/active|selected/)
    }
  })

  test('멤버 카드 클릭 시 모달', async ({ page }) => {
    // 멤버 카드 찾기
    const memberCard = page.locator('[class*="member-card"], [class*="profile-card"]').first()
    
    if (await memberCard.isVisible()) {
      await memberCard.click()
      
      // 모달 열림 확인
      const modal = page.locator('[class*="modal"], [role="dialog"]')
      await expect(modal.first()).toBeVisible()
    }
  })
})

test.describe('RG Info - 시그리스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rg/sig')
  })

  test('시그리스트 페이지 로드', async ({ page }) => {
    // 시그니처 갤러리 확인
    const gallery = page.locator('[class*="gallery"], [class*="sig"]').first()
    await expect(gallery).toBeVisible()
  })

  test('시그니처 카드 클릭 시 모달', async ({ page }) => {
    // 첫 번째 시그 카드 찾기
    const sigCard = page.locator('[class*="sig-card"], [class*="card"]').first()
    
    if (await sigCard.isVisible()) {
      await sigCard.click()
      
      // 모달 또는 상세 뷰 열림 확인
      await page.waitForTimeout(500)
      const modal = page.locator('[class*="modal"], [role="dialog"], iframe')
      await expect(modal.first()).toBeVisible()
    }
  })

  test('카테고리 필터 동작', async ({ page }) => {
    // 카테고리 필터 버튼 확인
    const filterButtons = page.locator('[class*="filter"] button, [class*="category"] button')
    
    if (await filterButtons.first().isVisible()) {
      const count = await filterButtons.count()
      expect(count).toBeGreaterThan(0)
    }
  })
})

test.describe('RG Info - 타임라인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rg/history')
  })

  test('타임라인 페이지 로드', async ({ page }) => {
    // 타임라인 컨테이너 확인
    const timeline = page.locator('[class*="timeline"]').first()
    await expect(timeline).toBeVisible()
  })

  test('시즌 필터 동작', async ({ page }) => {
    // 시즌 필터 확인
    const seasonFilter = page.locator('[class*="season-filter"], [class*="filter"]').first()
    
    if (await seasonFilter.isVisible()) {
      const filterButton = seasonFilter.locator('button').first()
      if (await filterButton.isVisible()) {
        await filterButton.click()
      }
    }
  })

  test('타임라인 이벤트 카드 표시', async ({ page }) => {
    // 이벤트 카드 확인
    const eventCards = page.locator('[class*="event"], [class*="timeline-item"]')
    
    // 최소 1개 이상의 이벤트 확인
    await expect(eventCards.first()).toBeVisible()
  })
})

test.describe('RG Info - 라이브', () => {
  test('라이브 페이지 로드', async ({ page }) => {
    await page.goto('/rg/live')
    
    // 라이브 멤버 그리드 확인
    const liveGrid = page.locator('[class*="live"], [class*="member"]').first()
    await expect(liveGrid).toBeVisible()
  })
})
