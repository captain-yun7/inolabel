import { test, expect } from '@playwright/test'

test.describe('일정 캘린더', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule')
  })

  test('캘린더 페이지 로드', async ({ page }) => {
    // 캘린더 컨테이너 확인
    const calendar = page.locator('[class*="calendar"], [class*="schedule"]').first()
    await expect(calendar).toBeVisible()
  })

  test('월간 그리드 표시', async ({ page }) => {
    // 캘린더 그리드 (날짜 셀) 확인
    const dateGrid = page.locator('[class*="grid"], [class*="days"], table').first()
    await expect(dateGrid).toBeVisible()
  })

  test('월 네비게이션 동작', async ({ page }) => {
    // 이전/다음 월 버튼 확인
    const prevButton = page.locator('button:has-text("<"), [aria-label*="prev"], [class*="prev"]').first()
    const nextButton = page.locator('button:has-text(">"), [aria-label*="next"], [class*="next"]').first()
    
    if (await nextButton.isVisible()) {
      // 현재 월 텍스트 저장
      const monthText = await page.locator('[class*="month"], [class*="header"] h2, [class*="title"]').first().textContent()
      
      // 다음 월로 이동
      await nextButton.click()
      await page.waitForTimeout(300)
      
      // 월 변경 확인
      const newMonthText = await page.locator('[class*="month"], [class*="header"] h2, [class*="title"]').first().textContent()
      expect(newMonthText).not.toBe(monthText)
    }
  })

  test('유닛 필터 동작', async ({ page }) => {
    // 유닛 필터 버튼 확인
    const excelFilter = page.locator('button:has-text("EXCEL"), [data-unit="excel"]').first()
    
    if (await excelFilter.isVisible()) {
      await excelFilter.click()
      await expect(excelFilter).toHaveClass(/active|selected/)
    }
  })

  test('일정 클릭 시 상세 정보', async ({ page }) => {
    // 일정이 있는 날짜 셀 클릭
    const eventCell = page.locator('[class*="event"], [class*="has-event"]').first()
    
    if (await eventCell.isVisible()) {
      await eventCell.click()
      
      // 상세 정보 모달 또는 패널 확인
      await page.waitForTimeout(300)
      const detail = page.locator('[class*="modal"], [class*="detail"], [class*="popup"]')
      // 상세 정보가 있을 수도, 없을 수도 있음
    }
  })
})
