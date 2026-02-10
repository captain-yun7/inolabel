# PageLayout 제거 및 랭킹 시즌 표시 추가

## 개요
메인 페이지와 커뮤니티 페이지를 제외한 모든 페이지에서 PageLayout(광고 여백)을 제거하고, 랭킹 페이지에 현재 시즌 표시 및 시즌별 랭킹 버튼을 추가했습니다.

## 주요 변경사항

### 1. PageLayout 제거 (8개 페이지)
광고 여백을 제거하여 전체 폭 레이아웃으로 변경:
- `/ranking/page.tsx` - 전체 랭킹
- `/ranking/[userId]/page.tsx` - 개인 헌정 페이지
- `/ranking/vip/page.tsx` - VIP 라운지
- `/notice/page.tsx` - 공지사항
- `/schedule/page.tsx` - 일정
- `/signature/page.tsx` - 시그리스트
- `/organization/page.tsx` - 조직도
- `/timeline/page.tsx` - 타임라인

### 2. PageLayout 유지 (3개 페이지)
광고 여백 유지:
- `/page.tsx` - 메인 페이지
- `/community/free/page.tsx` - 자유게시판
- `/community/vip/page.tsx` - VIP 게시판

### 3. 랭킹 페이지 시즌 표시 추가
```typescript
// 현재 활성 시즌 가져오기
const getCurrentSeason = () => mockSeasons.find(s => s.is_active)

// 시즌 표시 UI
<div className={styles.seasonInfo}>
  <span className={styles.currentSeason}>
    <span className={styles.seasonLive} />
    {currentSeason.name} 진행중
  </span>
  <Link href="/ranking/season" className={styles.seasonBtn}>
    <Calendar size={14} />
    <span>시즌별 랭킹 보러가기</span>
  </Link>
</div>
```

## 핵심 CSS 추가

```css
.seasonInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.seasonLive {
  width: 8px;
  height: 8px;
  background: var(--live-color, #00d4ff);
  border-radius: 50%;
  animation: livePulse 1.5s ease-in-out infinite;
}

.seasonBtn {
  background: linear-gradient(135deg, var(--color-primary), var(--primary-deep));
  border-radius: var(--radius-full);
  color: #fff;
  box-shadow: 0 2px 8px rgba(253, 104, 186, 0.3);
}
```

## 결과
- ✅ 빌드 성공 (30/30 페이지)
- ✅ 메인/커뮤니티 제외 모든 페이지 전체 폭 레이아웃
- ✅ 랭킹 페이지 현재 시즌 표시 (시안색 펄스 효과)
- ✅ 시즌별 랭킹 바로가기 버튼

## 다음 단계
- Admin CMS에 헌정 페이지 관리 기능 추가 (영상/이미지/메시지 업로드)
- Supabase DB 연동 (현재 Mock 데이터)
- 시즌별 랭킹 페이지 개선
