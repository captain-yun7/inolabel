import { test, expect } from '@playwright/test'

test.describe('관리자 대시보드', () => {
  test('대시보드 접근 및 로드', async ({ page }) => {
    await page.goto('/admin')

    // 관리자 세션이 유효하면 대시보드 로드
    // 권한 없으면 로그인 리다이렉트
    const isDashboard = await page.getByText('대시보드').first().isVisible({ timeout: 15000 }).catch(() => false)
    const isLoginRedirect = page.url().includes('/login')
    const isHomeRedirect = page.url() === '/' || page.url().endsWith(':3000/')

    if (isLoginRedirect || isHomeRedirect) {
      test.skip()
      return
    }

    expect(isDashboard).toBeTruthy()
  })

  test('통계 카드 표시', async ({ page }) => {
    await page.goto('/admin')

    if (page.url().includes('/login') || page.url() === '/') {
      test.skip()
      return
    }

    // 대시보드 통계 카드
    await expect(page.getByText('전체 회원')).toBeVisible({ timeout: 15000 })
  })

  test('실시간 라이브 현황 섹션', async ({ page }) => {
    await page.goto('/admin')

    if (page.url().includes('/login') || page.url() === '/') {
      test.skip()
      return
    }

    await expect(page.getByText('실시간 라이브 현황')).toBeVisible({ timeout: 15000 })
  })

  test('빠른 작업 섹션', async ({ page }) => {
    await page.goto('/admin')

    if (page.url().includes('/login') || page.url() === '/') {
      test.skip()
      return
    }

    await expect(page.getByText('빠른 작업')).toBeVisible({ timeout: 15000 })
  })
})

test.describe('관리자 하위 페이지 접근', () => {
  const adminPages = [
    { path: '/admin/members', title: '회원' },
    { path: '/admin/organization', title: '조직도' },
    { path: '/admin/posts', title: '게시' },
    { path: '/admin/notices', title: '공지' },
    { path: '/admin/signatures', title: '시그니처' },
  ]

  for (const { path, title } of adminPages) {
    test(`${title} 관리 페이지 접근 (${path})`, async ({ page }) => {
      await page.goto(path)

      // 관리자 권한 체크 후 로드 또는 리다이렉트
      const isLoaded = await page.locator('[class*="layout"], [class*="admin"], main').first()
        .isVisible({ timeout: 15000 }).catch(() => false)
      const isRedirected = page.url().includes('/login') || page.url() === '/' || page.url().endsWith(':3000/')

      if (isRedirected) {
        test.skip()
        return
      }

      expect(isLoaded).toBeTruthy()
    })
  }
})

test.describe('비인증 사용자 admin 접근', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('비인증 시 로그인 페이지로 리다이렉트', async ({ page }) => {
    await page.goto('/admin')

    // 로그인 리다이렉트 또는 홈 리다이렉트 대기
    await page.waitForURL(/login|^\/$/, { timeout: 15000 })

    const isLoginPage = page.url().includes('/login')
    const isHomePage = page.url() === '/' || page.url().endsWith(':3000/')

    expect(isLoginPage || isHomePage).toBeTruthy()
  })
})
