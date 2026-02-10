# Live 멤버 페이지 구현 및 UI 통일

## 개요
cnine.kr 스타일의 LIVE 표시 디자인을 적용하고, 새로운 `/info/live` 페이지를 생성하며, 메인 페이지 LiveMembers 섹션에 최대 8명 제한 및 더보기 기능을 추가했습니다.

## 주요 변경사항

### 1. `/info/live` 페이지 생성
- **파일**: `src/app/info/live/page.tsx`, `page.module.css`
- **기능**:
  - 전체 멤버 그리드 뷰
  - 전체/LIVE 필터 탭
  - 멤버 상세 모달
  - 실시간 LIVE 카운트 표시
  - 방송 보러가기 버튼

### 2. 메인 페이지 LiveMembers 개선
- **최대 8명** 표시 제한
- 8명 초과 시 **더보기** 버튼 + **+N 더보기** 카드 표시
- 헤더에 **LIVE 카운트** 뱃지 (시안색)
- `/info/live`로 연결

### 3. LIVE 표시 스타일 통일 (조직도 페이지와 동일)
```css
/* LIVE 상태 아바타 테두리 */
.avatar.avatarLive {
  border-color: #22d3ee;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}

/* LIVE 뱃지 (우상단 빨간색) */
.liveBadge {
  background: #ef4444;
  border-radius: 4px;
  font-size: 0.6rem;
  animation: pulse 1.5s ease-in-out infinite;
}
```

## 파일 목록
| 파일 | 변경 내용 |
|------|----------|
| `src/app/info/live/page.tsx` | 새 페이지 생성 |
| `src/app/info/live/page.module.css` | 새 스타일 생성 |
| `src/components/LiveMembers.tsx` | 8명 제한, 더보기 링크 추가 |
| `src/components/LiveMembers.module.css` | 조직도 스타일로 통일 |

## 디자인 특징
- **LIVE 링**: 시안색 테두리 + 글로우 (`#22d3ee`)
- **LIVE 뱃지**: 빨간색 우상단 배치 (`#ef4444`)
- **다크/라이트 모드**: CSS 변수로 테마 적응
- **애니메이션**: pulse, livePulse 효과

## 결과
- ✅ 빌드 성공 (30개 페이지)
- ✅ `/info/live` 새 페이지 추가
- ✅ 메인 LiveMembers 8명 제한 + 더보기
- ✅ 조직도와 동일한 LIVE 표시 스타일

## 다음 단계
- 실제 브라우저에서 라이브 페이지 테스트
- 반응형 레이아웃 확인
- 실시간 라이브 상태 업데이트 테스트
