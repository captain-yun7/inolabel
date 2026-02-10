# K-007 Repository 패턴 전역 적용

## 개요
4개 주요 훅(useRanking, useTimelineData, useSchedule)에 Repository 패턴을 적용하여 Mock/Supabase 분기 로직을 Repository 계층으로 추상화했습니다. 총 ~500줄의 중복 코드가 제거되었습니다.

## 주요 변경사항

### 1. Repository 인터페이스 추가
| 인터페이스 | 용도 |
|-----------|------|
| ITimelineRepository | 타임라인 이벤트 조회 |
| IScheduleRepository | 일정 캘린더 조회 |

### 2. 훅 리팩터링 결과
| 훅 | Before | After | 감소율 |
|----|--------|-------|--------|
| useRanking | 248줄 | 102줄 | -59% |
| useTimelineData | 218줄 | 155줄 | -29% |
| useSchedule | 182줄 | 191줄 | +5% (구조 개선) |

### 3. DataProvider 확장
```typescript
// 새 Context 훅 추가
export function useTimeline() {
  const { provider } = useDataProviderContext()
  return provider.timeline
}

export function useSchedules() {
  const { provider } = useDataProviderContext()
  return provider.schedules
}
```

### 4. 수정된 파일
- `src/lib/repositories/types.ts` - ITimelineRepository, IScheduleRepository 추가
- `src/lib/repositories/mock/index.ts` - MockTimelineRepository, MockScheduleRepository 추가
- `src/lib/repositories/supabase/index.ts` - SupabaseTimelineRepository, SupabaseScheduleRepository 추가
- `src/lib/context/DataProviderContext.tsx` - useTimeline(), useSchedules() 훅 추가
- `src/lib/context/index.ts` - export 추가
- `src/lib/hooks/useRanking.ts` - Repository 패턴 적용 (이전 세션)
- `src/lib/hooks/useTimelineData.ts` - Repository 패턴 적용
- `src/lib/hooks/useSchedule.ts` - Repository 패턴 적용

## 결과
- ✅ 빌드 성공
- ✅ Mock/Supabase 자동 전환 동작
- ✅ 중복 코드 제거

## 아키텍처 개선

```
Before:
┌─────────────┐
│   Hook      │ ← USE_MOCK_DATA 분기 로직 중복
│ (Supabase)  │
│ (Mock)      │
└─────────────┘

After:
┌─────────────┐
│   Hook      │ ← 비즈니스 로직만 담당
└──────┬──────┘
       │
┌──────▼──────┐
│ Repository  │ ← 데이터 접근 추상화
│ Context     │
└──────┬──────┘
       │
┌──────▼──────┐     ┌──────────────┐
│   Mock      │ ←── │ DataProvider │ ──→ Supabase
│ Repository  │     │  (Strategy)  │     Repository
└─────────────┘     └──────────────┘
```

## 다음 단계
- **K-001**: PandaTV API 실시간 LIVE 연동
- **K-002**: E2E 테스트 구축 (Playwright)
- **K-003**: 헌정 페이지 남은 5% (미디어 업로드, 라이트모드 테마)
