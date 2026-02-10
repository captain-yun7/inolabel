# 메인 페이지 UI 개선 및 VIP 차별화 제거

## 개요
배너 크기 축소, VOD 섹션 좌우 높이 균형, 라이트 모드 무게감 강화, VIP 페이지 골드/실버/브론즈 차별화를 제거하고 단일 프리미엄 핑크 테마로 통일하는 작업을 수행했습니다.

## 주요 변경사항

### 1. 배너 크기 축소
- **변경 전**: 600px → **변경 후**: 420px
- 반응형: 1024px(380px), 768px(320px), 480px(280px)
- 타이틀 폰트 크기도 비례하여 축소

### 2. VOD 섹션 좌우 높이 균형
- `align-items: stretch` 적용으로 Featured/List 동일 높이
- 그리드 비율: `1.2fr 1fr` 유지

### 3. 라이트 모드 디자인 강화
- 배경: `#f5f5f7` → `#f0eff2` (더 따뜻한 톤)
- 텍스트 대비 강화: `#1a1a1a` → `#0f0f0f`
- 그림자 더 뚜렷하게 적용

### 4. VIP 페이지 차별화 제거
- 골드/실버/브론즈 테마 삭제
- 모든 VIP 동일한 프리미엄 핑크 테마 적용
- rankBadge: 숫자 → "VIP" 텍스트로 통일

## 수정된 파일
- `src/components/Hero.module.css` - 배너 높이/폰트 축소
- `src/components/VOD.module.css` - 좌우 높이 균형
- `src/components/Shorts.module.css` - margin 조정
- `src/app/globals.css` - 라이트 모드 개선
- `src/app/ranking/vip/[userId]/page.tsx` - VIP 차별화 제거
- `src/app/ranking/vip/[userId]/page.module.css` - 단일 테마 적용

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 다크/라이트 모드 정상 작동
- ✅ VOD 섹션 좌우 높이 균형 확인

## 다음 단계
- Top 1-3 헌정 페이지 (`/ranking/vip/[userId]`) 콘텐츠 보강
- PandaTV API 연동 (실시간 라이브 상태)
- 모바일 반응형 추가 테스트
