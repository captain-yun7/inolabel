# 레퍼런스 디자인 기반 UI 개선

## 개요
3개의 Gemini 레퍼런스 디자인 이미지를 분석하여 Hero 배너에 멤버 사진 및 뱃지 시스템 추가, VIP SECRET 페이지의 시그니처 갤러리 UI를 프리미엄 카드 스타일로 개선했습니다.

## 주요 변경사항

### 1. Hero 배너 개선
- **멤버 이미지 추가**: 좌측에 멤버 사진, 우측에 타이틀/설명
- **뱃지 시스템**: EXCEL, CREW UNIT, RG, NEW MEMBER 등 라벨 표시
- **반응형 대응**: 768px/480px 브레이크포인트 최적화

### 2. VIP SECRET 시그니처 갤러리
- **카드형 레이아웃**: 그라디언트 배경 + 호버 효과
- **타이틀 표시**: 각 카드 하단에 시그니처 이름
- **다운로드 오버레이**: 호버 시 다운로드 버튼 표시

### 3. Mock 데이터 확장
- `MockBanner` 타입에 `memberImageUrl`, `badges` 필드 추가
- `mockVipSignatures`에 실제 이미지 URL 적용
- `images.unsplash.com` 도메인 next.config에 추가

## 수정된 파일
- `src/lib/mock/banners.ts` - 배너 타입 확장
- `src/components/Hero.tsx` - 멤버 이미지/뱃지 렌더링
- `src/components/Hero.module.css` - 멤버 이미지 스타일
- `src/app/ranking/vip/[userId]/page.tsx` - 시그니처 갤러리 구조
- `src/app/ranking/vip/[userId]/page.module.css` - 카드형 갤러리 스타일
- `src/lib/mock/vip-content.ts` - VIP 시그니처 이미지 URL
- `next.config.ts` - Unsplash 이미지 도메인 추가

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 다크/라이트 모드 정상 작동
- ✅ Hero 배너 멤버 이미지 표시
- ✅ VIP 시그니처 갤러리 카드 UI

## 다음 단계
- 실제 멤버 사진으로 Mock 데이터 교체
- VIP 시그니처에 실제 사인 이미지 적용
- RG Info 조직도 트리 구조 개선
- 랭킹 페이지 Top 3 포디움 디자인
