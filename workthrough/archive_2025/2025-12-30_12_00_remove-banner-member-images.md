# 배너 호버 멤버 이미지 제거

## 개요
히어로 배너에서 호버링 멤버 캐릭터 이미지를 제거하여 더 깔끔한 배너 디자인을 구현했습니다.

## 주요 변경사항

### 제거한 것
- `Hero.tsx`: memberImages 렌더링 코드 제거 (196-211행)
- `Hero.module.css`: characters, characterContainer, characterImage 관련 CSS 전체 제거
- `banners.ts`: memberImages 필드 및 getMemberCharacterImage import 제거

### 정리한 것
- 반응형 CSS에서 character 관련 스타일 제거 (768px, 480px 브레이크포인트)
- MockBanner 인터페이스에서 memberImages 필드 제거

## 핵심 코드

```typescript
// 제거된 코드 (Hero.tsx)
{banner.memberImages && banner.memberImages.length > 0 && (
  <div className={styles.characters}>
    {banner.memberImages.map((imgSrc, idx) => (
      <div key={idx} className={styles.characterContainer}>
        <Image src={imgSrc} ... />
      </div>
    ))}
  </div>
)}
```

```css
/* 제거된 CSS (Hero.module.css) */
.characters { ... }
.characterContainer { ... }
.characterImage { ... }
@keyframes characterFloat { ... }
```

## 결과
- 빌드 성공 (29 페이지)
- 배너가 텍스트 콘텐츠와 그라디언트 배경만 표시
- 더 깔끔하고 미니멀한 배너 UI

## 다음 단계
- 배너에 Unsplash 배경 이미지 추가 (선택)
- 배너별 커스텀 배경 에셋 적용 (선택)
- 실제 이벤트/시즌 배너 콘텐츠 추가
