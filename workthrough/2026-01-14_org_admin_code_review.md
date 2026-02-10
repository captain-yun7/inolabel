# 조직도 멤버 표시 및 admin 계정 추가

## 개요
조직도에서 엑셀 유닛 14명 멤버가 정상 표시되도록 수정하고, admin/admin 계정을 추가했습니다.

## 주요 변경사항

### 1. 조직도 역할 필터링 수정
- **파일**: `src/lib/hooks/useOrganizationData.ts`
- **원인**: Supabase 데이터 역할이 영문(`"MEMBER"`)인데 코드는 한글(`"멤버"`)로 필터링
- **해결**: 한글/영문 역할 모두 지원하도록 수정

### 2. 린아/가애 공동 대표 활성화
- **스크립트**: `scripts/activate-leaders.ts`, `scripts/update-roles.ts`
- `is_active: true` 설정
- 역할을 "대표"로 통일 (R대표/G대표 → 대표)
- position_order: 린아(1), 가애(2)

### 3. 14명 멤버 순서 정리
- **스크립트**: `scripts/update-positions.ts`
- 대표 2명 + 멤버 12명 순서로 position_order 설정

### 4. admin 계정 추가
- **스크립트**: `scripts/create-admin.ts`
- 이메일: admin@rg-family.local
- 비밀번호: admin
- Supabase Auth + profiles 테이블에 추가

## 코드 점검 결과
- ✅ 빌드 성공 (TypeScript 오류 없음)
- ✅ ESLint 주요 오류 없음 (경고만 존재)
- ✅ 35개 페이지 정적 생성 성공

## 다음 단계
- Supabase에서 멤버별 `member_profile` 데이터 입력 (MBTI, 키, 나이)
- 역할(role) 데이터 한글로 통일 고려
- 멤버 프로필 이미지 업로드
