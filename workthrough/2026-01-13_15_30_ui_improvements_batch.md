# UI 개선 일괄 작업

## 개요
배너 정렬, 유튜브 썸네일, 조직도 인원 표시, 이력 날짜, 프로필 이모티콘 등 5가지 UI 개선 사항을 일괄 적용했습니다.

## 주요 변경사항

### 1. 배너 사이즈 및 정렬 개선
- **파일**: `src/components/layout/SideBanner.tsx`, `SideBanner.module.css`
- **변경**: 이미지 크기 160→180, 480→540으로 확대
- **변경**: 정렬을 `flex-start`에서 `center`로 변경하여 중앙 정렬

### 2. 유튜브 썸네일 표시 문제 해결
- **파일**: `src/components/home/VOD.tsx`, `Shorts.tsx`
- **원인**: Next.js Image 최적화가 외부 YouTube URL을 처리하지 못함
- **해결**: `unoptimized` prop 추가로 YouTube 이미지 최적화 우회
```tsx
unoptimized={item.thumbnailUrl.includes('youtube.com') || item.thumbnailUrl.includes('ytimg.com')}
```

### 3. 조직도 총인원 수 표시
- **파일**: `src/app/rg/org/page.tsx`, `page.module.css`
- **추가**: 토글 영역 오른쪽에 "총 N명" 배지 표시
- **스타일**: 핑크 아이콘 + 블러 배경 + 필 테두리

### 4. 이력 페이지 시작 날짜 표시
- **파일**: `src/app/rg/history/page.tsx`, `page.module.css`
- **추가**: "📅 2025년 1월 20일부터 ~" 배지 표시
- **스타일**: 핑크 그라데이션 배경 + 라이트 모드 대응

### 5. 프로필 이모티콘 추가
- **파일**: `src/components/info/MemberDetailModal.tsx`
- **추가된 이모티콘**:
  - 🧠 MBTI
  - 🎂 나이
  - 📏 키
  - ⚖️ 몸무게
  - 🎈 생일
  - 💉 혈액형
  - 🎮 취미
  - ⭐ 특기
  - 🍕 좋아하는 음식

## 결과
- ✅ 모든 변경사항 적용 완료
- ✅ 라이트/다크 모드 모두 지원

## 다음 단계
- Supabase에 `member_profile` 컬럼 추가 필요 (SQL 실행)
- 실제 멤버 프로필 데이터 입력
- 브라우저에서 전체 기능 테스트
