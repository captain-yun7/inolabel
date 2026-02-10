# 조직도 페이지 토글 및 트리 다이어그램 리디자인

## 개요
조직도 페이지(`/info/org`)를 트리 다이어그램 형태로 재설계하고, EXCEL UNIT과 CREW UNIT을 토글로 분리하여 각 유닛별 계층 구조를 한눈에 볼 수 있도록 개선했습니다.

## 주요 변경사항
- **개발한 것**: EXCEL/CREW UNIT 토글 버튼 추가
- **개선한 것**: 트리 다이어그램 레이아웃 (대표 → 팀장 → 멤버 계층)
- **개선한 것**: 유닛 전환 시 Framer Motion 애니메이션 적용
- **개선한 것**: 멤버 수에 따른 동적 연결선 너비 조정

## 핵심 코드
```typescript
// 토글 상태 관리
const [activeUnit, setActiveUnit] = useState<UnitType>('excel');

// 유닛별 필터링 및 계층 분류
const unitMembers = members.filter(m => m.unit === activeUnit);
const topLeaders = grouped.leaders.length > 0 ? grouped.leaders : grouped.directors;
const middleManagers = grouped.managers;
const regularMembers = grouped.members;
```

```css
/* 토글 버튼 스타일 */
.toggleBtn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
```

## 결과
- ✅ 빌드 성공
- ✅ EXCEL UNIT / CREW UNIT 토글 동작 확인
- ✅ 트리 다이어그램 계층 연결선 표시
- ✅ LIVE 배지 및 멤버 상세 모달 정상 동작

## 다음 단계
- 멤버 카드 호버 시 소셜 링크 퀵 액세스 추가
- 모바일 반응형 레이아웃 최적화
- 실시간 LIVE 상태 API 연동
