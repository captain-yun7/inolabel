# Implementation Plan: Top 1-3 헌정 페이지

**Status**: 🔄 In Progress
**Started**: 2025-12-30
**Last Updated**: 2025-12-30
**Estimated Completion**: 2025-12-31

---

**⚠️ CRITICAL INSTRUCTIONS**: After completing each phase:
1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 📅 Update "Last Updated" date above
5. 📝 Document learnings in Notes section
6. ➡️ Only then proceed to next phase

⛔ **DO NOT skip quality gates or proceed with failing checks**

---

## 📋 Overview

### Feature Description
Top 1-3 후원자를 위한 개인화된 헌정 페이지 구현. 각 등급(Gold/Silver/Bronze)별로 고유한 테마와 스트리머의 개인 메시지, 헌정 영상, 독점 이미지 갤러리를 제공합니다.

### Success Criteria
- [ ] Top 1 (Gold) 페이지: 황금 테마, 개인 메시지, 헌정 영상
- [ ] Top 2 (Silver) 페이지: 은색 테마, 개인 메시지, 헌정 영상
- [ ] Top 3 (Bronze) 페이지: 청동 테마, 개인 메시지, 헌정 영상
- [ ] 접근 제어: 해당 등급 사용자만 접근 가능
- [ ] 반응형 디자인: 모바일/데스크톱 최적화

### User Impact
Top 1-3 후원자에게 특별한 감사와 소속감을 제공하여 VIP 경험을 극대화합니다.

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| CSS Variables로 테마 구현 | 기존 다크/라이트 모드 시스템과 일관성 | 복잡한 애니메이션은 별도 처리 필요 |
| 기존 `[userId]` 페이지 확장 | 새 라우트 불필요, 코드 재사용 | 조건부 렌더링 복잡성 증가 |
| Mock 데이터 우선 개발 | Supabase 연동 전 빠른 UI 검증 | 추후 실제 데이터 연동 필요 |

---

## 📦 Dependencies

### Required Before Starting
- [ ] 현재 VIP 페이지 구조 이해 완료
- [ ] CSS Variables 시스템 검토 완료

### External Dependencies
- framer-motion: ^11.x (애니메이션)
- lucide-react: ^0.x (아이콘)
- next/image: 이미지 최적화

---

## 🧪 Test Strategy

### Testing Approach
**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature
| Test Type | Coverage Target | Purpose |
|-----------|-----------------|---------|
| **Unit Tests** | ≥80% | 유틸 함수, 타입 검증 |
| **Integration Tests** | Critical paths | 컴포넌트 렌더링, 접근 제어 |
| **E2E Tests** | Key user flows | 전체 페이지 플로우 |

### Coverage Requirements by Phase
- **Phase 1**: Mock 데이터 유틸 함수 (≥80%)
- **Phase 2**: 테마 적용 로직 (≥70%)
- **Phase 3**: UI 컴포넌트 스냅샷 테스트
- **Phase 4**: 접근 제어 로직 (≥90%)

---

## 🚀 Implementation Phases

### Phase 1: Foundation - 타입 및 Mock 데이터 확장
**Goal**: Top 1-3 전용 데이터 구조 및 Mock 데이터 구축
**Estimated Time**: 2 hours
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 1.1**: `getVipTributeByRank()` 함수 테스트
  - File(s): `src/lib/mock/__tests__/vip-tribute.test.ts`
  - Expected: Tests FAIL (함수 미존재)
  - Test cases:
    - rank 1 → Gold 테마 데이터 반환
    - rank 2 → Silver 테마 데이터 반환
    - rank 3 → Bronze 테마 데이터 반환
    - rank 4+ → null 반환

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 1.2**: `VipTributeData` 타입 정의
  - File(s): `src/types/common.ts`
  - Goal: 확장된 타입 정의
  - Details:
    ```typescript
    interface VipTributeData {
      rank: 1 | 2 | 3
      theme: 'gold' | 'silver' | 'bronze'
      profile: ProfileData
      personalMessage: string
      dedicationVideo: VideoData | null
      exclusiveGallery: GalleryImage[]
      donationTimeline: DonationItem[]
    }
    ```

- [ ] **Task 1.3**: Mock 데이터 확장
  - File(s): `src/lib/mock/vip-tribute.ts`
  - Goal: Top 1-3별 Mock 데이터 생성
  - Details:
    - Gold (#FFD700) 테마 데이터
    - Silver (#C0C0C0) 테마 데이터
    - Bronze (#CD7F32) 테마 데이터

- [ ] **Task 1.4**: `getVipTributeByRank()` 유틸 함수
  - File(s): `src/lib/mock/vip-tribute.ts`
  - Goal: Test 1.1 통과

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 1.5**: 코드 정리
  - [ ] 기존 `vip-content.ts`와 중복 제거
  - [ ] export 구조 정리 (`src/lib/mock/index.ts`)
  - [ ] 타입 일관성 검증

#### Quality Gate ✋

**TDD Compliance**:
- [ ] Tests were written FIRST and initially failed
- [ ] Production code written to make tests pass
- [ ] Coverage ≥80% for utility functions

**Build & Tests**:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes

**Validation Commands**:
```bash
npm run build
npm run lint
npx tsc --noEmit
```

---

### Phase 2: Core - Rank별 테마 시스템 구현
**Goal**: 골드/실버/브론즈 테마 CSS 및 컴포넌트
**Estimated Time**: 3 hours
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 2.1**: `TributeHero` 컴포넌트 렌더링 테스트
  - File(s): `src/components/__tests__/TributeHero.test.tsx`
  - Expected: Tests FAIL (컴포넌트 미존재)
  - Test cases:
    - rank=1 → Gold 클래스 적용
    - rank=2 → Silver 클래스 적용
    - rank=3 → Bronze 클래스 적용

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 2.2**: CSS Variables 추가
  - File(s): `src/app/globals.css`
  - Goal: 등급별 테마 변수 정의
  - Details:
    ```css
    /* Tribute Themes */
    --tribute-gold: #FFD700;
    --tribute-gold-glow: rgba(255, 215, 0, 0.4);
    --tribute-silver: #C0C0C0;
    --tribute-silver-glow: rgba(192, 192, 192, 0.4);
    --tribute-bronze: #CD7F32;
    --tribute-bronze-glow: rgba(205, 127, 50, 0.4);
    ```

- [ ] **Task 2.3**: `TributeHero` 컴포넌트
  - File(s): `src/components/tribute/TributeHero.tsx`, `TributeHero.module.css`
  - Goal: 등급별 Hero 섹션
  - Details:
    - 왕관 아이콘 (Gold: 3개, Silver: 2개, Bronze: 1개)
    - 파티클 애니메이션
    - 등급별 배경 글로우

- [ ] **Task 2.4**: `TributeBadge` 컴포넌트
  - File(s): `src/components/tribute/TributeBadge.tsx`
  - Goal: 등급 표시 뱃지
  - Details: Crown + #1, #2, #3 표시

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 2.5**: 테마 일관성 검증
  - [ ] 다크/라이트 모드 호환성
  - [ ] CSS 변수 네이밍 일관성
  - [ ] 컴포넌트 export 정리

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] 브라우저에서 3개 테마 모두 확인

**Manual Test Checklist**:
- [ ] Gold 테마 렌더링 확인
- [ ] Silver 테마 렌더링 확인
- [ ] Bronze 테마 렌더링 확인
- [ ] 애니메이션 동작 확인

**Validation Commands**:
```bash
npm run build
npm run lint
```

---

### Phase 3: Enhancement - 헌정 페이지 UI 완성
**Goal**: 개인화된 헌정 페이지 완성
**Estimated Time**: 3 hours
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 3.1**: 헌정 페이지 렌더링 테스트
  - File(s): `src/app/ranking/vip/[userId]/__tests__/page.test.tsx`
  - Test cases:
    - Top 1 데이터로 Gold 테마 렌더링
    - 헌정 영상 섹션 표시
    - 갤러리 이미지 다운로드 링크 동작

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 3.2**: 헌정 영상 섹션 개선
  - File(s): `src/app/ranking/vip/[userId]/page.tsx`
  - Goal: 프리미엄 비디오 플레이어 UI
  - Details:
    - 커스텀 썸네일
    - 테마 색상 적용된 재생 버튼
    - 로딩 상태 표시

- [ ] **Task 3.3**: 개인 메시지 섹션
  - File(s): `src/app/ranking/vip/[userId]/page.module.css`
  - Goal: 프리미엄 카드 디자인
  - Details:
    - 등급별 테두리 색상
    - 필기체 스타일 메시지
    - 서명 이미지 (옵션)

- [ ] **Task 3.4**: Exclusive Gift Gallery
  - File(s): `src/components/tribute/GiftGallery.tsx`
  - Goal: 이미지 갤러리 + 다운로드
  - Details:
    - Masonry/Grid 레이아웃
    - 이미지 확대 모달
    - 다운로드 버튼

- [ ] **Task 3.5**: 후원 히스토리 타임라인
  - File(s): `src/components/tribute/DonationTimeline.tsx`
  - Goal: 시각적 타임라인
  - Details:
    - 날짜별 그룹핑
    - 금액 표시 (하트 단위)
    - 메시지 미리보기

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 3.6**: 반응형 최적화
  - [ ] 모바일 레이아웃 검증
  - [ ] 태블릿 레이아웃 검증
  - [ ] 이미지 최적화 확인

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] 반응형 테스트 (320px, 768px, 1024px, 1440px)

**Manual Test Checklist**:
- [ ] 헌정 영상 재생 확인
- [ ] 갤러리 이미지 다운로드 동작
- [ ] 모바일에서 레이아웃 확인
- [ ] 다크/라이트 모드 확인

---

### Phase 4: Integration - 접근 제어 및 연동
**Goal**: 보안 및 전체 시스템 통합
**Estimated Time**: 2 hours
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 4.1**: 접근 제어 테스트
  - Test cases:
    - Top 1 사용자 → Top 1 페이지 접근 가능
    - Top 4 사용자 → Top 1 페이지 접근 불가
    - 비로그인 사용자 → 로그인 페이지 리다이렉트

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 4.2**: 접근 제어 로직
  - File(s): `src/app/ranking/vip/[userId]/page.tsx`
  - Goal: 등급별 접근 제한
  - Details:
    - 사용자 rank 확인
    - 해당 페이지 접근 권한 검증
    - 비인가 시 에러 페이지 표시

- [ ] **Task 4.3**: VIP 라운지 링크 연동
  - File(s): `src/app/ranking/vip/page.tsx`
  - Goal: Top 1-3 배너에서 개인 페이지 연결
  - Details:
    - 동적 링크 생성
    - 등급별 배너 스타일

- [ ] **Task 4.4**: 에러/권한없음 UI
  - File(s): `src/app/ranking/vip/[userId]/page.tsx`
  - Goal: 접근 불가 시 안내 화면
  - Details:
    - 권한 부족 메시지
    - VIP 라운지로 돌아가기 버튼

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 4.5**: 에러 핸들링 강화
  - [ ] 네트워크 에러 처리
  - [ ] 데이터 없음 처리
  - [ ] 로딩 상태 최적화

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] 전체 플로우 E2E 테스트

**Manual Test Checklist**:
- [ ] Top 1 접근 → 성공
- [ ] Top 4 접근 시도 → 접근 불가 화면
- [ ] VIP 라운지에서 링크 동작
- [ ] 비로그인 시 리다이렉트

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Mock 데이터와 실제 데이터 불일치 | Medium | Medium | Supabase 스키마와 Mock 타입 동기화 유지 |
| 접근 제어 우회 가능성 | Low | High | 서버 사이드에서 추가 검증 (향후) |
| 이미지 로딩 성능 저하 | Medium | Medium | next/image 최적화 + lazy loading |
| 테마 CSS 충돌 | Low | Low | CSS Modules로 스코프 격리 |

---

## 🔄 Rollback Strategy

### If Phase 1 Fails
- Undo: `src/types/common.ts`, `src/lib/mock/vip-tribute.ts`
- Restore: `src/lib/mock/index.ts` export

### If Phase 2 Fails
- Undo: `src/components/tribute/` 폴더 삭제
- Restore: `globals.css` CSS Variables

### If Phase 3 Fails
- Restore: `src/app/ranking/vip/[userId]/page.tsx` 원본
- Undo: `page.module.css` 변경사항

### If Phase 4 Fails
- Restore: 접근 제어 로직 제거
- 기존 VIP 페이지 로직 복원

---

## 📊 Progress Tracking

### Completion Status
- **Phase 1**: ⏳ 0%
- **Phase 2**: ⏳ 0%
- **Phase 3**: ⏳ 0%
- **Phase 4**: ⏳ 0%

**Overall Progress**: 0% complete

### Time Tracking
| Phase | Estimated | Actual | Variance |
|-------|-----------|--------|----------|
| Phase 1 | 2 hours | - | - |
| Phase 2 | 3 hours | - | - |
| Phase 3 | 3 hours | - | - |
| Phase 4 | 2 hours | - | - |
| **Total** | 10 hours | - | - |

---

## 📝 Notes & Learnings

### Implementation Notes
- (작업 중 발견한 인사이트 기록)

### Blockers Encountered
- (발생한 블로커와 해결 방법 기록)

---

## 📚 References

### Existing Files
- `/src/app/ranking/vip/[userId]/page.tsx` - 현재 VIP 페이지
- `/src/lib/mock/vip-content.ts` - VIP Mock 데이터
- `/src/types/database.ts` - Supabase 타입 정의

### Design Reference
- CLAUDE.md: "Minimal & Refined Hip" 스타일 가이드
- 골드: #FFD700, 실버: #C0C0C0, 브론즈: #CD7F32

---

## ✅ Final Checklist

**Before marking plan as COMPLETE**:
- [ ] All phases completed with quality gates passed
- [ ] Full integration testing performed
- [ ] Documentation updated (CLAUDE.md Phase 1 완료 체크)
- [ ] 브라우저 테스트 완료 (Chrome, Safari)
- [ ] 반응형 테스트 완료
- [ ] Mock 데이터 → Supabase 연동 준비 완료

---

**Plan Status**: 🔄 Ready to Start
**Next Action**: Phase 1 시작 - 타입 및 Mock 데이터 확장
**Blocked By**: None
