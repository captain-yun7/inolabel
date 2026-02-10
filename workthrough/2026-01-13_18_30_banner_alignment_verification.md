# 사이드 배너 정렬 검증 및 유튜브 썸네일 확인

## 개요
사이드 배너의 이미지 정렬을 개선하고, 유튜브 썸네일 표시 문제를 점검했습니다. 모든 기능이 정상 작동 확인되었습니다.

## 주요 변경사항
- **개선한 것**: SideBanner 컴포넌트의 이미지 표시 방식 최적화
- **확인한 것**: SHORTS, VOD 섹션의 유튜브 썸네일 정상 표시
- **확인한 것**: 콘솔 에러 없음

## 핵심 코드

```tsx
// SideBanner.tsx - 이미지 최적화
<Image
  src={src}
  alt={alt}
  width={160}
  height={480}
  sizes="(max-width: 900px) 0px, 160px"
  style={{ width: '100%', height: 'auto' }}
/>
```

```css
/* SideBanner.module.css - 스크롤 가능한 컨테이너 */
.bannerContainer {
  overflow-y: auto;
  scrollbar-width: none;
}
```

## 결과
- ✅ 좌측 배너 (MIRI STUDIO) 정상 표시
- ✅ 우측 배너 (Change Your Body) 정상 표시
- ✅ SHORTS 썸네일 6개 정상 로딩
- ✅ VOD 썸네일 4개 정상 로딩
- ✅ 콘솔 에러 없음

## 다음 단계
- 배너 클릭 시 외부 링크 연결 (href prop 활용)
- cnine.kr 참조하여 조직도 그룹 헤더에 총 인원 수 추가
- 역할별 컬러 태그 시스템 구현
