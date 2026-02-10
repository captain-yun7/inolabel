# Admin 리팩토링 및 훅 통합

## 개요
Admin 페이지들의 모달 컴포넌트 통합, banners 페이지 훅 분리, RankingList 유틸리티 함수 통합을 진행했습니다. Kaizen 방법론에 따른 점진적 개선 작업입니다.

## 주요 변경사항

### 1. AdminModal 컴포넌트 적용 (9개 페이지)
- **적용 페이지**: seasons, notices, schedules, signatures, members, organization, vip-rewards, media, banners
- **변경 내용**: 각 페이지의 `AnimatePresence/motion` 모달 패턴을 `AdminModal` 공통 컴포넌트로 교체
- **결과**: 모달 관련 보일러플레이트 ~35줄/페이지 감소, 일관된 UX

```typescript
// Before (각 페이지마다 ~90줄 모달 코드)
<AnimatePresence>
  {isModalOpen && (
    <motion.div className={styles.modalOverlay}>
      <motion.div className={styles.modal}>
        <div className={styles.modalHeader}>...</div>
        <div className={styles.modalBody}>...</div>
        <div className={styles.modalFooter}>...</div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

// After (~55줄)
<AdminModal
  isOpen={isModalOpen}
  title="제목"
  onClose={closeModal}
  onSave={handleSave}
>
  {/* 폼 필드만 */}
</AdminModal>
```

### 2. Banners 페이지 훅 분리
- **파일**: `src/app/admin/banners/page.tsx`
- **변경**: 인라인 CRUD 로직 → `useAdminCRUD` 훅 사용
- **LOC 감소**: 387줄 → 339줄 (48줄 감소)
- **특수 기능 유지**: 이미지 미리보기(`previewUrl`), 활성화 토글(`handleToggleActive`)

```typescript
// useAdminCRUD 적용
const {
  items: banners,
  isLoading,
  isModalOpen,
  handleSave,
  handleDelete,
  refetch,
} = useAdminCRUD<Banner>({
  tableName: 'banners',
  defaultItem: { ... },
  fromDbFormat: (row) => ({ ... }),
  toDbFormat: (item) => ({ ... }),
  validate: (item) => { ... },
})
```

### 3. RankingList 유틸리티 통합
- **변경**: `RankingList.tsx`의 로컬 `formatCompactNumber` 함수를 공유 `formatAmountShort`로 교체
- **이유**: `src/lib/utils/format.ts`에 동일한 기능이 이미 존재

```typescript
// Before (로컬 중복 함수)
const formatCompactNumber = (amount: number): string => { ... }

// After (공유 유틸리티 사용)
import { formatAmountShort } from "@/lib/utils";
```

### 4. CSS 분리 분석 (연기)
- **대상**: `src/app/rg/org/page.module.css` (1,521 LOC)
- **결정**: 낮은 ROI로 연기
  - 단일 페이지 전용 스타일
  - 라이트 모드 오버라이드가 전체에 분산
  - 분리 시 page.tsx 수정 필요량 큼

## 결과
- 빌드 성공 (31 페이지)
- Admin 페이지 일관성 향상
- 코드 중복 감소

## 다음 단계

### 단기
- [ ] Admin pages 추가 테스트 (모달 동작 검증)
- [ ] CSS 변수 통합 검토 (랭킹 색상 gold/silver/bronze)

### 중기
- [ ] DataTable 컴포넌트 개선 (정렬, 필터링 기능)
- [ ] 에러 핸들링 통합 (Toast 알림으로 전환)
