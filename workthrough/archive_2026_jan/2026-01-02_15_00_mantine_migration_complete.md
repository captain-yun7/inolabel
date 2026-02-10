# Mantine 컴포넌트 마이그레이션 완료

## 개요

Admin 및 Auth 페이지의 주요 컴포넌트들을 CSS Modules에서 Mantine 컴포넌트로 마이그레이션하여 코드베이스를 간소화하고 일관성을 높였습니다.

## 주요 변경사항

### 마이그레이션된 컴포넌트

| 컴포넌트 | 삭제된 CSS Lines | 적용된 Mantine 컴포넌트 |
|---------|-----------------|----------------------|
| **DataTable.tsx** | 242 | Table, TextInput, Pagination, Menu, Paper |
| **StatsCard.tsx** | 75 | Paper, ThemeIcon, Text, Stack, Badge |
| **Login page** | 208 | TextInput, PasswordInput, Button, Paper, Alert |
| **Signup page** | 234 | TextInput, PasswordInput, Button, Paper, Alert, ThemeIcon |
| **CsvUploader.tsx** | 293 | Dropzone, Alert, Table, Button, ActionIcon |
| **총계** | **1,052 lines** | - |

### 설치된 패키지

```bash
npm install @mantine/dropzone
```

### 삭제된 CSS 파일

- `src/components/admin/DataTable.module.css`
- `src/components/admin/StatsCard.module.css`
- `src/components/admin/CsvUploader.module.css`
- `src/app/(auth)/login/page.module.css`
- `src/app/(auth)/signup/page.module.css`

## 핵심 패턴

### Mantine 컴포넌트 활용 예시

```tsx
// StatsCard - ThemeIcon + Paper
<Paper withBorder p="lg" radius="md">
  <Group align="flex-start" gap="md">
    <ThemeIcon size={48} radius="md" variant="light" color="pink">
      <Icon size={24} />
    </ThemeIcon>
    <Stack gap={4}>
      <Text size="sm" c="dimmed">{title}</Text>
      <Text size="xl" fw={700}>{value}</Text>
    </Stack>
  </Group>
</Paper>

// Login - PasswordInput + Alert
<PasswordInput
  label="비밀번호"
  leftSection={<IconLock size={18} />}
  size="md"
  radius="md"
/>

// CsvUploader - Dropzone
<Dropzone onDrop={handleDrop} accept={[MIME_TYPES.csv]}>
  <Dropzone.Accept>
    <IconUpload style={{ color: 'var(--mantine-color-pink-6)' }} />
  </Dropzone.Accept>
  <Dropzone.Idle>
    <IconUpload style={{ color: 'var(--mantine-color-dimmed)' }} />
  </Dropzone.Idle>
</Dropzone>
```

## 결과

- ✅ 빌드 성공 (30/30 pages)
- ✅ CSS 1,052 lines 제거
- ✅ Mantine 컴포넌트 통일된 스타일
- ✅ @mantine/dropzone 추가

## 다음 단계

- 추가 Admin 페이지 Mantine 마이그레이션 고려
- Mantine Modal, Notification 활용 확대
- 기존 CSS Modules → Tailwind 유틸리티 점진적 전환
