# Black + Selective Pink 디자인 리팩토링

## 개요
RG Family 프로젝트 전체에 걸쳐 핑크 컬러 과다 사용 문제를 해결하고, "Black + Selective Pink" 컨셉으로 디자인을 정제했습니다. 핑크(#fd68ba, #fb37a3)는 CTA, 활성 상태, 강조 요소에만 선택적으로 사용하고, 일반 UI는 세련된 뉴트럴 다크 톤으로 변경했습니다.

## 주요 변경사항

### 1. 조직도 페이지 (`/info/org/page.module.css`)
- **토글 버튼**: 핑크 → 블랙/화이트 (활성 상태)
- **연결선**: 핑크 그라디언트 → 뉴트럴 그레이
- **유닛 라벨**: 핑크 배경 → 뉴트럴
- **아바타 호버**: 핑크 테두리 → 뉴트럴 (LIVE 멤버는 핑크 유지)
- **모달 요소**: 핑크 → 뉴트럴

### 2. LiveMembers 컴포넌트 (`LiveMembers.module.css`)
- **라이브 카운트 뱃지**: 핑크 배경 → 뉴트럴
- **전체보기 호버**: 핑크 → 뉴트럴
- **비라이브 아바타 호버**: 핑크 → 뉴트럴
- **유지**: LIVE 점 표시, avatarLive 테두리/글로우

### 3. Hero 배너 (`Hero.module.css`)
- **서브타이틀**: 핑크 텍스트/배경 → 뉴트럴 그레이
- **배경 글로우**: 핑크 불투명도 0.15 → 0.08
- **유지**: 첫 번째 뱃지, CTA 버튼, 프로그레스 바

### 4. Notice 컴포넌트 (`Notice.module.css`)
- **전체보기 호버**: 핑크 → 뉴트럴
- **태그**: 핑크 → 뉴트럴 그레이
- **유지**: 핀 북마크 (악센트 하이라이트)

### 5. Shorts/VOD 컴포넌트
- **화살표 버튼 호버**: 핑크 → 뉴트럴
- **썸네일 배경**: 핑크 그라디언트 제거
- **카드 호버**: 핑크 테두리/그림자 → 뉴트럴

### 6. 전역 스타일 (`globals.css`)
- **card:hover**: 핑크 테두리/그림자 → 뉴트럴
- **btn-ghost:hover**: 핑크 → 뉴트럴

## 핵심 코드

```css
/* 뉴트럴 호버 패턴 */
.element:hover {
  border-color: var(--overlay-strong);
  background: var(--overlay-subtle);
  color: var(--text-primary);
}

/* 악센트 유지 요소 */
.ctaButton { background: var(--color-primary); }
.liveBadge { background: var(--color-primary-deep); }
.pinBadge { background: var(--color-primary-deep); }
.progressBar { background: var(--color-primary); }
```

## 결과
- 메인 페이지, 조직도 페이지 브라우저 확인 완료
- "Black + Selective Pink" 컨셉 일관성 있게 적용
- 핑크는 CTA, LIVE 상태, 핀 북마크, 프로그레스 바에만 사용

## 다음 단계
- 랭킹 페이지 (`/ranking/*`) 동일 패턴 검토
- VIP 페이지 핑크 사용 검토
- 다크/라이트 모드 전환 시 컬러 일관성 확인
