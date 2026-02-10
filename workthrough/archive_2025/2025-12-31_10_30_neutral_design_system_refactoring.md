# 중립적 디자인 시스템 리팩토링

## 개요
과도한 핑크 색상과 펄스 애니메이션을 제거하고, 중립적인 Dark Professional 테마로 전환. 나중에 브랜드 컬러를 쉽게 추가할 수 있는 구조로 CSS 변수 체계를 재구성.

## 주요 변경사항
- **globals.css 전체 리팩토링**: 중립적 그레이 스케일(gray-50~gray-950) 기반, Brand Colors 섹션 분리
- **펄스 애니메이션 제거**: LiveMembers, Notice, org 페이지의 모든 pulse/glow 애니메이션 삭제
- **하드코딩 색상 제거**: rgba(253, 104, 186, ...) 등 핑크 색상을 CSS 변수로 교체
- **연결선 중립화**: org 페이지 조직도 연결선을 핑크에서 중립 그레이로 변경

## 핵심 코드

```css
/* Brand Colors (커스터마이징 영역) - 나중에 이 섹션만 수정 */
--accent: #ffffff;
--accent-muted: #a1a1aa;

/* Unit Colors - EXCEL / CREW 구분 */
--excel-color: #a1a1aa;
--crew-color: #71717a;

/* LIVE Status - 빨간색 (Universal) */
--live-color: #ef4444;
```

## 수정된 파일
- `src/app/globals.css` - 전체 리팩토링
- `src/components/LiveMembers.module.css` - 펄스 애니메이션 제거
- `src/components/Hero.module.css` - 그라디언트 단순화
- `src/components/Notice.module.css` - 핀 배지 애니메이션 제거
- `src/app/info/org/page.module.css` - 연결선 중립화
- `src/app/ranking/vip/[userId]/page.module.css` - 핑크 색상 제거

## 결과
- ✅ 빌드 성공
- ✅ 모든 30개 페이지 정상 생성
- ✅ 중립적이고 세련된 Dark Professional 테마 적용

## 다음 단계
- 브랜드 컬러 적용 시 `globals.css`의 Brand Colors 섹션만 수정
- 라이트 모드 테스트 및 미세 조정
- 추가 컴포넌트(Footer, Header 등) 스타일 일관성 검토
