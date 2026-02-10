# 랭킹 페이지 시즌 라우팅 수정

## 개요
`/ranking/season/current` 경로가 현재 활성 시즌으로 정상 라우팅되지 않던 문제를 수정했습니다.

## 문제점
- `/ranking` 페이지에서 "이번 시즌 랭킹" 링크가 `/ranking/season/current`로 연결
- `season/[id]/page.tsx`에서 `Number("current")` → `NaN` 변환되어 시즌 찾기 실패
- 결과적으로 "시즌을 찾을 수 없습니다" 오류 표시

## 해결 방법
`season/[id]/page.tsx`에서 "current" 문자열을 특별 처리:

```typescript
// "current"인 경우 현재 활성 시즌 ID 사용
const seasonId = useMemo(() => {
  if (params.id === 'current') {
    return currentSeason?.id || null
  }
  return params.id ? Number(params.id) : null
}, [params.id, currentSeason])
```

## 변경 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/app/ranking/season/[id]/page.tsx` | "current" 경로 처리 로직 추가, 변수명 충돌 해결 |

## 결과
- ✅ 빌드 성공
- ✅ `/ranking/season/current` → 현재 활성 시즌(시즌 4) 표시
- ✅ `/ranking/season/1`, `/ranking/season/2` 등 숫자 ID도 정상 동작

## 테스트 경로
- `/ranking` - 랭킹 메인 (전체/시즌 선택)
- `/ranking/total` - 전체 랭킹
- `/ranking/season/current` - 현재 시즌 랭킹
- `/ranking/season/4` - 시즌 4 랭킹 (직접 접근)
