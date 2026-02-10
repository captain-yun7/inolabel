# 메모리 최적화 및 UI 복구

## 개요
개발 서버 메모리 누수 관리 시스템 구축 및 React 훅 최적화 작업 완료. git 상태 꼬임으로 인한 UI 깨짐 문제도 해결.

## 주요 변경사항

### 1. 개발 서버 모니터링 (신규)
- `scripts/dev-server-monitor.ts` 생성
- 메모리 임계치(1.5GB) 초과 시 자동 재시작
- `npm run dev:watch`로 실행

### 2. AuthContext 최적화
- `supabaseRef` 패턴으로 불필요한 재구독 방지
- `fetchProfile` 재생성 최소화

### 3. useLiveRoster 최적화
- 초기 로드 effect 의존성 빈 배열로 변경
- `fetchRosterRef` 활용하여 마운트 시 1회만 실행

### 4. useTimelineData 최적화
- `maxInitialLoad` 옵션 추가 (기본값 50)
- 무한 스크롤 비활성화 시에도 제한된 데이터만 로드

### 5. useDonationsData CSV 배치 처리
- 단일 쿼리로 중복 체크 (N+1 문제 해결)
- 100개 단위 배치 insert
- 예상 쿼리 수 90% 감소

## 결과
- ✅ 빌드 성공
- ✅ 개발 서버 정상 작동
- ✅ UI/UX 정상 표시
- ✅ 커밋 완료 (3f9ca12)

## 다음 단계
- [ ] `npm run dev:watch`로 장시간 테스트하여 메모리 모니터링 검증
- [ ] React DevTools Profiler로 리렌더링 횟수 확인
- [ ] CSV 업로드 시 Network 탭에서 쿼리 수 확인
