# Phase 4 Tribute 텍스트 시인성 개선

## 개요
Tribute 페이지의 텍스트 시인성을 개선하고 라이트 모드 지원을 추가했습니다. 다크 테마에서 흐리게 보이던 텍스트들의 opacity 값을 높이고, 라이트 모드 전환 시에도 가독성이 유지되도록 스타일을 추가했습니다.

## 주요 변경사항

### 1. TributePageHero.module.css

**다크 모드 개선:**
- `heroSubtitle`: opacity 0.7 → 0.85
- `heroSubtitle strong`: 강조 색상 + font-weight 추가

**라이트 모드 추가:**
```css
:global([data-theme='light']) .heroTitle { color: #1a1a1a; }
:global([data-theme='light']) .heroSubtitle { color: rgba(0, 0, 0, 0.75); }
:global([data-theme='light']) .vipBadge { background 밝기 증가; }
```

### 2. TributeSections.module.css

**다크 모드 개선:**
| 요소 | 이전 | 이후 |
|------|------|------|
| videoLabel | 0.7 | 0.85 |
| videoPlaceholder | 0.5 | 0.7 |
| videoInfo p | 0.6 | 0.75 |
| secretHeader p | 0.6 | 0.75 |
| signaturePlaceholder | 0.5 | 0.7 |
| emptySectionContent | 0.4 | 0.6 |
| emptySectionContent h3 | 0.6 | 0.75 |
| adminHint | 0.3 | 0.5 |

**라이트 모드 추가:**
- messageCard, videoWrapper, secretSection 배경 조정
- 모든 텍스트 요소에 검정색 기반 색상 적용
- 카드/배경 요소에 밝은 테마 그라데이션

## 결과
- ✅ 빌드 성공
- ✅ 다크 모드 텍스트 가독성 향상
- ✅ 라이트 모드 전환 지원

## 다음 단계
- [ ] 다른 페이지 라이트 모드 지원 확장
- [ ] 시각적 QA 테스트 (브라우저에서 확인)
