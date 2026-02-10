# Phase 3 대형 페이지 분할

## 개요
618줄 `ranking/[userId]` 페이지와 517줄 `admin/donations` 페이지를 컴포넌트화하여 코드 가독성과 유지보수성을 개선했습니다.

## 주요 변경사항

### 1. ranking/[userId] 분할 (618줄 → 112줄)

**새 훅:**
- `useTributeData` - 헌정 페이지 데이터 페칭 및 접근 제어

**새 컴포넌트:**
| 컴포넌트 | 설명 |
|---------|------|
| `TributeGate` | 입장 애니메이션 |
| `TributeAccessDenied` | 접근 거부 화면 |
| `TributeNav` | 페이지 네비게이션 |
| `TributePageHero` | 히어로 섹션 |
| `TributeSections` | 모든 콘텐츠 섹션 (통합) |

**리팩토링 전:**
```typescript
// 618줄의 모놀리식 페이지
export default function TributePage() {
  // 데이터 페칭, 접근 제어, UI 모두 한 파일에
}
```

**리팩토링 후:**
```typescript
// 112줄의 간결한 페이지
export default function TributePage() {
  const { hallOfFameData, primaryHonor, isLoading, ... } = useTributeData({ userId })

  return (
    <div className={styles.main}>
      <TributeGate isVisible={showGate} ... />
      <TributeNav />
      <TributePageHero honor={primaryHonor} />
      <TributeSections honor={primaryHonor} allHonors={hallOfFameData} />
    </div>
  )
}
```

### 2. admin/donations 분할 (517줄 → 196줄)

**새 훅:**
- `useDonationsData` - CRUD 로직 + CSV 업로드

**새 컴포넌트:**
- `DonationModal` - 후원 등록/수정 모달

**리팩토링 전:**
```typescript
// 517줄 - 데이터 로직과 UI가 혼합
export default function DonationsPage() {
  const fetchData = async () => { ... }  // 40줄
  const handleCsvUpload = async () => { ... }  // 90줄
  // Modal JSX 100줄+
}
```

**리팩토링 후:**
```typescript
// 196줄 - 관심사 분리
export default function DonationsPage() {
  const { donations, addDonation, uploadCsv, ... } = useDonationsData()

  return (
    <div className={styles.page}>
      <DataTable data={donations} ... />
      <DonationModal isOpen={isModalOpen} ... />
    </div>
  )
}
```

### 3. UI 인덱스 추가

```
src/components/ui/index.ts (신규)
├── shadcn/ui: Button, Badge, Card, Dialog, Input, Select, Tabs, Tooltip
└── Custom: SectionHeader, SectionSkeleton, ThemeToggle
```

## 결과

| 페이지 | 이전 | 이후 | 감소율 |
|--------|------|------|--------|
| ranking/[userId] | 618줄 | 112줄 | -82% |
| admin/donations | 517줄 | 196줄 | -62% |

## 아키텍처 개선

| 원칙 | 적용 |
|------|------|
| **SRP** | 데이터 로직 → Hook, UI → Component |
| **DIP** | 페이지가 Hook 인터페이스에 의존 |
| **Facade** | `useTributeData`가 복잡한 데이터 로직 캡슐화 |

## 결과
- ✅ 빌드 성공
- ✅ 페이지 줄 수 대폭 감소
- ✅ 재사용 가능한 훅/컴포넌트 생성
- ✅ 테스트 용이성 향상 (훅 단위 테스트 가능)

## 다음 단계
- [ ] 다른 대형 페이지 분할 (필요 시)
- [ ] 훅 단위 테스트 작성
- [ ] 컴포넌트 Storybook 추가
