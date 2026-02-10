# 한국식 게시판 UI 개선

## 개요
커뮤니티 게시판과 공지사항 게시판을 한국에서 흔히 볼 수 있는 전통적인 게시판 형태로 리디자인했습니다. 테이블 기반 레이아웃, 검색 유형 선택, 카테고리 필터, 정렬 옵션 등 한국 커뮤니티 사이트의 표준 기능을 구현했습니다.

## 주요 변경사항

### 커뮤니티 게시판 (`/community/free`)
- **7컬럼 테이블 구조**: 번호, 분류, 제목, 글쓴이, 작성일, 조회, 추천
- **검색 기능 강화**: 검색 유형 선택 (전체/제목/작성자)
- **정렬 옵션**: 최신순/조회순/추천순
- **뱃지 시스템**: N(새글), HOT, 인기 뱃지
- **카테고리 분류**: 잡담, 정보, 후기, 질문
- **모바일 카드 뷰**: 반응형 모바일 레이아웃

### 공지사항 게시판 (`/notice`)
- **6컬럼 테이블 구조**: 번호, 분류, 제목, 작성자, 작성일, 조회
- **카테고리 탭 필터**: 전체/공지/이벤트/업데이트/안내
- **고정 공지 섹션**: 상단 고정 공지글 별도 스타일링
- **중요 뱃지**: 중요 공지 강조 표시
- **아이콘 헤더**: Bell 아이콘으로 페이지 특성 표현

## 핵심 코드

```typescript
// 검색 유형 선택 + 정렬 기능
const [searchType, setSearchType] = useState<'all' | 'title' | 'author'>('all')
const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes'>('latest')

// 고정글과 일반글 분리 (공지사항)
const pinnedNotices = filteredNotices.filter(n => n.isPinned)
const normalNotices = filteredNotices.filter(n => !n.isPinned)
```

```css
/* 테이블 그리드 구조 */
.tableHeader, .row {
  display: grid;
  grid-template-columns: 60px 80px 1fr 100px 90px 60px 60px;
}

/* 고정 공지 스타일 */
.pinnedSection {
  background: rgba(239, 68, 68, 0.03);
}
```

## 결과
- ✅ 빌드 성공
- ✅ 반응형 레이아웃 (데스크탑 테이블 / 모바일 카드)
- ✅ 한국식 게시판 UI/UX 구현

## 다음 단계
- 페이지네이션 실제 동작 구현 (현재 UI만)
- 글쓰기 버튼 기능 연결
- 검색 API 연동
- 댓글 수 실시간 업데이트
- VIP 게시판도 동일 스타일로 개선
