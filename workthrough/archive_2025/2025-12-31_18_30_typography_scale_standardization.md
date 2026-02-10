# 타이포그래피 스케일 표준화 (Priority 4)

## 개요
프로젝트 전체의 타이포그래피 스케일을 확장하고 주요 컴포넌트의 하드코딩된 font-size 값을 CSS 변수로 교체했습니다.

## 주요 변경사항
- **추가한 것**: globals.css에 완전한 타이포그래피 스케일 시스템 구축
- **수정한 것**: 3개 주요 컴포넌트의 font-size를 CSS 변수로 교체

### 타이포그래피 스케일 시스템
```css
/* Micro sizes (badges, labels, captions) */
--text-2xs: 0.625rem;  /* 10px */
--text-xs: 0.75rem;    /* 12px */

/* Small sizes (secondary text, metadata) */
--text-sm: 0.875rem;   /* 14px */

/* Base and body sizes */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */

/* Heading sizes */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.75rem;   /* 28px */
--text-4xl: 2rem;      /* 32px */
--text-5xl: 2.5rem;    /* 40px */
--text-6xl: 3rem;      /* 48px */
--text-7xl: 3.5rem;    /* 56px */
--text-8xl: 4.5rem;    /* 72px - Hero */

/* In-between sizes (migration compatibility) */
--text-caption: 0.65rem;   /* ~10.4px */
--text-label: 0.7rem;      /* ~11.2px */
--text-meta: 0.8rem;       /* ~12.8px */
--text-body-sm: 0.85rem;   /* ~13.6px */
--text-body: 0.9rem;       /* ~14.4px */
--text-body-lg: 0.95rem;   /* ~15.2px */
--text-subtitle: 1.1rem;   /* ~17.6px */
```

### 수정된 컴포넌트
| 파일 | 변경 내용 |
|------|----------|
| `globals.css` | 타이포그래피 스케일 시스템 확장 |
| `LiveMembers.module.css` | 5개 font-size → CSS 변수 |
| `Notice.module.css` | 6개 font-size → CSS 변수 |
| `RankingBoard.module.css` | 6개 font-size → CSS 변수 |

## 결과
- ✅ 빌드 성공 (3.6s)
- ✅ 30개 페이지 정적 생성 완료
- ✅ 타이포그래피 일관성 확보

## 다음 단계
- 나머지 컴포넌트의 font-size 점진적 마이그레이션
- Hero, Shorts, VOD 등 주요 컴포넌트 추가 적용
- 반응형 font-size 조정 (clamp 함수 활용 고려)
