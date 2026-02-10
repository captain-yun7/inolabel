# RG Family 개발 가이드라인

## 프로젝트 개요
PandaTV 스트리머 팬 커뮤니티 공식 웹사이트

## 기술 스택
- **Frontend**: Next.js 16+ (App Router, React 19)
- **Styling**: CSS Modules + CSS Variables
- **Backend**: Supabase (Auth + Database + Storage)
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 디자인 시스템

### 테마: "Minimal & Refined Hip"
```css
/* 브랜드 컬러 */
--color-primary: #fd68ba;     /* 핑크 */
--color-primary-light: #ff8ed4;
--primary-deep: #fb37a3;

/* 배경 */
--background: #050505;
--surface: #121212;
--card-bg: #0a0a0a;

/* LIVE 상태 */
--live-color: #00d4ff;        /* 시안 */
```

### LIVE 멤버 스타일 규칙
1. **핑크 링**: 2px 그라디언트 테두리
2. **LIVE 배지**: 빨간색 (#ef4444), 하단 중앙
3. **비-라이브**: opacity 0.5, grayscale 0.4

## 코드 패턴

### Mock 데이터 분기
```typescript
import { USE_MOCK_DATA } from '@/lib/config'

if (USE_MOCK_DATA) {
  // Mock 데이터 사용
  return mockData
}
// Supabase 쿼리
```

### Supabase 훅 사용
```typescript
const supabase = useSupabase()
const { data, error } = await supabase.from('table').select()
```

### 후원 단위
```typescript
// PandaTV: 하트 (♥)
const formatAmount = (amount: number) => {
  if (amount >= 10000) return `${(amount / 10000).toFixed(1)}만 하트`
  return `${amount.toLocaleString()} 하트`
}
```

## 주요 컴포넌트

| 컴포넌트 | 위치 | 용도 |
|---------|------|------|
| Hero | `src/components/Hero.tsx` | 메인 배너 슬라이더 |
| LiveMembers | `src/components/LiveMembers.tsx` | 라이브 멤버 그리드 |
| RankingCard | `src/components/ranking/RankingCard.tsx` | 랭킹 카드 |
| MemberCard | `src/components/info/MemberCard.tsx` | 조직도 멤버 카드 |

## 리소스 파일

상세 가이드는 `resources/` 폴더 참조:
- `styling.md` - CSS 스타일링 규칙
- `components.md` - 컴포넌트 패턴
- `supabase.md` - Supabase 통합 가이드
