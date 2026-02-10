# 핑크 과용 → 뉴트럴 기반 색상 최적화

## 개요
사이트 전반에서 지나치게 사용되던 핑크 색상을 뉴트럴(흰/검/회) 기반으로 정리하고, 핑크는 포인트 요소에만 선택적으로 사용하도록 개선했습니다.

## 디자인 원칙
- **뉴트럴 컬러** (85-90%): 배경, 텍스트, 카드, 테두리
- **포인트 컬러** (10-15%): CTA 버튼, 활성 상태, 중요 강조, 로고

## 주요 변경사항

### 1. 조직도 페이지 (page.module.css)
**가장 큰 변경** - 80건 이상의 핑크 사용을 뉴트럴로 전환

#### 다크 모드 Crew 테마
```css
/* Before: 핑크틴트 배경 */
.crewTheme {
  background: linear-gradient(#0a0508, #0d0609, #100810, #0a0508);
}

/* After: 순수 블랙 */
.crewTheme {
  background: linear-gradient(#050505, #0a0a0a, #080808, #050505);
}
```

- 배경 그라데이션: 핑크틴트 → 순수 블랙
- 연결선(connector, verticalLine, horizontalLine): 핑크 → 화이트/그레이
- 멤버 카드 호버: 핑크 글로우 → 뉴트럴 쉐도우
- 로고 서클: 핑크 → 뉴트럴
- 활성 버튼: 핑크 배경 제거, 핑크 테두리만 유지

#### 라이트 모드 Crew 테마
```css
/* Before: 핑크틴트 배경 */
.crewTheme {
  background: linear-gradient(#fdf7fa, #fef5f9, #fdf7fa, #fdf5f8);
}

/* After: 순수 화이트/그레이 */
.crewTheme {
  background: linear-gradient(#fafafa, #f5f5f5, #f8f8f8, #fafafa);
}
```

### 2. 유지된 핑크 사용 (포인트 요소)
- **로고 타이틀**: 브랜드 핑크 그라데이션 유지
- **활성 상태 텍스트/테두리**: 핑크 포인트 유지
- **LIVE 표시**: 시안색(#00d4ff) 유지 (CLAUDE.md 지침)

### 3. 분석 후 유지 결정 파일
| 파일 | 핑크 사용 | 유지 이유 |
|------|----------|----------|
| TributeSections.module.css | 34건 | Tribute 특별 페이지, 콘텐츠 포인트 |
| Timeline.module.css | 14건 | 호버 효과 + 크루부/엑셀부 구분 |
| Hero.module.css | 8건 | 로고 포인트 + 미세 배경 패턴 |
| LiveMembers.module.css | 8건 | LIVE 멤버 강조 |

## 결과
- ✅ 빌드 성공
- ✅ 조직도 페이지 뉴트럴 기반으로 정리
- ✅ 핑크는 포인트 요소(로고, 활성상태, CTA)에만 사용
- ✅ 다크/라이트 모드 양쪽 적용

## 다음 단계
- 사용자 피드백 수집 후 추가 조정
- 새 컴포넌트 추가 시 뉴트럴 기반 원칙 적용
