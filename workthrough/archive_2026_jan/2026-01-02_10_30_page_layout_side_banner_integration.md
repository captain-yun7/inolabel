# PageLayout 사이드 배너 시스템 전체 페이지 적용

## 개요
모든 페이지에 애드센스/배너 광고를 위한 사이드 여백을 제공하는 PageLayout 컴포넌트를 적용했습니다. 양쪽에 160px 배너 영역이 추가되어 광고 수익화 기반이 마련되었습니다.

## 주요 변경사항

### 새로 생성한 것
- **PageLayout 컴포넌트** (`/src/components/layout/PageLayout.tsx`)
  - 그리드 레이아웃: `160px | 콘텐츠 | 160px`
  - Sticky 사이드바로 스크롤 시에도 광고 노출
  - 900px 이하에서 사이드바 자동 숨김 (모바일 대응)
  - `fullWidth`, `showSideBanners` 옵션으로 유연한 사용

### 적용한 페이지 (10개)
1. **메인 홈페이지** (`/`) - Navbar, Footer 포함
2. **타임라인** (`/timeline`) - Navbar, Footer 추가
3. **조직도** (`/organization`) - 기존 Nav 유지, Footer 추가
4. **시그니처** (`/signature`) - Navbar, Footer 추가
5. **캘린더** (`/schedule`) - Navbar, Footer 추가
6. **공지사항** (`/notice`) - Navbar, Footer 추가
7. **랭킹** (`/ranking`) - 기존 Nav 유지, Footer 추가
8. **VIP 라운지** (`/ranking/vip`) - Footer 추가
9. **커뮤니티 자유** (`/community/free`) - Navbar, Footer 추가
10. **커뮤니티 VIP** (`/community/vip`) - Navbar, Footer 추가

## 핵심 코드

```tsx
// PageLayout 사용법
<PageLayout>
  <div className={styles.main}>
    <Navbar />
    {/* 콘텐츠 */}
    <Footer />
  </div>
</PageLayout>

// 커스텀 배너
<PageLayout
  leftBanner={<AdComponent />}
  rightBanner={<AdComponent />}
>
  {children}
</PageLayout>
```

```css
/* 반응형 그리드 */
.wrapper {
  display: grid;
  grid-template-columns: 160px 1fr 160px;
}

@media (max-width: 900px) {
  .wrapper { display: block; }
  .sidebarLeft, .sidebarRight { display: none; }
}
```

## 결과
- ✅ 빌드 성공 (30/30 페이지)
- ✅ 모든 페이지 PageLayout 적용 완료
- ✅ 반응형 디자인 유지
- ✅ 라이트/다크 모드 지원

## 다음 단계
- 실제 광고 배너 컴포넌트 개발
- Google AdSense 또는 자체 광고 시스템 연동
- 배너 위치별 A/B 테스트 인프라 구축
- 배너 클릭/노출 통계 수집 시스템
