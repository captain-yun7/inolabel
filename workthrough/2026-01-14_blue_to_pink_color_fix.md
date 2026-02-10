# 파란색 → 핑크 계열 색상 통일

## 개요
사이트 전반에 불필요하게 사용되던 파란색(blue) 요소들을 브랜드 핑크 계열로 통일했습니다.

## 변경사항

### 1. Hero 배너 배경 그라데이션 (메인 페이지)
- **파일**: `src/components/home/Hero.module.css`
- **변경 전**: 다크 블루 그라데이션 (`#1a1a2e`, `#16213e`, `#0f0f23`)
- **변경 후**: 다크 핑크 그라데이션 (`#1a1018`, `#251520`, `#0f0a0d`)
- 이미지 오버레이도 `rgba(22,33,62)` → `rgba(37,21,32)`로 변경

### 2. 캘린더 토요일 색상
- **파일**: `src/components/schedule/Calendar.tsx`, `CalendarGrid.tsx`
- **변경**: `text-blue-500` → `text-[var(--color-pink)]`
- 일요일(빨간색), 토요일(핑크), 평일(기본색)으로 통일

### 3. CSS 시맨틱 컬러
- **파일**: `src/app/globals.css`
- `--color-info`: `#3b82f6` → `#d84a9a` (핑크)
- `--color-collab`: `#60a5fa` → `#ff8ed4` (라이트 핑크)

### 4. Admin CSV 업로더 배지
- **파일**: `src/components/admin/CsvUploader.tsx`
- "업데이트" 배지: `color="blue"` → `color="pink"`

### 5. Navbar Admin 버튼
- **파일**: `src/components/Navbar.module.css`
- 보라색(`#a78bfa`, `rgba(139,92,246)`) → 핑크(`#fd68ba`, `rgba(253,104,186)`)

### 6. 캘린더 이벤트 컬러
- **파일**: `src/components/schedule/CalendarGrid.tsx`
- `notice`: `#a855f7` (보라) → `#fd68ba` (핑크)
- `collab`: `#00d4ff` → `#ff8ed4` (라이트 핑크)

## 유지된 시안색(#00d4ff)
CLAUDE.md 지침에 따라 LIVE 상태 표시는 시안색 유지:
- `--live-color: #00d4ff`
- 라이브 아이콘, 라이브 테두리 등

## 결과
- ✅ 빌드 성공
- ✅ 사이트 전반 핑크 톤앤매너 통일
- ✅ LIVE 상태는 시안색으로 차별화 유지

## 컬러 시스템 정리

| 용도 | 색상 | 코드 |
|------|------|------|
| 메인 핑크 | #fd68ba | 버튼, 호버, 강조 |
| 라이트 핑크 | #ff8ed4 | 콜라보, 서브 |
| 딥 핑크 | #c41e7f | 정보, 링크 |
| 라이브/시안 | #00d4ff | LIVE 상태만 |
| 골드 | #ffd700 | 1등, VIP |
