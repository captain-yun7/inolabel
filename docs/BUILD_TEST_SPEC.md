# RG Family 홈페이지 빌드 테스트 명세서

> **프로젝트**: rg-family
> **기술스택**: Next.js 16.1.1 + React 19 + TypeScript 5.9
> **패키지매니저**: pnpm 10.x
> **Node 버전**: >=18.17.0 (권장: 20.x LTS)
> **빌드 도구**: Turbopack (Next.js 내장)
> **작성일**: 2026-01-19

---

## 1. Build Test Scope (테스트 범위)

### 1.1 라우트 범위 (총 35개 페이지)

| 카테고리 | 라우트 | 타입 | 우선순위 |
|---------|--------|------|----------|
| **홈** | `/` | Static | P0 (Critical) |
| **랭킹** | `/ranking`, `/ranking/vip`, `/ranking/season` | Static | P0 |
| **정보** | `/rg/org`, `/rg/sig`, `/rg/live`, `/rg/history` | Static | P1 |
| **커뮤니티** | `/community`, `/community/free`, `/community/vip` | Static | P1 |
| **공지** | `/notice` | Static | P1 |
| **스케줄** | `/schedule` | Static | P1 |
| **인증** | `/login`, `/signup` | Static | P1 |
| **어드민** | `/admin/*` (15개) | Static | P2 |
| **동적** | `[id]`, `[hash]` 패턴 | Dynamic | P2 |
| **API** | `/api/*` (4개) | Function | P1 |

### 1.2 핵심 컴포넌트 의존성

```
src/app/page.tsx (홈페이지)
├── components/home/Notice.tsx      → Supabase: notices
├── components/home/VOD.tsx         → Supabase: media_content
├── components/home/Shorts.tsx      → Supabase: media_content
├── components/ranking/RankingBoard.tsx → Supabase: profiles, donations
├── components/Banner.tsx           → Supabase: banners
└── components/live/LiveStatus.tsx  → Supabase: live_status
```

### 1.3 외부 의존성

| 서비스 | 용도 | CI 전략 |
|--------|------|---------|
| Supabase | DB/Auth | Mock URL 또는 테스트 프로젝트 |
| Cloudinary | 이미지 업로드 | 빌드 시 불필요 |
| PandaTV | 라이브 크롤링 | 빌드 시 불필요 |

---

## 2. Preconditions (사전 조건)

### 2.1 필수 환경변수

```bash
# .env.local (로컬) 또는 GitHub Secrets (CI)
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co     # 빌드용 더미 OK
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key           # 빌드용 더미 OK
NEXT_PUBLIC_USE_MOCK_DATA=false                       # 프로덕션 모드
```

### 2.2 Node/패키지매니저 버전

```bash
# .nvmrc (프로젝트 루트에 생성)
20.18.0

# package.json engines (이미 설정됨)
"engines": {
  "node": ">=18.17.0"
}
```

### 2.3 캐시 정책

| 대상 | 경로 | TTL |
|------|------|-----|
| pnpm store | `~/.local/share/pnpm/store/v3` | 7일 |
| Next.js cache | `.next/cache` | PR당 초기화 |
| node_modules | `node_modules` | lockfile hash 기반 |

---

## 3. Commands (실행 명령어)

### 3.1 로컬 빌드 검증 (순서대로)

```bash
# Step 1: 클린 설치
rm -rf node_modules .next pnpm-lock.yaml
pnpm install --frozen-lockfile

# Step 2: 타입 체크
pnpm exec tsc --noEmit
# 기대 결과: 0 errors

# Step 3: 린트 검사
pnpm lint
# 기대 결과: warning은 OK, error 0개

# Step 4: 프로덕션 빌드
pnpm build
# 기대 결과:
#   ✓ Compiled successfully
#   ✓ Generating static pages (39/39)
#   Route (app) ... ○ (Static) / ƒ (Dynamic)

# Step 5: 빌드 결과 검증
ls -la .next/standalone 2>/dev/null || echo "standalone 미생성 (정상)"
ls .next/static
# 기대 결과: chunks/, css/, media/ 폴더 존재

# Step 6: 프로덕션 서버 스모크
pnpm start &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# 기대 결과: 200
kill %1
```

### 3.2 CI용 명령어 (GitHub Actions)

```bash
# 설치 (캐시 활용)
pnpm install --frozen-lockfile

# 병렬 검증
pnpm exec tsc --noEmit &
pnpm lint &
wait

# 빌드
pnpm build

# 스모크 테스트
pnpm start &
sleep 5
curl --fail http://localhost:3000 | grep -q "RG Family"
```

---

## 4. Automated Checks (자동화 검증)

### 4.1 검증 단계별 정의

| 단계 | 명령어 | 타임아웃 | 실패 시 |
|------|--------|----------|---------|
| **Typecheck** | `tsc --noEmit` | 60s | 즉시 실패 |
| **Lint** | `pnpm lint` | 30s | 즉시 실패 |
| **Unit Test** | `pnpm test:run` | 120s | 즉시 실패 |
| **Build** | `pnpm build` | 300s | 즉시 실패 |
| **Smoke** | 아래 스크립트 | 30s | 즉시 실패 |
| **E2E** | `pnpm test:e2e` | 300s | 선택적 |

### 4.2 스모크 테스트 스크립트

```bash
#!/bin/bash
# scripts/smoke-test.sh

set -e

echo "🚀 Starting smoke test..."

# 서버 시작
pnpm start &
SERVER_PID=$!

# 서버 준비 대기
echo "⏳ Waiting for server..."
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server ready"
    break
  fi
  sleep 1
done

# 핵심 페이지 검증
PAGES=(
  "/"
  "/ranking"
  "/rg/org"
  "/notice"
  "/login"
)

FAILED=0
for page in "${PAGES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$page")
  if [ "$STATUS" -eq 200 ]; then
    echo "✅ $page → $STATUS"
  else
    echo "❌ $page → $STATUS"
    FAILED=1
  fi
done

# 정리
kill $SERVER_PID 2>/dev/null || true

if [ $FAILED -eq 1 ]; then
  echo "❌ Smoke test failed"
  exit 1
fi

echo "✅ All smoke tests passed"
```

### 4.3 단위 테스트 설정

```typescript
// vitest.config.ts (이미 존재해야 함)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.tsx'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/__tests__/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## 5. Failure Matrix (실패 유형별 진단)

### 5.1 빌드 실패 패턴

| 증상 | 원인 | 확인법 | 해결 |
|------|------|--------|------|
| `Module not found: @/lib/mock` | mock import 잔존 | `grep -r "from '@/lib/mock'" src/` | import 제거 |
| `Type error: Property 'X' does not exist` | DB 스키마 불일치 | `src/types/database.ts` 확인 | 타입 동기화 |
| `NEXT_PUBLIC_SUPABASE_URL is not defined` | 환경변수 누락 | `echo $NEXT_PUBLIC_SUPABASE_URL` | .env.local 설정 |
| `Error: Page /X couldn't be rendered` | 컴포넌트 SSR 에러 | `.next/server/app/X.html` 로그 | use client 추가 |
| `ENOMEM: not enough memory` | 메모리 부족 | `NODE_OPTIONS` 확인 | `--max-old-space-size=4096` |
| `pnpm-lock.yaml out of sync` | lockfile 불일치 | `pnpm install` 재실행 | `--frozen-lockfile` 제거 후 커밋 |

### 5.2 런타임 실패 패턴

| 증상 | 원인 | 확인법 | 해결 |
|------|------|--------|------|
| 500 에러 (홈페이지) | Supabase 연결 실패 | 브라우저 콘솔/네트워크 탭 | 환경변수 확인, 테이블 존재 확인 |
| 빈 페이지 렌더링 | 클라이언트 하이드레이션 | React DevTools | use client 누락 확인 |
| 스타일 깨짐 | Tailwind 빌드 실패 | `.next/static/css/` 확인 | postcss.config 점검 |
| 이미지 404 | public 경로 오류 | Network 탭 | `/public/` 경로 확인 |

### 5.3 CI 전용 실패 패턴

| 증상 | 원인 | 해결 |
|------|------|------|
| `EACCES: permission denied` | 캐시 권한 | `actions/cache@v4` 버전 업 |
| `Timeout exceeded` | 리소스 부족 | `runs-on: ubuntu-latest-4-cores` |
| `Process completed with exit code 137` | OOM Kill | 메모리 증가 또는 병렬 작업 분리 |

---

## 6. GitHub Actions Workflow

```yaml
# .github/workflows/build-test.yml
name: Build & Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NEXT_PUBLIC_SUPABASE_URL: https://test.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY: test-anon-key-for-build
  NEXT_PUBLIC_USE_MOCK_DATA: 'false'
  NODE_OPTIONS: '--max-old-space-size=4096'

jobs:
  typecheck-lint:
    name: TypeCheck & Lint
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: TypeCheck
        run: pnpm exec tsc --noEmit

      - name: Lint
        run: pnpm lint

  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: typecheck-lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Cache Next.js build
        uses: actions/cache@v4
        with:
          path: |
            .next/cache
          key: nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('src/**/*.tsx', 'src/**/*.ts') }}
          restore-keys: |
            nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-
            nextjs-${{ runner.os }}-

      - name: Build
        run: pnpm build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: .next
          retention-days: 1

  smoke-test:
    name: Smoke Test
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: build
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: nextjs-build
          path: .next

      - name: Start server and smoke test
        run: |
          pnpm start &
          sleep 5

          # 핵심 페이지 검증
          for path in "/" "/ranking" "/rg/org" "/notice" "/login"; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
            echo "GET $path → $STATUS"
            if [ "$STATUS" != "200" ]; then
              echo "❌ Failed: $path"
              exit 1
            fi
          done

          echo "✅ All smoke tests passed"

  unit-test:
    name: Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: typecheck-lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test:run

  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: nextjs-build
          path: .next

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## 7. Acceptance Criteria (통과 기준)

### 7.1 정량적 기준

| 항목 | 기준 | 측정 방법 |
|------|------|-----------|
| TypeScript 에러 | **0개** | `tsc --noEmit` exit code |
| ESLint 에러 | **0개** | `pnpm lint` exit code |
| 빌드 성공 | **39 페이지** 생성 | `pnpm build` 출력 |
| 스모크 테스트 | **5개 핵심 페이지** 200 OK | curl status code |
| 단위 테스트 | **100% 통과** | vitest exit code |
| 빌드 시간 | **< 5분** (CI 기준) | GitHub Actions duration |

### 7.2 체크리스트 (PR 머지 전)

```markdown
## Build Verification Checklist

- [ ] `pnpm install --frozen-lockfile` 성공
- [ ] `pnpm exec tsc --noEmit` 에러 0개
- [ ] `pnpm lint` 에러 0개
- [ ] `pnpm build` 성공 (39 pages generated)
- [ ] 홈페이지 (`/`) 200 OK
- [ ] 랭킹 페이지 (`/ranking`) 200 OK
- [ ] 조직도 (`/rg/org`) 200 OK
- [ ] 공지사항 (`/notice`) 200 OK
- [ ] 로그인 (`/login`) 200 OK
- [ ] GitHub Actions 모든 job 통과
```

### 7.3 실패 시 롤백 절차

1. **PR 머지 차단**: CI 실패 시 자동 차단 (branch protection)
2. **빠른 롤백**: `git revert HEAD && git push`
3. **핫픽스 브랜치**: `hotfix/build-fix-YYYYMMDD`

---

## 부록: 빠른 로컬 검증 원라이너

```bash
# 전체 검증 (클린 빌드)
rm -rf node_modules .next && pnpm i && pnpm exec tsc --noEmit && pnpm lint && pnpm build

# 빠른 검증 (캐시 사용)
pnpm exec tsc --noEmit && pnpm lint && pnpm build

# 스모크만
pnpm build && pnpm start & sleep 3 && curl -I http://localhost:3000; kill %1
```
