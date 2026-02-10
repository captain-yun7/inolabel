# 조직도 멤버 표시 및 텍스트 색상 일관성 수정

## 개요
조직도에서 엑셀 유닛 멤버가 표시되지 않는 문제를 해결하고, 페이지별 텍스트 색상 일관성을 검증했습니다.

## 주요 변경사항

### 1. 조직도 멤버 표시 문제 해결
- **파일**: `src/lib/hooks/useOrganizationData.ts`
- **원인**: Supabase 데이터의 역할(role)이 영문 대문자(`"MEMBER"`)인데, 코드는 한글(`"멤버"`)로 필터링
- **해결**: `getGroupedByRole` 함수가 한글/영문 역할 모두 처리하도록 수정

```typescript
// 변경 전
const regularMembers = memberList.filter(
  (m) => m.role === '멤버' || m.role === '크루'
)

// 변경 후
const regularMembers = memberList.filter(
  (m) => m.role === '멤버' || m.role === '크루' ||
         m.role === 'MEMBER' || m.role === 'CREW'
)
```

### 2. 텍스트 색상 일관성 검증
- **확인 페이지**: 메인(/), 랭킹(/ranking), 조직도(/rg/org), 히스토리(/rg/history)
- **결과**: 다크/라이트 모드 모두 일관된 텍스트 색상 확인
- **CSS 변수**: `--text-primary`, `--text-secondary`, `--text-muted` 등 정상 적용

## 결과
- ✅ 엑셀 유닛 12명 멤버 정상 표시
- ✅ 다크/라이트 모드 텍스트 색상 일관성 확인
- ✅ 총인원 배지 "총 12명" 정상 표시

## 다음 단계
- Supabase에서 역할(role) 데이터를 한글로 통일하는 것 고려
- 한백설 멤버에게 '대표' 역할 부여 필요 (현재 모두 MEMBER)
- 멤버 프로필 이미지 및 소셜 링크 데이터 추가
