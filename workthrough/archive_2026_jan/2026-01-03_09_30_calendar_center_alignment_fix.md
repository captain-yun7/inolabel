# Calendar 중앙 정렬 수정 및 Mantine 마이그레이션 완료

## 개요

Calendar 컴포넌트의 중앙 정렬 이슈 수정 및 CSS Modules에서 Mantine + Tailwind로 완전 마이그레이션 완료.

## 주요 변경사항

### 중앙 정렬 수정

**문제**: 월 네비게이션과 필터가 `justify="space-between"`으로 인해 좌우로 분산 배치됨

**해결**: `Stack align="center"` + 개별 `Group justify="center"` 구조로 변경

```tsx
// Before
<Group justify="space-between" align="center">
  <ActionIcon>←</ActionIcon>
  <Text>2026년 1월</Text>
  <ActionIcon>→</ActionIcon>
  <SegmentedControl />
</Group>

// After
<Stack gap="md" align="center">
  <Group gap="lg" align="center" justify="center">
    <ActionIcon>←</ActionIcon>
    <Text>2026년 1월</Text>
    <ActionIcon>→</ActionIcon>
  </Group>
  <SegmentedControl />
</Stack>
```

### Mantine 마이그레이션 범위

| 컴포넌트 | 적용된 Mantine 컴포넌트 |
|---------|------------------------|
| Calendar.tsx | Stack, Group, ActionIcon, SegmentedControl, Loader, Text |
| CalendarGrid.tsx | motion.button + Tailwind |
| EventList.tsx | Paper, Group, Stack, Text, ActionIcon, Badge, ThemeIcon |

### 삭제된 파일

- `Calendar.module.css` (808 lines)

## 결과

- ✅ 빌드 성공
- ✅ 캘린더 중앙 정렬 완료
- ✅ 테마 시스템 CSS 변수 유지
- ✅ 다크/라이트 모드 자동 지원

## 총 CSS 절감

| 마이그레이션 | 삭제된 CSS Lines |
|-------------|-----------------|
| Admin/Auth (이전) | 1,052 |
| Calendar (이번) | 808 |
| **총계** | **1,860 lines** |

## 다음 단계

- [ ] Timeline 컴포넌트 Mantine 마이그레이션
- [ ] OrgTree 컴포넌트 Mantine 마이그레이션
- [ ] 남은 CSS Modules 정리
