# 다크/라이트 모드 CSS 완료 및 LiveMembers 개선

## 개요
모든 컴포넌트 CSS 파일에서 하드코딩된 색상 값을 CSS 변수로 교체하고, LiveMembers를 cnine.kr 스타일의 시안색 LIVE 효과로 개선했습니다.

## 주요 변경사항

### 1. 테마 적응형 CSS 적용 완료
| 파일 | 변경 내용 |
|------|----------|
| SigDetailModal.module.css | `.modal` 배경 → var(--surface-elevated), box-shadow |
| Calendar.module.css | `.eventPreview`, `.previewItem`, `.spinner`, `.eventItemCard` |
| SeasonSelector.module.css | `.currentBadge` 배경 → var(--overlay-strong) |

### 2. LiveMembers cnine.kr 스타일 개선
```css
/* Before: 핑크 LIVE 링 */
background: linear-gradient(135deg, #fd68ba 0%, #fb37a3 50%, #e11d48 100%);

/* After: 시안 LIVE 링 (cnine.kr 스타일) */
background: linear-gradient(135deg, #00d4ff 0%, #00b4d8 50%, #0096c7 100%);
box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
animation: liveRingPulse 2s ease-in-out infinite;
```

**개선된 애니메이션:**
- `liveRingPulse`: 시안색 글로우 펄스 효과
- `dotPulse`: 뱃지 내 점 애니메이션 개선
- 뱃지 색상: 핑크 → 시안 그라디언트

### 3. 전체 수정 파일 목록 (이전 세션 포함)
- globals.css (테마 변수 추가)
- Notice.module.css
- Hero.module.css
- RankingBoard.module.css
- RankingBar.module.css
- GaugeBar.module.css
- OrgTree.module.css
- Shorts.module.css
- VOD.module.css
- SigDetailModal.module.css
- Calendar.module.css
- SeasonSelector.module.css
- LiveMembers.module.css

## 결과
- ✅ 빌드 성공 (29개 페이지)
- ✅ 다크 모드: 기존 UI 유지
- ✅ 라이트 모드: 밝은 배경/테두리 적용
- ✅ LiveMembers: 시안색 LIVE 효과

## 다음 단계
- 실제 브라우저에서 라이트 모드 전환 테스트
- 추가 컴포넌트에 테마 변수 확장 필요 시 적용
- Admin 페이지 CSS도 테마 변수 적용 검토
