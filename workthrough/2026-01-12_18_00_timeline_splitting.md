# K-005 Timeline.tsx 분할

## 개요
474줄의 모놀리식 Timeline 컴포넌트를 단일 책임 원칙(SRP)에 따라 분할하여 유지보수성과 재사용성을 향상시켰습니다.

## 분할 결과

| 파일 | 줄 수 | 책임 |
|------|------|------|
| Timeline.tsx | 128 | 메인 오케스트레이션 |
| useTimelineData.ts | 217 | 데이터 페칭/필터링/그룹화 |
| TimelineFilter.tsx | 85 | 시즌/카테고리 필터 UI |
| TimelineEventCard.tsx | 86 | 개별 이벤트 카드 |
| TimelineModal.tsx | 88 | 상세 모달 |

**결과**: 474줄 → 128줄 메인 컴포넌트 (-73%)

## 아키텍처 개선

### Before (모놀리식)
```typescript
// Timeline.tsx (474줄)
export default function Timeline() {
  // 데이터 페칭, 필터링, UI 모두 한 파일에
  const [events, setEvents] = useState([])
  const fetchData = useCallback(async () => { /* 100줄+ */ }, [])
  return (
    <div>
      {/* 필터 UI 60줄 */}
      {/* 이벤트 목록 150줄 */}
      {/* 모달 70줄 */}
    </div>
  )
}
```

### After (분리된 관심사)
```typescript
// Timeline.tsx (128줄)
export default function Timeline() {
  const { groupedBySeason, isLoading, ... } = useTimelineData()
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <div>
      <TimelineFilter {...filterProps} />
      {groupedBySeason.map(group => (
        <TimelineEventCard ... />
      ))}
      <TimelineModal event={selectedEvent} />
    </div>
  )
}
```

## 새로 생성된 파일

### useTimelineData.ts
- 데이터 페칭 (Mock/Supabase 분기)
- 필터 상태 관리
- 시즌별 그룹화 로직
- 카테고리/시즌 색상 유틸리티

### TimelineFilter.tsx
- 시즌 선택 버튼 그룹
- 카테고리 선택 버튼 그룹
- 필터 상태 변경 콜백

### TimelineEventCard.tsx
- 개별 이벤트 카드 렌더링
- 좌우 배치 애니메이션
- 클릭 핸들링

### TimelineModal.tsx
- 이벤트 상세 모달
- 이미지, 날짜, 카테고리 표시
- 닫기 애니메이션

## 적용된 원칙

| 원칙 | 적용 |
|------|------|
| **SRP** | 각 파일이 단일 책임 |
| **DIP** | Timeline이 useTimelineData 훅에 의존 |
| **OCP** | 새 필터 유형 추가 시 기존 코드 수정 불필요 |

## 결과
- ✅ 빌드 성공
- ✅ 메인 컴포넌트 73% 축소
- ✅ 재사용 가능한 훅/컴포넌트 생성
- ✅ 테스트 용이성 향상

## 다음 단계
- [ ] K-006: useAdminCRUD 제네릭 훅 생성
- [ ] K-007: Repository 패턴 전역 적용
