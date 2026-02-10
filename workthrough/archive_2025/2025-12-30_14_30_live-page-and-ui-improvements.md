# Live 페이지 생성 및 메인 UI 개선

## 개요
`/info/live` 전용 페이지를 cnine.kr 스타일로 신규 생성하고, 메인 페이지의 LiveMembers와 Notice 섹션 UI를 개선했습니다. LIVE 인디케이터를 조직도 페이지와 동일한 스타일로 통일했습니다.

## 주요 변경사항

### 개발한 것
- `/info/live` 페이지 신규 생성 (그리드 뷰, 필터 탭, 멤버 상세 모달)
- 시안색 LIVE 테두리 + 빨간색 LIVE 배지 스타일

### 수정한 것
- LiveMembers: 그리드 내 "더보기" 카드 → 헤더 "전체보기" 링크로 변경
- 메인 그리드: `1.5fr 1fr` → `1fr 1fr` (균등 너비)

### 개선한 것
- Notice 썸네일: 48px → 72px 확대
- LIVE 인디케이터 디자인 통일 (조직도/라이브/메인)

## 핵심 코드

```tsx
// LiveMembers.tsx - 헤더 "전체보기" 링크
<div className={styles.header}>
  <h3>LIVE MEMBERS</h3>
  <div className={styles.liveCount}>
    <span className={styles.liveCountDot} />
    {liveCount}
  </div>
  <div className={styles.line} />
  <Link href="/info/live" className={styles.viewAll}>
    전체보기 <ChevronRight size={16} />
  </Link>
</div>
```

## 결과
- ✅ 빌드 성공 (30 pages)
- ✅ 다크/라이트 모드 대응 완료

## 다음 단계
- PandaTV API 연동으로 실시간 라이브 상태 감지
- 라이브 페이지 멤버 클릭 시 프로필/방송 링크 연결
- LiveMembers 애니메이션 효과 추가 (입장/퇴장)
