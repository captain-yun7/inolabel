import { defineConfig, devices } from '@playwright/test'

/**
 * INOLABEL E2E 테스트 설정
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003',

    /* 실패 시 스크린샷 */
    screenshot: 'only-on-failure',

    /* 실패 시 트레이스 */
    trace: 'on-first-retry',

    /* 비디오 녹화 (선택적) */
    video: 'retain-on-failure',
  },

  /* 프로젝트별 브라우저 설정 */
  projects: [
    /* 인증 세션 setup */
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    /* 비인증 테스트 (Chromium) */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /authenticated\.spec\.ts|admin\.spec\.ts/,
    },

    /* 인증된 사용자 테스트 */
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      testMatch: /authenticated\.spec\.ts/,
      dependencies: ['setup'],
    },

    /* 관리자 테스트 */
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
      testMatch: /admin\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],

  /* 로컬 개발 서버 설정 */
  webServer: {
    command: 'npx next dev --port 3003',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
