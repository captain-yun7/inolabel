# Calendar 컴포넌트 Mantine + Tailwind 마이그레이션

## 개요

Calendar 컴포넌트 시스템을 CSS Modules에서 Mantine + Tailwind CSS로 완전 마이그레이션.

## 주요 변경사항

### 마이그레이션 범위

| 컴포넌트 | 변경 전 | 변경 후 |
|---------|--------|--------|
| **Calendar.tsx** | CSS Modules | Mantine + Tailwind |
| **CalendarGrid.tsx** | CSS Modules | Mantine + Tailwind |
| **EventList.tsx** | CSS Modules | Mantine + Tailwind |
| **Calendar.module.css** | 808 lines | **삭제** |

### 적용된 Mantine 컴포넌트

```tsx
// Calendar.tsx
- Stack, Group, Paper, Text
- ActionIcon, SegmentedControl, Loader

// CalendarGrid.tsx
- Paper, Tooltip

// EventList.tsx
- Paper, Group, Stack, Text
- ActionIcon, Badge, ThemeIcon
```

### 추가 설치된 shadcn/ui 컴포넌트

```bash
npx shadcn@latest add dialog select tabs tooltip
```

생성된 파일:
- `src/components/ui/dialog.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`

## 코드 변환 예시

### Before (CSS Modules)
```tsx
import styles from './Calendar.module.css'

<div className={styles.container}>
  <div className={styles.header}>
    <button className={styles.navButton}>
```

### After (Mantine + Tailwind)
```tsx
import { Stack, Group, ActionIcon } from '@mantine/core'

<Stack gap="lg" className="max-w-[1100px] mx-auto px-4 md:px-8 pb-16">
  <Group justify="space-between" align="center">
    <ActionIcon
      variant="subtle"
      className="border border-[var(--glass-border)] bg-[var(--glass-bg)]"
    >
```

## 결과

- ✅ 빌드 성공 (30/30 pages)
- ✅ Calendar.module.css 808 lines 삭제
- ✅ 테마 시스템 CSS 변수 활용 유지
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
