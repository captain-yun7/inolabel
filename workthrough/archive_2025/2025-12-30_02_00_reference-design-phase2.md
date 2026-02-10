# 레퍼런스 디자인 기반 UI 개선 Phase 2

## 개요
3개의 Gemini 레퍼런스 디자인 이미지를 기반으로 Shorts, Notice, VOD, VIP 페이지의 프리미엄 스타일을 개선했습니다.

## 주요 변경사항

### 1. Shorts 섹션 개선
- **카드 스타일**: 150px 너비, 16px 둥근 모서리
- **썸네일 효과**: 호버 시 scale(1.05) + 핑크 테두리
- **유닛 뱃지**: 엑셀부(핑크) / 크루부(시안) 색상 구분
- **플레이 오버레이**: 그라디언트 + 아이콘 확대 애니메이션

### 2. Notice 섹션 개선
- **RG 아이콘**: 핑크 그라디언트 24x24 로고 뱃지
- **카드 호버**: 좌측 핑크 라인 + translateX(4px) 효과
- **전체보기**: 버튼형 호버 스타일

### 3. VOD 섹션 개선
- **Featured**: 16:9 썸네일 + 호버 scale + 그라디언트 오버레이
- **List 아이템**: 호버 시 translateX(4px) + 핑크 테두리
- **유닛 뱃지**: Featured/List 모두 적용

### 4. VIP 페이지 개선
- **Hero 그라디언트**: 다크-핑크 멀티스톱 배경
- **별 애니메이션**: rotate + scale + 핑크 glow
- **타이틀**: 3rem + 핑크 그림자 효과
- **VIP 뱃지**: 골드 Crown + 핑크 배경

## 수정된 파일
- `src/components/Shorts.module.css` - 카드/썸네일/뱃지 스타일
- `src/components/Notice.tsx` - RG 아이콘 추가
- `src/components/Notice.module.css` - 카드/호버 스타일
- `src/components/VOD.module.css` - Featured/List 스타일
- `src/app/ranking/vip/page.module.css` - Hero/별 애니메이션

## 결과
- 빌드 성공 (29개 페이지)
- 다크/라이트 모드 정상 작동
- 반응형 레이아웃 적용

## 다음 단계
- RG Info 조직도 트리 구조 개선
- 랭킹 페이지 Top 3 포디움 디자인
- 타임라인 시즌별 카드형 레이아웃
