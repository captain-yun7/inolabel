# LIVE 멤버 표시 스타일 통일

## 개요
메인 페이지와 상세 페이지(info/live, info/org)의 LIVE 멤버 표시 스타일을 인스타그램 스토리 스타일의 핑크 링으로 통일하고, LIVE 배지를 빨간색으로 변경함.

## 주요 변경사항

### 1. 공통 LIVE 링 스타일 (핑크 그라디언트)
- **스타일**: 2px 두께의 핑크 그라디언트 링 (#fd68ba → #ff8ed4 → #fd68ba)
- **글로우**: 12px box-shadow (rgba(253, 104, 186, 0.5))
- **배지**: 빨간색 (#ef4444), 하단 중앙 또는 우상단 배치

### 2. 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `LiveMembers.module.css` | 메인 페이지 LIVE 스타일 |
| `LiveMembers.tsx` | isLive 클래스 적용 |
| `Notice.module.css` | 그라디언트 오버레이 제거 |
| `info/live/page.module.css` | 상세 페이지 LIVE 스타일 |
| `info/live/page.tsx` | isLive 클래스 적용 |
| `info/org/page.module.css` | 조직도 LIVE 스타일 |
| `MemberCard.tsx/css` | 공용 컴포넌트 스타일 |
| `MemberDetailModal.tsx/css` | 모달 LIVE 스타일 |

### 3. 핵심 CSS 패턴
```css
/* 핑크 링 */
.avatarWrapper.isLive::before {
  background: linear-gradient(135deg, #fd68ba 0%, #ff8ed4 50%, #fd68ba 100%);
  inset: -2px;
}

/* LIVE 배지 (빨간색) */
.liveBadge {
  background: #ef4444;
  color: white;
  bottom: -4px; left: 50%; transform: translateX(-50%);
}

/* 비-라이브 멤버 (흐릿) */
.avatar:not(.avatarLive) {
  opacity: 0.5;
  filter: grayscale(0.4) brightness(0.85);
}
```

## 결과
- ✅ 빌드 성공
- ✅ 메인/상세 페이지 LIVE 스타일 통일
- ✅ 핑크 링 + 빨간 LIVE 배지 조합
- ✅ 비-라이브 멤버 시각적 구분

## 다음 단계
- [ ] 다크 모드에서 핑크 글로우 가시성 추가 테스트
- [ ] 모바일에서 링 두께 반응형 조정 검토
