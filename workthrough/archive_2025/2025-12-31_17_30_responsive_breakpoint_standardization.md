# 반응형 브레이크포인트 표준화 (Priority 2)

## 개요
프로젝트 전체의 반응형 브레이크포인트를 표준화하고, 모바일(480px) 브레이크포인트가 누락된 주요 컴포넌트에 추가했습니다.

## 주요 변경사항
- **추가한 것**: globals.css에 브레이크포인트 시스템 문서화 및 컨테이너 변수
- **수정한 것**: 5개 컴포넌트에 모바일(480px) 브레이크포인트 추가

### 표준 브레이크포인트 시스템
```css
@media (max-width: 480px)  - Mobile (xs)
@media (max-width: 768px)  - Tablet (sm)
@media (max-width: 1024px) - Tablet Landscape (md)
@media (max-width: 1200px) - Desktop (lg)
@media (max-width: 1400px) - Wide Desktop (xl)
```

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `globals.css` | 브레이크포인트 시스템 문서화, 컨테이너 변수 추가 |
| `Notice.module.css` | 768px, 480px 브레이크포인트 추가 (신규) |
| `VOD.module.css` | 480px 브레이크포인트 추가 |
| `Shorts.module.css` | 480px 브레이크포인트 추가 |
| `RankingBoard.module.css` | 768px, 480px 브레이크포인트 추가 (신규) |
| `LiveMembers.module.css` | 480px 브레이크포인트 추가 |

## 핵심 코드
```css
/* globals.css - 컨테이너 변수 */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* 480px 모바일 브레이크포인트 예시 */
@media (max-width: 480px) {
  .card { width: 140px; }
  .title { font-size: 0.75rem; }
  .avatarWrapper { width: 60px; height: 60px; }
}
```

## 결과
- ✅ 빌드 성공 (3.1s)
- ✅ 30개 페이지 정적 생성 완료
- ✅ 모바일 UX 개선

## 다음 단계
- Priority 3: 애니메이션 타이밍 함수 통일
- Priority 4: 타이포그래피 스케일 정리
- 추가 개선: Footer, Timeline 등 다른 컴포넌트 480px 점검
