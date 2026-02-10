# UI 개선 및 타임라인 모달 구현

## 개요
VIP 시크릿 섹션을 시그니처 리액션 컨셉으로 수정하고, 타임라인 상세 모달 기능을 추가했습니다. 캘린더 페이지의 라이트 모드 가시성 문제를 해결하고, 전체 랭킹과 시즌별 랭킹 페이지를 완전히 분리했습니다.

## 주요 변경사항

### 개발한 것
- **타임라인 상세 모달**: 카드 클릭 시 이벤트 상세 정보를 모달로 표시
  - AnimatePresence 애니메이션 적용
  - 이미지, 날짜, 카테고리, 시즌 정보 표시
  - "자세히 보기" 호버 인디케이터 추가

### 수정한 것
- **VIP 시크릿 섹션**: "친필싸인" → "VIP Signature Reactions"으로 변경
  - PenTool 아이콘 → Video + Play 아이콘으로 교체
  - 설명 텍스트를 시그니처 리액션 컨셉에 맞게 수정
- **전체 랭킹 페이지**: SeasonSelector 완전 제거로 시즌별 랭킹과 분리

### 개선한 것
- **캘린더 라이트 모드**: 약 200줄의 라이트 모드 CSS 오버라이드 추가
  - 날짜 셀, 요일 헤더, 이벤트 아이템 가시성 개선
  - 필터 버튼, 프리뷰 팝업, 이벤트 리스트 스타일 수정

## 핵심 코드

```tsx
// Timeline.tsx - 모달 기능 추가
const [selectedEvent, setSelectedEvent] = useState<TimelineItem | null>(null)

<div className={styles.card} onClick={() => setSelectedEvent(event)}>
  <div className={styles.viewMore}>
    <ExternalLink size={14} />
    <span>자세히 보기</span>
  </div>
</div>

<AnimatePresence>
  {selectedEvent && (
    <motion.div className={styles.modalOverlay}>
      <motion.div className={styles.modalContent}>
        {/* 상세 정보 표시 */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## 결과
- ✅ 빌드 성공
- ✅ VIP 시크릿 섹션 시그니처 리액션으로 업데이트
- ✅ 타임라인 상세 모달 기능 완료
- ✅ 캘린더 라이트 모드 가시성 개선
- ✅ 랭킹 페이지 완전 분리

## 다음 단계
- Top 1-3 VIP 헌정 페이지 (`/ranking/vip/[userId]`) 구현
- PandaTV API 연동으로 실시간 라이브 상태 표시
- 전체 페이지 라이트/다크 모드 최종 점검
