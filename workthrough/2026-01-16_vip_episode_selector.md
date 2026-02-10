# VIP 페이지 회차(Episode) 선택 UI 구현

## 개요
VIP 라운지 페이지에 회차(직급전) 선택 기능을 추가하여 특정 직급전 회차별 Top 50 랭킹을 조회할 수 있도록 구현. 시즌 선택 → 회차 선택 → 랭킹 표시의 계층적 필터링 UI 완성.

## 주요 변경사항

### 신규 파일
- `src/components/ranking/EpisodeSelector.tsx` - 회차 선택 컴포넌트
- `src/components/ranking/EpisodeSelector.module.css` - 스타일 (직급전 골드 배지 포함)
- `src/lib/hooks/useEpisodeRankings.ts` - 회차별 랭킹 조회 훅

### 수정 파일
- `src/lib/repositories/types.ts` - IEpisodeRepository에 VIP 체크 메서드 추가
- `src/lib/context/DataProviderContext.tsx` - useEpisodes 훅 추가
- `src/lib/context/index.ts` - useEpisodes export
- `src/lib/hooks/index.ts` - useEpisodeRankings, useEpisodes export
- `src/components/ranking/index.ts` - EpisodeSelector export
- `src/app/ranking/vip/page.tsx` - EpisodeSelector 통합
- `src/app/ranking/vip/page.module.css` - filterSection, 로딩 상태 스타일

## 핵심 코드

```typescript
// useEpisodeRankings.ts - 회차별 랭킹 조회 로직
if (selectedEpisodeId) {
  const data = await episodesRepo.getEpisodeRankings(selectedEpisodeId, limit)
  setRankings(data)
} else if (seasonId) {
  // 전체 회차 선택 시 시즌 전체 랭킹
  const data = await rankingsRepo.getRankings({ seasonId, unitFilter: 'all' })
  setRankings(data.slice(0, limit).map(...))
}
```

## UI 구조

```
[VIP 페이지]
├── Hero Section
├── VIP 멤버 (Top 50) Section
│   ├── [시즌 선택: 전체 | 시즌1 | 시즌2 ...]
│   ├── [회차 선택: 전체 회차 | 직급전 1차 🏆 | 직급전 2차 🏆 ...]
│   └── [랭킹 목록 - 50명]
└── Footer
```

## 스타일 가이드 준수
- 직급전 배지: 골드 `#ffd700`
- 호버 효과: 핑크 `#fd68ba`
- 터치 타겟: 44px 이상
- 모바일: 768px 이하 세로 정렬

## 결과
- ✅ 빌드 성공 (TypeScript 에러 없음)
- ✅ Mock 데이터 지원 (시즌 1, 4에 직급전 회차 데이터)
- ✅ Supabase 연동 준비 완료

## 다음 단계
- Supabase에 episodes 테이블 데이터 추가 및 RPC 함수 확인
- 실제 직급전 회차 데이터 마이그레이션
- VIP 페이지에서 회차 선택 시 로딩 UX 최적화 (스켈레톤 로딩 개선)
- 회차별 VIP 혜택 차등화 기능 (선택 사항)
