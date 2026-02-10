# UI 개선 작업 - Navbar 아이콘 + Hero 배너 리디자인

## 개요
디자이너 피드백을 반영하여 Navbar 드롭다운에 아이콘을 추가하고, Hero 배너를 MOONA DOA 스타일로 리디자인했습니다.

## 주요 변경사항

### 1. Navbar 드롭다운 아이콘 추가
- **수정한 것**: 각 메뉴 항목에 Lucide 아이콘 추가
- **파일**: `src/components/Navbar.tsx`, `Navbar.module.css`
- **아이콘 목록**:
  - RG 정보: Radio, Users, Music2, History
  - 후원 랭킹: Trophy, Calendar
  - 공지사항: Bell, MessageSquare
  - 커뮤니티: Sparkles

### 2. Hero 배너 MOONA DOA 스타일 리디자인
- **개발한 것**: 기존 슬라이더를 린아 양쪽 + 로고 중앙 레이아웃으로 완전 대체
- **파일**: `src/components/home/Hero.tsx`, `Hero.module.css`
- **레이아웃**:
  - 왼쪽 30%: 린아 이미지 + 그라데이션 오버레이
  - 중앙 40%: RG 로고 + "RG FAMILY" 텍스트 + 글로우 효과
  - 오른쪽 30%: 린아 이미지 (반전) + 그라데이션 오버레이

## 핵심 코드

```css
/* Hero 레이아웃 */
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 200px;
}

.leftSection, .rightSection {
  flex: 0 0 30%;
}

.centerSection {
  flex: 0 0 40%;
}
```

```typescript
// Navbar 아이콘 구조
const navItems = [
  {
    label: "RG 정보",
    subItems: [
      { label: "라이브", href: "/rg/live", icon: Radio },
      { label: "조직도", href: "/rg/org", icon: Users },
      // ...
    ]
  }
]
```

## 결과
- 빌드 성공
- 브라우저 검증 완료
- 반응형 지원 (태블릿/모바일)

## 다음 단계
- 린아 외 다른 멤버 이미지 추가 검토
- Hero 배너 애니메이션 효과 강화 검토
- LIVE 상태 연동 시 Hero 영역 활용 가능
