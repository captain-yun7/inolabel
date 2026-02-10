# 2026-01-13 작업 요약

## 📋 개요

오늘 구현한 주요 기능:
1. **타임라인 무한 스크롤** - 페이지네이션 없이 스크롤로 추가 데이터 로드
2. **헌정 페이지 해시 URL** - userId 노출 방지를 위한 URL 난독화

---

## ✅ 완료된 작업

### 1. 타임라인 무한 스크롤 (Timeline Infinite Scroll)

#### 구현 내용
- IntersectionObserver 기반 무한 스크롤 훅 생성
- 클라이언트 사이드 페이지네이션 (pageSize: 8)
- 로딩 인디케이터 및 타임라인 종료 마커 추가

#### 생성/수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/lib/hooks/useInfiniteScroll.ts` | 신규 - 범용 무한 스크롤 훅 |
| `src/lib/hooks/useTimelineData.ts` | 페이지네이션 옵션 및 상태 추가 |
| `src/lib/hooks/index.ts` | useInfiniteScroll export 추가 |
| `src/components/info/Timeline.tsx` | 무한 스크롤 통합 |
| `src/components/info/Timeline.module.css` | 로딩/종료 UI 스타일 |

#### 핵심 코드

**useInfiniteScroll 훅:**
```typescript
export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { rootMargin = '200px', enabled = true } = options
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [canLoadMore, setCanLoadMore] = useState(true)

  useEffect(() => {
    if (!enabled || !canLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [onLoadMore, rootMargin, enabled, canLoadMore])

  return { sentinelRef, setCanLoadMore }
}
```

#### 해결된 버그
- **무한 리렌더링 문제**: `setCanLoadMore(false)`를 컴포넌트 본문에서 직접 호출하여 발생
- **해결**: useEffect 내부로 이동하여 상태 업데이트 사이클 방지

---

### 2. 헌정 페이지 해시 URL (Tribute Page Hash URL)

#### 구현 내용
- XOR 암호화 + Base64 URL-safe 인코딩으로 userId 난독화
- `/ranking/[userId]` → `/ranking/tribute/[hash]` 리다이렉트
- 모든 랭킹 관련 컴포넌트에서 새 URL 형식 사용

#### 생성/수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/lib/utils/hash.ts` | 신규 - 해시 인코딩/디코딩 유틸리티 |
| `src/lib/utils.ts` | hash.ts export 추가 |
| `src/lib/utils/index.ts` | hash.ts export 추가 |
| `src/app/ranking/tribute/[hash]/page.tsx` | 신규 - 해시 기반 헌정 페이지 |
| `src/app/ranking/[userId]/page.tsx` | 해시 URL로 리다이렉트 처리 |
| `src/components/ranking/RankingFullList.tsx` | getTributePageUrl 사용 |
| `src/components/ranking/RankingList.tsx` | getTributePageUrl 사용 |
| `src/components/ranking/RankingPodium.tsx` | getTributePageUrl 사용 |
| `src/components/Navbar.tsx` | getTributePageUrl 사용 |
| `src/app/ranking/vip/page.tsx` | getTributePageUrl 사용 |

#### 핵심 코드

**해시 유틸리티:**
```typescript
const HASH_KEY = 'rgfamily2024secret'

export function encodeUserIdToHash(userId: string): string {
  // XOR 난독화
  const xorResult = userId
    .split('')
    .map((char, i) => {
      const keyChar = HASH_KEY[i % HASH_KEY.length]
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0))
    })
    .join('')

  // Base64 URL-safe 인코딩
  return btoa(xorResult)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function getTributePageUrl(userId: string): string {
  const hash = encodeUserIdToHash(userId)
  return `/ranking/tribute/${hash}`
}
```

#### 해결된 버그
- **모듈 export 오류**: `@/lib/utils`에서 `getTributePageUrl`을 찾지 못함
- **원인**: `utils.ts` 파일이 `utils/` 폴더보다 우선 resolve됨
- **해결**: `utils.ts`에 `export * from './utils/hash'` 추가

---

## 🔨 커밋 내역

```
71eb6ae feat: Add infinite scroll for timeline and hash-based tribute URLs
```

---

## 📌 남은 작업 (미구현 기능)

### 우선순위 높음 🔴

#### 1. PandaTV 실시간 라이브 스크래퍼
- **설명**: PandaTV 방송 상태를 주기적으로 확인하여 라이브 멤버 표시
- **필요 기술**: Supabase Edge Function 또는 Next.js API Route + Vercel Cron
- **관련 페이지**: 메인 LiveMembers, RG Live 페이지

#### 2. 공지사항 자동 동기화
- **설명**: 외부 공지사항 소스와 자동 동기화
- **필요 기술**: Cron Job + API 연동

### 우선순위 중간 🟡

#### 3. 푸시 알림 시스템
- **설명**: 방송 시작, 새 공지 등에 대한 알림
- **필요 기술**: Web Push API, Service Worker
- **구현 범위**:
  - 브라우저 알림 권한 요청
  - 알림 구독/해제 관리
  - 서버 사이드 푸시 발송

### 우선순위 낮음 🟢

#### 4. 관리자 대시보드 실시간 통계
- **설명**: 실시간 후원/접속 통계 차트
- **현재 상태**: 기본 구조 완료, 실시간 연동 필요

---

## 📁 프로젝트 구조 변경

```
src/
├── lib/
│   ├── hooks/
│   │   ├── useInfiniteScroll.ts  ← 신규
│   │   ├── useTimelineData.ts    ← 수정
│   │   └── index.ts              ← 수정
│   └── utils/
│       ├── hash.ts               ← 신규
│       ├── index.ts              ← 수정
│       └── ...
├── app/
│   └── ranking/
│       ├── [userId]/
│       │   └── page.tsx          ← 수정 (리다이렉트)
│       └── tribute/
│           └── [hash]/
│               └── page.tsx      ← 신규
└── components/
    ├── info/
    │   ├── Timeline.tsx          ← 수정
    │   └── Timeline.module.css   ← 수정
    └── ranking/
        ├── RankingFullList.tsx   ← 수정
        ├── RankingList.tsx       ← 수정
        └── RankingPodium.tsx     ← 수정
```

---

## 🔗 참고 문서

- [CLAUDE.md](/CLAUDE.md) - 프로젝트 가이드라인
- [RG_FAMILY_DESIGN_SYSTEM.md](/docs/RG_FAMILY_DESIGN_SYSTEM.md) - 디자인 시스템
- [SUPABASE_SCHEMA.md](/docs/SUPABASE_SCHEMA.md) - DB 스키마
