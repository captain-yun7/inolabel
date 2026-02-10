import { defineConfig, devices } from '@playwright/test'

/**
 * RG Family E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* 최대 병렬 실행 수 */
  fullyParallel: true,
  
  /* CI에서만 재시도 */
  retries: process.env.CI ? 2 : 0,
  
  /* 워커 수 */
  workers: process.env.CI ? 1 : undefined,
  
  /* 리포터 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  /* 공통 설정 */
  use: {
    /* 기본 URL */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    /* 실패 시 스크린샷 */
    screenshot: 'only-on-failure',
    
    /* 실패 시 트레이스 */
    trace: 'on-first-retry',
    
    /* 비디오 녹화 (선택적) */
    video: 'retain-on-failure',
  },

  /* 프로젝트별 브라우저 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* 모바일 테스트 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 로컬 개발 서버 설정 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
