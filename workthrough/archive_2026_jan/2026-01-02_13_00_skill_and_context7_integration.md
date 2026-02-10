# 프론트엔드 스킬 및 Context7 통합 업데이트

## 개요

`frontend-design` 스킬과 CLAUDE.md를 새로운 UI 스택(Tailwind CSS 4, shadcn/ui, Mantine)과 Context7 MCP 통합을 반영하여 업데이트했습니다.

## 주요 변경사항

### 1. frontend-design 스킬 v2.0 업데이트

**파일**: `~/.claude/skills/frontend-design/skill.md`

**추가된 내용:**
- Tailwind CSS 4.x `@theme` 기반 설정 가이드
- shadcn/ui 컴포넌트 사용법 (Button, Card, Badge)
- Mantine 폼/테이블/알림 패턴
- Context7 MCP 문서 조회 통합
- 라이브러리 선택 가이드 테이블
- Framer Motion 애니메이션 프리셋

### 2. CLAUDE.md 기술 스택 업데이트

**변경 전:**
```
Styling: CSS Modules + CSS Variables
```

**변경 후:**
```
Styling: Tailwind CSS 4 + CSS Modules + CSS Variables
UI Components: shadcn/ui (Radix) + Mantine 7
```

### 3. Context7 통합 가이드 추가

```bash
# Tailwind CSS 4
context7: resolve tailwindcss -> get /docs/installation

# shadcn/ui
context7: resolve shadcn-ui -> get /docs/components/button

# Mantine
context7: resolve mantine -> get /docs/form/use-form
```

**트리거 조건:**
- `Tailwind`, `className` → Tailwind 문서
- `shadcn`, `ui/`, `variant` → shadcn/ui 문서
- `Mantine`, `useForm` → Mantine 문서

## 결과

- ✅ 빌드 성공 (30/30 pages)
- ✅ frontend-design 스킬 v2.0 적용
- ✅ CLAUDE.md Context7 통합 반영

## 사용 예시

프론트엔드 작업 시 자동 워크플로우:

```
1. 사용자: "버튼 컴포넌트 추가해줘"
2. 트리거: "버튼" → frontend-design 스킬
3. Context7: shadcn-ui 버튼 문서 조회
4. 구현: <Button variant="pink">버튼</Button>
5. 검증: claude-in-chrome 스크린샷
6. 문서화: workthrough-v2
```

## 다음 단계

- shadcn/ui Dialog, Tabs, Avatar 컴포넌트 추가
- Admin 페이지 Mantine Table/Form 마이그레이션
- 핵심 컴포넌트 Tailwind 유틸리티 적용
