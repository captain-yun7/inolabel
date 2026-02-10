# 사이드 배너 시스템 구현

## 개요
메인 페이지 양쪽 사이드바에 광고/프로모션 배너를 추가했습니다. MIRI STUDIO(좌측), Change Your Body(우측) 배너 이미지를 적용하고, 호버 효과와 다크/라이트 모드를 지원합니다.

## 주요 변경사항
- **추가한 것**: `SideBanner` 컴포넌트 신규 생성
- **추가한 것**: 배너 이미지 2개 (`public/banners/`)
- **수정한 것**: `page.tsx`에 배너 props 적용
- **수정한 것**: `layout/index.ts`에 SideBanner export 추가

## 핵심 코드

```tsx
// src/app/page.tsx
<PageLayout
  leftBanner={<SideBanner src="/banners/miri-studio.jpg" alt="MIRI STUDIO" />}
  rightBanner={<SideBanner src="/banners/change-your-body.jpg" alt="Body Profile" />}
>
```

```css
/* 호버 효과 */
.imageWrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(253, 104, 186, 0.2);
}
```

## 생성된 파일
| 파일 | 용도 |
|------|------|
| `src/components/layout/SideBanner.tsx` | 배너 컴포넌트 |
| `src/components/layout/SideBanner.module.css` | 배너 스타일 |
| `public/banners/miri-studio.jpg` | 좌측 배너 이미지 |
| `public/banners/change-your-body.jpg` | 우측 배너 이미지 |

## 결과
- ✅ 다크 모드에서 배너 정상 표시
- ✅ 라이트 모드에서 배너 정상 표시
- ✅ 호버 효과 (scale + glow) 작동
- ✅ 반응형 지원 (900px 이하 자동 숨김)

## 다음 단계
- 배너 클릭 시 외부 링크 연결 (href prop 활용)
- 조직도 그룹 헤더에 총 인원 수 추가 (cnine.kr 참조)
- 역할별 컬러 태그 시스템 구현
- Crew Unit 목업 데이터 추가

## 디자인 레퍼런스 문서
계획 파일 참조: `~/.claude/plans/woolly-greeting-hartmanis.md`
- cnine.kr 조직도 분석
- Dribbble pink gradient dark dashboard 레퍼런스
- 프론트엔드 개선 로드맵
