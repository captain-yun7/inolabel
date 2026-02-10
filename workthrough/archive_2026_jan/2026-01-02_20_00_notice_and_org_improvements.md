# 공지사항 및 조직도 개선

## 개요
메인페이지 공지사항 썸네일을 실제 이미지로 교체하고, 공지사항 상세 페이지를 프리미엄 디자인으로 개선했습니다. 조직도 헤더의 RG 텍스트를 로고 이미지로 교체했습니다.

## 주요 변경사항

### 개발한 것
- **공지 상세 Hero 섹션**: 썸네일 배경 + 오버레이 효과
- **이전/다음 글 네비게이션**: 공지 목록 내 순차 탐색 지원
- **공유 버튼**: Web Share API 활용, 클립보드 복사 fallback

### 수정한 것
- **Mock 공지 썸네일**: 존재하지 않는 `/assets/notices/...` → Unsplash 이미지 URL
- **조직도 로고**: "RG" 텍스트 → `rg_logo_3d_pink.png` 이미지

### 개선한 것
- **상세 페이지 라이트 모드**: 약 100줄의 CSS 오버라이드 추가
- **카테고리 뱃지**: excel/crew 별 색상 분리 (핑크/시안)

## 핵심 코드

```tsx
// 공지 상세 Hero 섹션
<div className={styles.hero}>
  {notice.thumbnailUrl && (
    <div className={styles.heroImage}>
      <Image src={notice.thumbnailUrl} alt={notice.title} fill />
      <div className={styles.heroOverlay} />
    </div>
  )}
  <div className={styles.heroContent}>
    <div className={styles.badges}>
      {notice.isPinned && <span className={styles.pinnedBadge}><Pin /> 중요</span>}
      <span className={styles.categoryBadge} data-category={notice.category}>...</span>
    </div>
    <h1>{notice.title}</h1>
  </div>
</div>

// 조직도 로고 이미지 교체
<div className={styles.logoCircle}>
  <Image
    src="/assets/logo/rg_logo_3d_pink.png"
    alt="RG"
    width={60}
    height={60}
    style={{ objectFit: "contain" }}
  />
</div>
```

## 결과
- ✅ 빌드 성공
- ✅ Mock 공지 썸네일 Unsplash 이미지로 교체
- ✅ 공지 상세 페이지 프리미엄 디자인 적용
- ✅ 조직도 RG 로고 이미지 교체

## 다음 단계
- Top 1-3 VIP 헌정 페이지 구현 (`/ranking/vip/[userId]`)
- 실시간 라이브 상태 PandaTV API 연동
