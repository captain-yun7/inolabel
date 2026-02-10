import { test, expect } from '@playwright/test'

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('메인 페이지 로드', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/RG Family/)
    
    // Hero 섹션 존재 확인
    const hero = page.locator('[class*="hero"]').first()
    await expect(hero).toBeVisible()
  })

  test('네비게이션 메뉴 존재', async ({ page }) => {
    // 네비게이션 메뉴 확인
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
    
    // 주요 메뉴 링크 확인
    await expect(page.getByRole('link', { name: /RG Info/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Ranking/i })).toBeVisible()
  })

  test('LIVE MEMBERS 섹션', async ({ page }) => {
    // LIVE MEMBERS 섹션 확인
    const liveSection = page.locator('text=LIVE').first()
    await expect(liveSection).toBeVisible()
  })

  test('공지사항 섹션', async ({ page }) => {
    // 공지사항 섹션 확인
    const noticeSection = page.locator('[class*="notice"]').first()
    await expect(noticeSection).toBeVisible()
  })

  test('다크/라이트 모드 토글', async ({ page }) => {
    // 테마 토글 버튼 찾기
    const themeToggle = page.locator('[aria-label*="theme"], [class*="theme-toggle"]').first()
    
    if (await themeToggle.isVisible()) {
      // 현재 테마 확인
      const html = page.locator('html')
      const initialTheme = await html.getAttribute('data-theme')
      
      // 토글 클릭
      await themeToggle.click()
      
      // 테마 변경 확인
      await expect(html).not.toHaveAttribute('data-theme', initialTheme || '')
    }
  })
})

test.describe('모바일 반응형', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('모바일에서 메뉴 표시', async ({ page }) => {
    await page.goto('/')
    
    // 햄버거 메뉴 또는 모바일 네비게이션 확인
    const mobileMenu = page.locator('[class*="mobile-menu"], [class*="hamburger"], button[aria-label*="menu"]').first()
    
    // 모바일 메뉴가 있으면 클릭하여 열기
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      // 메뉴 열림 확인
      await expect(page.locator('[class*="menu-open"], [class*="nav-open"]').first()).toBeVisible()
    }
  })
})
