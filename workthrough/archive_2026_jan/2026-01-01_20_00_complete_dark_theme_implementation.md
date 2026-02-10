# 전체 다크 테마 적용 완료

## 개요
info, community 페이지에 다크 테마를 강제 적용하여 전체 사이트의 다크 럭셔리 디자인 통일. MCP 설정에 sequential-thinking 서버도 추가.

## 주요 변경사항

### 1. MCP 설정 업데이트
- `~/.claude/settings.json`에 `sequential-thinking` MCP 서버 추가
- `@modelcontextprotocol/server-sequential-thinking` 패키지 사용

### 2. 다크 테마 적용 페이지 (4개 추가)
- **info/live**: 라이브 멤버 페이지
- **info/sig**: 시그니처 갤러리 페이지
- **info/timeline**: 타임라인 페이지
- **community/free**: 커뮤니티 게시판 페이지

## 핵심 CSS 패턴
```css
/* 페이지별 다크 테마 강제 적용 */
.main,
.main * {
  --background: #09090b;
  --background-secondary: #0f0f12;
  --surface: #121215;
  --card-bg: #0a0a0c;
  --card-border: rgba(255, 255, 255, 0.08);
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.5);
}
```

## 수정된 파일
```
~/.claude/settings.json                    - MCP 서버 추가
src/app/info/live/page.module.css          - 다크 테마 변수 오버라이드
src/app/info/sig/page.module.css           - 다크 테마 변수 오버라이드
src/app/info/timeline/page.module.css      - 다크 테마 + 세로선 색상 조정
src/app/community/free/page.module.css     - 다크 테마 변수 오버라이드
```

## 전체 다크 테마 적용 현황
| 페이지 | 상태 |
|-------|------|
| /ranking/total | ✅ |
| /info/org | ✅ |
| /ranking/vip | ✅ |
| /info/live | ✅ (신규) |
| /info/sig | ✅ (신규) |
| /info/timeline | ✅ (신규) |
| /community/free | ✅ (신규) |

## 결과
- ✅ 빌드 성공
- ✅ 7개 페이지 다크 테마 통일
- ✅ CSS 변수 오버라이드 패턴 일관 적용
- ✅ MCP sequential-thinking 서버 추가

## 다음 단계
- 메인 페이지 다크 테마 적용 (선택사항)
- 모바일 반응형 세부 최적화
- 관리자 페이지 다크 테마 검토
