# Admin DataTable Mantine 마이그레이션 및 추가 분석

## 개요

Admin CMS의 DataTable 컴포넌트를 CSS Modules에서 Mantine 컴포넌트로 마이그레이션했습니다. 추가로 마이그레이션 가능한 컴포넌트들을 분석했습니다.

## 주요 변경사항

### DataTable.tsx 마이그레이션

**변경 전:**
- 커스텀 CSS Modules (242 lines)
- 직접 구현한 테이블, 검색, 정렬, 페이지네이션

**변경 후:**
- Mantine 컴포넌트 활용 (CSS 0 lines)
- `Table`, `TextInput`, `ScrollArea`, `Pagination`, `Menu`, `ActionIcon`
- `@tabler/icons-react` 아이콘

**삭제된 파일:**
- `src/components/admin/DataTable.module.css` (242 lines)

### 적용된 Mantine 컴포넌트

| 기능 | Mantine 컴포넌트 |
|-----|-----------------|
| 테이블 | `Table`, `Table.Thead`, `Table.Tbody`, `Table.Tr`, `Table.Th`, `Table.Td` |
| 검색 | `TextInput` with `IconSearch` |
| 정렬 | `UnstyledButton` + `IconChevronUp/Down/Selector` |
| 페이지네이션 | `Pagination` |
| 액션 메뉴 | `Menu`, `Menu.Target`, `Menu.Dropdown`, `Menu.Item` |
| 레이아웃 | `Paper`, `Group`, `Center`, `ScrollArea` |
| 로딩 | `Loader` |

## 추가 마이그레이션 대상 분석

| 파일 | CSS Lines | 추천 컴포넌트 | 우선순위 |
|-----|-----------|-------------|---------|
| **CsvUploader.tsx** | 293 | `Dropzone`, `Alert`, `Table`, `Button` | ⭐⭐⭐⭐ |
| **StatsCard.tsx** | 75 | `Card`, `ThemeIcon`, `Text` | ⭐⭐⭐ |
| **Login (page.tsx)** | 208 | `TextInput`, `PasswordInput`, `Alert` | ⭐⭐⭐⭐ |
| **Signup (page.tsx)** | 234 | `PasswordInput`, `Alert`, `Stepper` | ⭐⭐⭐⭐ |

**총 잠재적 CSS 감소량:** ~595 lines (73%)

### 권장 마이그레이션 순서

1. **Phase 1 (Quick Wins)**
   - StatsCard.tsx - 가장 적은 노력
   - Login page - 폼 컴포넌트로 빠른 개선

2. **Phase 2 (Medium Effort)**
   - Signup page - Login과 유사한 패턴
   - CsvUploader.tsx - `@mantine/dropzone` 설치 필요

## 결과

- ✅ DataTable Mantine 마이그레이션 완료
- ✅ CSS 242 lines 제거
- ✅ 빌드 성공 (30/30 pages)
- ✅ 추가 마이그레이션 대상 4개 식별

## 핵심 코드

```tsx
// Mantine Table 기본 구조
import { Table, TextInput, Pagination, Menu, Paper } from '@mantine/core'
import { IconSearch, IconEdit, IconTrash } from '@tabler/icons-react'

<Paper withBorder radius="md">
  <TextInput placeholder="검색..." leftSection={<IconSearch />} />
  <Table striped highlightOnHover>
    <Table.Thead>...</Table.Thead>
    <Table.Tbody>{rows}</Table.Tbody>
  </Table>
  <Pagination total={totalPages} color="pink" />
</Paper>
```

## 다음 단계

- StatsCard.tsx → Mantine Card 마이그레이션
- Login/Signup → Mantine Form 컴포넌트 적용
- CsvUploader → @mantine/dropzone 도입
