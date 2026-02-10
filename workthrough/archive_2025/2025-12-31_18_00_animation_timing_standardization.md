# 애니메이션 타이밍 함수 표준화 (Priority 3)

## 개요
프로젝트 전체의 애니메이션 타이밍 함수와 지속 시간을 CSS 변수로 표준화했습니다. 하드코딩된 cubic-bezier 값들을 시맨틱 변수로 교체하여 일관성과 유지보수성을 개선했습니다.

## 주요 변경사항
- **추가한 것**: globals.css에 완전한 애니메이션 시스템 구축
- **수정한 것**: 6개 파일의 하드코딩된 cubic-bezier를 CSS 변수로 교체

### 애니메이션 시스템
```css
/* Easing Functions */
--ease-default: ease;
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-spring: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Durations */
--duration-instant: 0.1s;
--duration-fast: 0.15s;
--duration-quick: 0.2s;
--duration-base: 0.3s;
--duration-medium: 0.4s;
--duration-slow: 0.5s;
--duration-slower: 1s;

/* Pre-composed Transitions */
--transition-fast: all var(--duration-quick) var(--ease-default);
--transition-base: all var(--duration-base) var(--ease-default);
--transition-smooth: all var(--duration-base) var(--ease-smooth);
--transition-bounce: all var(--duration-base) var(--ease-bounce);
--transition-spring: all var(--duration-base) var(--ease-spring);
```

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `globals.css` | 애니메이션 시스템 변수 추가 + 유틸리티 클래스 표준화 |
| `Shorts.module.css` | `--ease-spring` 적용 |
| `VOD.module.css` | `--ease-spring` 적용 |
| `OrgTree.module.css` | `--transition-spring` 적용 |
| `Hero.module.css` | `--transition-smooth` 적용 |
| `GaugeBar.module.css` | `--ease-bounce` + `--duration-slower` 적용 |

## 결과
- ✅ 빌드 성공 (3.8s)
- ✅ 30개 페이지 정적 생성 완료
- ✅ 애니메이션 일관성 확보

## 다음 단계
- Priority 4: 타이포그래피 스케일 정리
- 추가 개선: 나머지 컴포넌트의 `0.2s ease`, `0.3s ease` 등을 점진적으로 CSS 변수로 마이그레이션
