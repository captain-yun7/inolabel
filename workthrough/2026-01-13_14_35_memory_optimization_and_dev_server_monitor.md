# 메모리 최적화 및 개발 서버 모니터링 시스템 구축

## 개요
개발 서버 메모리 임계치 초과 시 자동 재시작 스크립트를 추가하고, 발견된 4개의 메모리 누수 관련 이슈를 수정했다. useEffect 의존성 최적화와 CSV 배치 처리로 불필요한 재구독 및 N+1 쿼리 문제를 해결했다.

## 주요 변경사항

### 1. 개발 서버 메모리 모니터링 스크립트
- `scripts/dev-server-monitor.ts` 생성
- 메모리 임계치(1.5GB) 초과 시 자동 재시작
- `npm run dev:watch` 명령어 추가

### 2. AuthContext 의존성 최적화
- `supabase`를 `useRef`로 관리하여 불필요한 재구독 방지
- `fetchProfile`을 ref 패턴으로 변경
- `isMounted` 플래그로 cleanup 안전성 확보

### 3. useLiveRoster 초기 로드 최적화
- `supabase`를 `useRef`로 관리
- 초기 로드 effect 의존성을 빈 배열로 변경
- 마운트 시 1회만 데이터 로드

### 4. useTimelineData 초기 로드 제한
- `maxInitialLoad` 옵션 추가 (기본값 50)
- `infiniteScroll=false`일 때도 페이지네이션 적용

### 5. useDonationsData CSV 배치 처리
- N+1 쿼리 문제 해결 (1000행 기준 2000+쿼리 → ~20쿼리)
- 단일 쿼리로 기존 데이터 조회
- 100개 단위 배치 insert
- 프로필별 총 후원금 집계 후 배치 RPC 호출

## 핵심 코드

```typescript
// supabase ref 패턴 (AuthContext, useLiveRoster)
const supabaseRef = useRef(supabase)
useEffect(() => {
  supabaseRef.current = supabase
}, [supabase])

// 빈 의존성으로 마운트 시 1회 실행
useEffect(() => {
  void fetchRosterRef.current()
}, [])
```

## 결과
- ✅ 빌드 성공
- ✅ 테스트 통과 (40/40)

## 다음 단계
- 개발 서버 모니터링 스크립트 실제 테스트 (`npm run dev:watch`)
- React DevTools Profiler로 리렌더링 횟수 확인
- 대용량 CSV 업로드 시 성능 측정
