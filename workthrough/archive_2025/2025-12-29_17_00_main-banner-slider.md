# 메인 배너 슬라이더 구현

## 개요
메인 페이지의 Hero 섹션을 정적 배너에서 자동 재생되는 캐러셀 슬라이더로 개선했습니다. Embla Carousel 라이브러리를 사용하여 5초 간격 자동 재생, 프로그레스 바 애니메이션, Dot/Arrow 네비게이션을 구현했습니다.

## 주요 변경사항

### 신규 패키지 설치
- `embla-carousel-react` - React용 캐러셀 라이브러리
- `embla-carousel-autoplay` - 자동 재생 플러그인

### 수정된 파일
- `src/components/Hero.tsx` - Embla Carousel로 전면 재작성
- `src/components/Hero.module.css` - 슬라이더 스타일 전면 재작성
- `src/lib/mock/data.ts` - Banner 인터페이스 및 mockBanners 데이터 추가

## 핵심 코드

```typescript
// Hero.tsx - Embla Carousel 설정
const [emblaRef, emblaApi] = useEmblaCarousel(
  { loop: true, skipSnaps: false },
  [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
);
```

```typescript
// data.ts - Banner 인터페이스
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  bgGradient: string;
  memberImages?: string[];
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
  displayOrder: number;
}
```

```css
/* 프로그레스 바 애니메이션 (Framer Motion) */
.dotProgress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
}
```

## 구현 기능
- 5초 간격 자동 슬라이드
- 마우스 호버 시 자동 재생 일시정지
- Dot 네비게이션 + 프로그레스 바 애니메이션
- 좌/우 화살표 네비게이션
- 슬라이드 카운터 (01/04)
- CTA 버튼 (각 배너별 링크)
- 반응형 디자인 (1024px, 768px, 480px)

## 결과
- 빌드 성공 (29개 페이지)
- TypeScript 오류 없음

## 다음 단계
- [ ] 후원 랭킹 게이지 바 시각화
- [ ] LIVE MEMBERS 핑크색 펄스 애니메이션
- [ ] VIP 페이지 프리미엄 UI 개선
- [ ] 시그리스트 재생 버튼 강화
