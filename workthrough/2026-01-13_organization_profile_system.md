# 조직도 멤버 개인정보 시스템 구현

## 개요
조직도 페이지에서 멤버 클릭 시 상세 모달이 "상태/소속" 대신 개인정보(MBTI, 키, 나이, 생일, 혈액형, 취미, 특기, 좋아하는 음식, 자기소개)를 표시하도록 변경하고, Admin에서 이를 편집할 수 있는 기능을 추가했다.

## 주요 변경사항

### 1. 타입 시스템 확장
- `OrganizationRecord` 타입에 `member_profile` 필드 추가
- `MemberProfile` 인터페이스 정의 (nickname, mbti, age, height, birthday, bloodType, hobby, specialty, favoriteFood, introduction)
- Repository 인터페이스가 `OrganizationRecord[]` 반환하도록 변경

### 2. MemberDetailModal 개인정보 표시
- 기존 상태/소속 정보 대신 개인정보 그리드 표시
- 별명, MBTI, 나이, 키, 생일, 혈액형, 취미, 특기, 좋아하는 음식, 자기소개
- 소셜 링크 및 LIVE 배지 유지

### 3. Mock 데이터 14명 엑셀 멤버
- 린아(R대표), 가애(G대표), 나노(팀장)
- 아이린, 유나, 소아, 나나, 조이, 미라, 세라, 하나, 다인, 루나, 채원 (멤버)
- 각 멤버별 샘플 프로필 데이터 추가

### 4. Admin 조직도 페이지 개인정보 편집
- `member_profile` JSON 필드 파싱/저장 로직 추가
- 개인정보 섹션 폼 필드 추가 (별명, MBTI, 나이, 키, 생일, 혈액형, 취미, 특기, 좋아하는 음식, 자기소개)
- MBTI, 혈액형은 select 드롭다운으로 구현

## 수정된 파일
- `src/types/organization.ts` - MemberProfile, OrganizationRecord 타입
- `src/lib/repositories/types.ts` - IOrganizationRepository 반환 타입
- `src/lib/repositories/mock/index.ts` - Mock 데이터 및 repository
- `src/lib/repositories/supabase/organization.ts` - Supabase 매핑
- `src/lib/hooks/useOrganizationData.ts` - OrganizationRecord 사용
- `src/components/info/MemberDetailModal.tsx` - 개인정보 표시 UI
- `src/app/admin/organization/page.tsx` - 개인정보 편집 폼
- `src/app/admin/shared.module.css` - formSection 스타일 추가

## 결과
- 빌드 성공
- 14명 엑셀 멤버 레이아웃 정상 표시 (2 대표 + 1 팀장 + 11 멤버)
- 멤버 클릭 시 프로필 정보 정상 표시
- Admin에서 개인정보 편집 폼 추가 완료

## 다음 단계
- Supabase organization 테이블에 실제 member_profile 데이터 입력
- 이미지 업로드 기능 (프로필 사진)
- 소셜 링크 편집 기능 (Admin)
