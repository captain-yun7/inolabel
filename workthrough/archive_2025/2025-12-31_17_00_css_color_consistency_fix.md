# CSS 색상 일관성 수정 (Priority 1)

## 개요
프로젝트 전체에서 하드코딩된 색상값을 CSS 변수로 통일하여 유지보수성과 테마 일관성을 개선했습니다. 총 4개 CSS 파일에서 8개 이상의 하드코딩된 색상을 수정했습니다.

## 주요 변경사항
- **수정한 것**: 하드코딩된 색상(`#00d4ff`, `#00f0ff`, `#ef4444`, `#050505`) → CSS 변수로 변경
- **추가한 것**: `globals.css`에 시맨틱 색상 변수 추가

### 수정된 파일
| 파일 | 수정 내용 |
|------|----------|
| `globals.css` | 시맨틱 색상 변수 추가 (live-badge, crew, excel) |
| `VOD.module.css` | crew 색상 2개소 수정 |
| `Shorts.module.css` | crew 색상 3개소 수정 |
| `RankingBoard.module.css` | excel/crew 뱃지 2개소 수정 |
| `LiveMembers.module.css` | LIVE 뱃지 배경색 1개소 수정 |

## 핵심 코드
```css
/* globals.css에 추가된 시맨틱 변수 */
--live-badge-bg: #ef4444;
--live-badge-glow: rgba(239, 68, 68, 0.4);
--crew-color: #00d4ff;
--crew-bg: rgba(0, 212, 255, 0.2);
--crew-border: rgba(0, 212, 255, 0.3);
--excel-color: #ff0050;
--excel-bg: rgba(255, 0, 80, 0.1);
--excel-border: rgba(255, 0, 80, 0.2);
```

## 결과
- ✅ 빌드 성공
- ✅ 모든 CSS 컴파일 정상
- ✅ 30개 페이지 정적 생성 완료

## 다음 단계
- Priority 2: 반응형 브레이크포인트 표준화
- Priority 3: 애니메이션 타이밍 함수 통일
- Priority 4: 타이포그래피 스케일 정리
