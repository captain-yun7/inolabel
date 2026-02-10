# UI 라이브러리 통합: Tailwind CSS 4 + shadcn/ui + Mantine

## 개요

RG Family 프로젝트에 세 가지 UI 라이브러리를 통합하여 프론트엔드 개발 생산성과 디자인 일관성을 향상시켰습니다.

## 주요 변경사항

### 1. Tailwind CSS 4.x 설치
- `tailwindcss`, `@tailwindcss/postcss` 설치
- CSS 기반 테마 설정 (`@theme` 블록)
- `postcss.config.mjs` 업데이트

### 2. shadcn/ui 설정
- `components.json` 설정 파일 생성
- `@radix-ui/react-slot`, `class-variance-authority` 설치
- `cn()` 유틸리티 함수 (`lib/utils.ts`)
- 기본 컴포넌트: Button, Card, Badge, Input

### 3. Mantine 7.x 설치
- `@mantine/core`, `@mantine/hooks`, `@mantine/form`
- `@mantine/dates`, `@mantine/notifications`, `@mantine/modals`
- MantineProvider + RG Family 커스텀 테마

## 설치된 패키지

```json
{
  "dependencies": {
    "@mantine/core": "^7.x",
    "@mantine/hooks": "^7.x",
    "@mantine/form": "^7.x",
    "@mantine/dates": "^7.x",
    "@mantine/notifications": "^7.x",
    "@mantine/modals": "^7.x",
    "@radix-ui/react-slot": "^1.x",
    "class-variance-authority": "^0.7.x",
    "dayjs": "^1.x"
  },
  "devDependencies": {
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x"
  }
}
```

## 파일 구조

```
src/
├── components/
│   └── ui/               # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── input.tsx
├── lib/
│   └── utils.ts          # cn() 유틸리티
└── app/
    └── globals.css       # @import "tailwindcss" + @theme
```

## 사용법

### shadcn/ui Button
```tsx
import { Button } from "@/components/ui/button";

<Button variant="pink">RG 브랜드 버튼</Button>
<Button variant="gold">VIP 골드 버튼</Button>
<Button variant="live">LIVE 버튼</Button>
```

### Mantine Notifications
```tsx
import { notifications } from '@mantine/notifications';

notifications.show({
  title: '알림',
  message: '성공적으로 저장되었습니다.',
  color: 'pink',
});
```

### Tailwind Utility Classes
```tsx
<div className="bg-primary text-white p-4 rounded-lg">
  Tailwind 스타일
</div>
```

## 결과

- ✅ 빌드 성공 (30/30 pages)
- ✅ CSS Modules + Tailwind + Mantine 공존
- ✅ RG Family 브랜드 컬러 통합

## 다음 단계

- 더 많은 shadcn/ui 컴포넌트 추가 (Dialog, Dropdown, Tabs 등)
- Mantine 폼 컴포넌트로 Admin CMS 개선
- 기존 CSS Modules를 점진적으로 Tailwind로 마이그레이션
