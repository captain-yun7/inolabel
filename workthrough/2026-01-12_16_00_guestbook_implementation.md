# 방명록 기능 구현

## 개요
Top 1-3 후원자 헌정 페이지의 방명록 기능을 완전히 구현했습니다. DB 스키마부터 Mock 데이터, Hook, 컴포넌트 연동까지 전체 스택을 완료했습니다.

## 주요 변경사항

### 개발한 것
- **DB 스키마**: `supabase/migrations/20260112_create_guestbook_table.sql`
  - `tribute_guestbook` 테이블 생성
  - RLS 정책 설정 (읽기/쓰기/삭제 권한)
  - 자동 updated_at 트리거

- **TypeScript 타입**: `src/types/database.ts`
  - `TributeGuestbook` 타입 추가
  - Row/Insert/Update 타입 정의

- **Mock 데이터**: `src/lib/mock/guestbook.ts`
  - Top 1/2/3 후원자별 방명록 샘플 데이터
  - 멤버(엑셀부/크루부) 작성 방명록 구분
  - 조회 헬퍼 함수 (`getGuestbookByTributeUserId`, `getGuestbookByRank`)

- **Hook**: `src/lib/hooks/useGuestbook.ts`
  - 방명록 조회/작성 기능
  - Mock/Supabase 분기 처리
  - 로딩/에러/제출 상태 관리

### 수정한 것
- **TributeSections.tsx**: 방명록 섹션을 실제 Hook과 연동
  - 로딩/에러/빈 상태 UI
  - 멤버 뱃지 (EXCEL/CREW)
  - 로그인 사용자 작성 기능
  - 글자 수 카운터 (500자 제한)

- **TributeSections.module.css**: 새로운 스타일 추가
  - 멤버 아바타 스타일 (엑셀부 시안, 크루부 핑크)
  - 멤버 뱃지 스타일
  - 로딩/에러/빈 상태 스타일
  - 라이트 모드 대응

## 핵심 코드

### DB 스키마 (RLS 정책)
```sql
-- 모든 사용자가 승인된 방명록 조회 가능
CREATE POLICY "guestbook_select_approved" ON tribute_guestbook
  FOR SELECT USING (is_approved = TRUE AND is_deleted = FALSE);

-- 인증된 사용자만 방명록 작성 가능
CREATE POLICY "guestbook_insert_authenticated" ON tribute_guestbook
  FOR INSERT WITH CHECK (auth.uid()::text = author_id);
```

### useGuestbook Hook
```typescript
export function useGuestbook({ tributeUserId }: UseGuestbookOptions) {
  const { entries, isLoading, error, submitEntry, isSubmitting, canWrite } = ...

  // Mock 모드에서 실시간 작성 가능
  const submitEntry = async (message: string) => {
    const newEntry = { ...data, id: Date.now() }
    setEntries(prev => [newEntry, ...prev])
  }
}
```

## 결과
- ✅ 빌드 성공
- ✅ Mock 데이터 정상 동작
- ✅ 멤버 뱃지 표시 (EXCEL/CREW)
- ✅ 로그인 시 작성 가능
- ✅ 다크/라이트 모드 대응

## 다음 단계
- Supabase 자격 증명 설정 시 실제 DB 연동
- Admin 페이지에서 방명록 관리 기능 (승인/삭제)
- UI/UX 추가 개선점 분석 (전체 페이지 시각적 검증)
