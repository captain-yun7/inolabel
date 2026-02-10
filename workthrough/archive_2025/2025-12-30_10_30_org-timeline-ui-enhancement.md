# 조직도 & 타임라인 UI 개선

## 개요
조직도 페이지에 계층 구조 시각화(대표→부장→팀장→멤버)를 추가하고, 타임라인을 시즌별 카드형으로 그룹핑하여 가독성을 향상시켰습니다. SVG 아바타 이미지의 최적화 경고도 해결했습니다.

## 주요 변경사항

### 개발한 것
- **조직도 계층 시스템**: L1(대표), L2(부장), L3(팀장), L4(멤버) 레벨 표시
- **리더 카드 강조**: 대표 역할에 특별 스타일링(그라디언트, 글로우 효과)
- **타임라인 시즌 그룹핑**: 이벤트를 시즌별로 그룹화하여 표시
- **시즌 헤더 카드**: 시즌명, 기간, 이벤트 수를 포함한 카드형 헤더

### 수정한 것
- `LiveMembers.tsx`: SVG 이미지 unoptimized 속성 추가
- `RankingCard.tsx`: SVG 이미지 unoptimized 속성 추가
- `RankingList.tsx`: SVG 이미지 unoptimized 속성 추가
- `Timeline.tsx`: SVG 이미지 unoptimized 속성 추가

### 개선한 것
- 조직도의 시각적 계층 구조
- 타임라인의 정보 구조화 및 가독성
- dicebear SVG 아바타 경고 해결

## 핵심 코드

```typescript
// 조직도 계층 레벨 시스템
const roleHierarchy: Record<string, number> = {
  '대표': 0, 'PRESIDENT': 0,
  '부장': 1, 'DIRECTOR': 1,
  '팀장': 2, 'MANAGER': 2,
  '멤버': 3, 'MEMBER': 3,
};

// 타임라인 시즌별 그룹핑
const groupedBySeason = useMemo((): GroupedEvents[] => {
  const seasonMap = new Map<number, TimelineItem[]>();
  events.forEach(event => {
    const seasonId = event.seasonId || 0;
    if (!seasonMap.has(seasonId)) seasonMap.set(seasonId, []);
    seasonMap.get(seasonId)!.push(event);
  });
  return Array.from(seasonMap.keys())
    .sort((a, b) => b - a)
    .map(id => ({ season: seasons.find(s => s.id === id), events: seasonMap.get(id)! }));
}, [events, seasons]);
```

## 결과
- ✅ 빌드 성공 (29 페이지)
- ✅ SVG 이미지 경고 해결
- ✅ 조직도 계층 시각화 완료
- ✅ 타임라인 시즌 그룹핑 완료

## 다음 단계
- VIP 전용 콘텐츠 페이지 구현 (Top 50 비공개 감사 메시지)
- Top 1-3 헌정 페이지 개인별 Secret Page
- 조직도 연결선 시각화 추가 (대표→팀장 연결)
- 실시간 라이브 상태 PandaTV API 연동
