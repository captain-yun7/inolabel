# 다크 테마 강제 적용 구현

## 개요
레퍼런스 이미지 기반으로 랭킹, 조직도, VIP 라운지 페이지에 다크 테마를 강제 적용. CSS 변수 오버라이드 방식으로 테마 토글과 무관하게 항상 다크 배경 유지.

## 주요 변경사항
- **랭킹 페이지** (`/ranking/total`): 전체 다크 배경 강제, Glass Podium 효과 유지
- **조직도 페이지** (`/info/org`): 다크 배경 + 탭 네비게이션 스타일 통일
- **VIP 라운지** (`/ranking/vip`): 골드 테마 + 다크 배경 조합 완성

## 핵심 코드
```css
/* 페이지별 다크 테마 강제 적용 패턴 */
.main {
  background: #09090b;
}

.main,
.main * {
  --background: #09090b;
  --background-secondary: #0f0f12;
  --surface: #121215;
  --card-bg: #0a0a0c;
  --card-border: rgba(255, 255, 255, 0.08);
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.5);
}
```

## 수정된 파일
```
src/app/ranking/total/page.module.css  - 다크 테마 변수 오버라이드
src/app/info/org/page.module.css       - 다크 테마 + 연결선 색상
src/app/ranking/vip/page.module.css    - 다크 테마 + 골드 액센트
```

## 결과
- ✅ 빌드 성공
- ✅ 브라우저 검증 완료 (3개 페이지)
- ✅ 상단 갭 제거됨
- ✅ 레퍼런스 이미지와 일치하는 다크 럭셔리 디자인

## 다음 단계
- 다른 info 페이지(live, sig, timeline)에도 동일한 다크 테마 적용
- 커뮤니티 페이지 다크 테마 적용
- 모바일 반응형 최적화
