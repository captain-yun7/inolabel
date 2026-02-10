# Black & Pink 테마 리팩토링 - 세련된 럭셔리 디자인

## 개요
남성 시청자/사용자를 위한 세련되고 럭셔리한 디자인으로 전환. 기존의 여성적인 핑크에서 중성적이고 고급스러운 Rose Gold 톤으로 변경. EXCEL은 핑크, CREW는 블랙으로 명확히 구분.

## 주요 변경사항

### 1. 글로벌 CSS 색상 시스템 재정의
**파일**: `src/app/globals.css`

```css
/* 기존 - 여성적인 핫핑크 */
--color-primary: #fd68ba;
--live-color: #E8A4C9;           /* 핑크 */
--crew-color: #B8809E;           /* 핑크 */

/* 변경 후 - 세련된 Rose Gold 팔레트 */
--color-primary: #D4A5A5;        /* Dusty Rose - 중성적 */
--color-primary-light: #E8C4C4;  /* Light Rose */
--color-primary-deep: #C48B8B;   /* Deep Rose */
--color-primary-darker: #A66F6F; /* Burgundy Accent */

/* LIVE 상태 - 유니버설 레드 (성별 무관) */
--live-color: #EF4444;
--live-glow: rgba(239, 68, 68, 0.5);

/* Unit 구분: EXCEL = Pink, CREW = Black */
--excel-color: #D4A5A5;          /* Rose Gold */
--crew-color: #E5E5E5;           /* Light Gray on Black */
--crew-bg: rgba(30, 30, 30, 0.9);
```

### 2. LiveMembers 컴포넌트
**파일**: `src/components/LiveMembers.module.css`

- LIVE 뱃지: 핑크 → 레드 그라디언트 (`#EF4444` → `#DC2626`)
- 아바타 라이브 테두리: 핑크 → 레드 글로우
- 라이브 카운트 인디케이터: 레드 테마

### 3. Hero 컴포넌트
**파일**: `src/components/Hero.module.css`

- 배경 그라디언트: Rose Gold 톤
- CTA 버튼 쉐도우: 부드러운 Rose Gold
- 네비게이션 버튼 호버: Rose Gold 글로우

### 4. Info/Live 페이지
**파일**: `src/app/info/live/page.module.css`

- 라이브 인디케이터: 레드 테마
- 탭 액티브 상태: Rose Gold

### 5. Ranking 페이지
**파일**: `src/app/ranking/total/page.module.css`

- Hero 그라디언트: Rose Gold 톤
- 포디움 베이스 이펙트: Rose Gold

## 색상 팔레트

| 용도 | 기존 | 변경 | HEX |
|------|------|------|-----|
| Primary | 핫핑크 | Dusty Rose | #D4A5A5 |
| Primary Deep | 딥핑크 | Deep Rose | #C48B8B |
| LIVE 상태 | 핑크 | **레드** | #EF4444 |
| EXCEL Unit | 핑크 | Rose Gold | #D4A5A5 |
| CREW Unit | 핑크 | **블랙** | rgba(30,30,30,0.9) |

## 디자인 원칙

1. **중성적 색상**: 남성 사용자도 편안한 Rose Gold 톤
2. **LIVE = 레드**: 유니버설한 라이브 인디케이터 컬러
3. **유닛 구분 명확화**: EXCEL(핑크) vs CREW(블랙)
4. **럭셔리 느낌**: 채도를 낮추고 메탈릭한 질감 유지

## 결과
- 빌드 성공
- 세련되고 고급스러운 Black & Pink 테마 완성
- 남성 시청자도 편안하게 이용 가능한 디자인

## 다음 단계
- CREW 관련 컴포넌트에서 블랙 테마 적용 확인
- 라이트 모드 색상 대비 검증
- 사용자 피드백 수집
