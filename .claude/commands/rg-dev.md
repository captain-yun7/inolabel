---
allowed-tools: Read, Edit, Write, Bash, Glob, Grep, Task, TodoWrite
description: RG Family 프로젝트 개발 워크플로우
argument-hint: [기능명 또는 작업 설명]
model: sonnet
---

# RG Family 개발 워크플로우

## 변수

- `$1`: 구현할 기능 또는 작업 설명

## 지침

1. **CLAUDE.md 참조**: 항상 `/CLAUDE.md` 파일을 먼저 읽어 프로젝트 컨텍스트 파악
2. **Mock 데이터 우선**: `USE_MOCK_DATA=true` 환경에서 개발, `src/lib/mock/data.ts` 활용
3. **CSS Modules**: 스타일은 반드시 `.module.css` 파일 사용
4. **다크/라이트 모드**: CSS 변수 (`--color-primary`, `--background` 등) 사용
5. **후원 단위**: PandaTV 하트 (♥) 단위 사용, SOOP 별풍선 아님
6. **빌드 검증**: 작업 완료 후 `npm run build` 실행하여 성공 확인

## 코드베이스 구조

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin CMS (11페이지)
│   ├── community/          # 커뮤니티 (자유/VIP)
│   ├── info/               # 정보 (조직도/시그/타임라인)
│   ├── ranking/            # 후원 랭킹
│   └── schedule/           # 일정 캘린더
├── components/             # 재사용 컴포넌트
│   ├── Hero.tsx            # 메인 배너 슬라이더
│   ├── LiveMembers.tsx     # 라이브 멤버 섹션
│   └── ranking/            # 랭킹 관련 컴포넌트
└── lib/
    ├── config.ts           # USE_MOCK_DATA 설정
    ├── mock/data.ts        # Mock 데이터
    └── hooks/              # Custom Hooks
```

## 워크플로우

### 단계 1: 컨텍스트 파악

**종속성:** 없음
**실행 모드:** 순차적

1. `/CLAUDE.md` 읽어 프로젝트 가이드라인 확인
2. 관련 파일 검색 및 분석
3. 기존 패턴 파악 (CSS 변수, 컴포넌트 구조)

---

### 단계 2: 구현 계획

**종속성:** 단계 1
**실행 모드:** 순차적

1. TodoWrite로 작업 목록 생성
2. 영향 받는 파일 목록화
3. Mock 데이터 필요 여부 확인

---

### 단계 3: 코드 구현

**종속성:** 단계 2
**실행 모드:** 혼합 (독립 파일은 병렬)

1. 컴포넌트/페이지 생성 또는 수정
2. CSS Module 스타일링 (다크/라이트 모드 지원)
3. Mock 데이터 추가 (필요시)
4. 각 작업 완료 시 TodoWrite 업데이트

---

### 단계 4: 검증 및 완료

**종속성:** 단계 3
**실행 모드:** 순차적

1. `npm run build` 실행하여 빌드 성공 확인
2. 브라우저에서 페이지 테스트 (MCP 도구 활용)
3. workthrough 문서 작성 (`/workthrough/` 폴더)
4. 변경사항 요약 보고

---

## 검증 명령

```bash
# TypeScript 빌드 검증
npm run build

# 개발 서버 실행
npm run dev

# 린트 검사 (선택)
npm run lint
```

## 완료 기준

- [ ] `npm run build` 성공
- [ ] 다크/라이트 모드 모두 정상 작동
- [ ] Mock 데이터로 UI 렌더링 확인
- [ ] CSS 변수 사용 (하드코딩 색상 없음)
- [ ] workthrough 문서 작성 완료

## 디자인 가이드

### 브랜드 컬러
- Primary: `#fd68ba` (핑크)
- LIVE Status: `#00d4ff` (시안)
- Gold: `#ffd700`, Silver: `#c0c0c0`, Bronze: `#cd7f32`

### 스타일 원칙
- Minimal & Refined Hip 디자인
- CSS 변수로 테마 관리
- Framer Motion 애니메이션
- 반응형 (768px, 480px 브레이크포인트)

## 보고서

작업 완료 후 다음 내용 보고:
1. 구현된 기능 요약
2. 수정된 파일 목록
3. 빌드 결과
4. 다음 단계 제안
