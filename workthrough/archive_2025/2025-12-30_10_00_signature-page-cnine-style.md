# 시그니처 페이지 cnine.kr 스타일 개선

## 개요
RG Family 시그니처 페이지(/info/sig)를 cnine.kr의 엑셀시그표 디자인을 참조하여 전면 개선. 6컬럼 그리드 갤러리, 카테고리 필터, 상세 모달을 구현함.

## 주요 변경사항

### 1. Mock 데이터 구조 개선
- **파일**: `src/lib/mock/signatures.ts`
- 번호 기반 시그니처 시스템 (1212, 1225, 1333 등)
- 멤버별 영상 데이터 구조 추가
- 카테고리 필터링 지원 (전체, 신규, 단체, 가격대별)

### 2. SigCard 컴포넌트 재설계
- **파일**: `src/components/info/SigCard.tsx`, `.module.css`
- 정사각형 썸네일 (aspect-ratio: 1/1)
- 좌측 하단 번호 뱃지 (큰 흰색 텍스트 + 그림자)
- 우측 하단 핑크 재생 버튼
- 하단 정보: 번호(핑크) + 제목

### 3. SigGallery 레이아웃 개선
- **파일**: `src/components/info/SigGallery.tsx`, `.module.css`
- 6컬럼 반응형 그리드 (1200px: 5열, 1024px: 4열, 768px: 3열, 480px: 2열)
- 가로 카테고리 필터 탭 (전체, 신규, 단체, 1000~2000, ...)
- 우측 검색바 + 클리어 버튼

### 4. SigDetailModal 신규 구현
- **파일**: `src/components/info/SigDetailModal.tsx`, `.module.css`
- 헤더: 재생 아이콘 + 시그니처 제목
- 멤버 탭: 가로 스크롤, 활성 탭 핑크 배경
- 비디오 플레이어: 썸네일 + 재생 버튼 오버레이
- 관련 영상 섹션: 가로 캐러셀
- ESC 키 닫기 지원
- z-index: 9999로 최상위 표시

## 핵심 코드

### 카테고리 필터 시스템
```typescript
export const signatureCategories = [
  { id: 'all', label: '전체' },
  { id: 'new', label: '신규' },
  { id: 'group', label: '단체' },
  { id: '1000-2000', label: '1000~2000' },
  // ...
] as const
```

### 6컬럼 반응형 그리드
```css
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

## 결과
- ✅ 빌드 성공 (29 페이지)
- ✅ 갤러리 6컬럼 레이아웃 정상 표시
- ✅ 카테고리 필터 작동
- ✅ 상세 모달 정상 표시 및 닫기 작동
- ✅ 멤버 탭 전환 작동
- ✅ 다크/라이트 모드 지원

## 다음 단계
- 실제 YouTube/영상 URL 연동
- Supabase 데이터베이스 연동
- 검색 기능 고도화 (디바운스, 하이라이트)
- 비디오 재생 시 iframe 로딩 최적화
