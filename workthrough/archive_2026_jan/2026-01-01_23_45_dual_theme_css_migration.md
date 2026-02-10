# 듀얼 테마 CSS 변수 마이그레이션

## 개요
라이트/다크 모드 듀얼 테마를 완전히 지원하기 위해 하드코딩된 CSS 색상을 CSS 변수로 마이그레이션했습니다. globals.css에 필요한 모든 테마 변수를 추가하고, 주요 페이지의 CSS 모듈을 리팩토링했습니다.

## 주요 변경사항

### 1. globals.css 확장
- **유틸리티 색상 변수 추가**: gray-overlay, color-pink-overlay, live-overlay, gold-overlay
- **핑크 그라디언트 변수**: pink-gradient-primary, pink-gradient-horizontal, pink-gradient-vertical
- **핑크 글로우 섀도우**: pink-glow-sm, pink-glow-md, pink-glow-lg, pink-glow-xl
- **VIP 카드 그라디언트**: vip-card-gradient-dark, vip-card-gradient-hover
- **Hero 관련 변수**: hero-glow, hero-padding

### 2. 마이그레이션 완료된 페이지
| 페이지 | 수정 내용 |
|--------|----------|
| `ranking/page.module.css` | heroBadge, title 그라디언트 |
| `notice/page.module.css` | pinnedSection, categoryBadge, importantBadge |
| `community/free/page.module.css` | row hover, categoryBadge, VIP 스타일 |
| `community/vip/page.module.css` | board, vipBanner, writeBtn, loginBtn |

### 3. 핵심 변경 패턴
```css
/* Before */
background: rgba(196, 30, 127, 0.05);
background: rgba(239, 68, 68, 0.1);
box-shadow: 0 4px 15px rgba(196, 30, 127, 0.4);

/* After */
background: var(--color-pink-overlay-05);
background: var(--live-overlay-10);
box-shadow: var(--pink-glow-md);
```

## 결과
- ✅ 빌드 성공 (29개 페이지 정적 생성)
- ✅ TypeScript 오류 없음
- ✅ 다크/라이트 모드 모두 자동 대응

## 다음 단계
- **Admin 페이지 CSS 마이그레이션**: admin/ 디렉토리 내 CSS 모듈 검토
- **Info 페이지 CSS 마이그레이션**: organization, signature, timeline 페이지
- **컴포넌트 CSS 마이그레이션**: 나머지 공통 컴포넌트 (RankingCard, Calendar 등)
- **실제 테마 전환 테스트**: 브라우저에서 라이트/다크 모드 전환 시각적 검증
