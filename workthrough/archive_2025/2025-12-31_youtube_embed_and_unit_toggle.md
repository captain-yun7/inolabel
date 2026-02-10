# YouTube 임베드 및 유닛 토글 통일 구현

## 개요
Shorts/VOD 섹션에 YouTube 임베드 기능을 추가하고, Info 페이지들(Live, Org, Sig)에 엑셀부/크루부 유닛 토글을 일관성 있게 적용했습니다.

## 주요 변경사항

### 1. YouTube 유틸리티 생성
- **파일**: `src/lib/utils/youtube.ts`
- **기능**:
  - `extractYouTubeId()`: YouTube URL에서 비디오 ID 추출
  - `getYouTubeEmbedUrl()`: 임베드 URL 생성 (autoplay, loop 옵션)
  - `getYouTubeThumbnail()`: 썸네일 URL 생성
  - `getYouTubeShortsEmbedUrl()`: Shorts 전용 임베드 URL

### 2. Shorts 섹션 업데이트
- **파일**: `src/components/Shorts.tsx`, `Shorts.module.css`
- **추가된 것**:
  - ALL/EXCEL/CREW 유닛 토글
  - YouTube 임베드 모달 (클릭 시 새 탭 대신 모달에서 재생)
  - 자동 YouTube 썸네일 가져오기

### 3. VOD 섹션 업데이트
- **파일**: `src/components/VOD.tsx`, `VOD.module.css`
- **추가된 것**:
  - ALL/EXCEL/CREW 유닛 토글
  - YouTube 임베드 모달 (16:9 비율)
  - 자동재생 기능

### 4. Live 페이지 유닛 토글
- **파일**: `src/app/info/live/page.tsx`, `page.module.css`
- **추가된 것**: ALL/EXCEL/CREW 유닛 필터
- 기존 전체/LIVE 필터와 조합하여 사용

### 5. SigGallery 유닛 토글
- **파일**: `src/components/info/SigGallery.tsx`, `SigGallery.module.css`
- **추가된 것**: ALL/EXCEL/CREW 유닛 필터
- 기존 카테고리/검색 필터와 조합하여 사용

## 디자인 패턴

### 유닛 토글 스타일 (통일)
```css
.unitBtn.active {
  background: var(--color-primary);  /* 핑크 - Excel 기본 */
  color: white;
}

.unitBtn.crewBtn.active {
  background: #00d4ff;  /* 시안 - Crew 전용 */
  color: #050505;
}
```

## 결과
- ✅ 빌드 성공 (30개 라우트)
- ✅ YouTube 임베드 정상 작동
- ✅ 유닛 토글 일관성 확보

## 수정된 파일
| 카테고리 | 파일 |
|---------|------|
| 유틸리티 | src/lib/utils/youtube.ts |
| 메인 컴포넌트 | Shorts.tsx, Shorts.module.css |
| 메인 컴포넌트 | VOD.tsx, VOD.module.css |
| Info 페이지 | info/live/page.tsx, page.module.css |
| Info 컴포넌트 | SigGallery.tsx, SigGallery.module.css |

## 다음 단계
- PandaTV API 연동 (실시간 LIVE 상태)
- 알림 시스템 (공지/일정 알림)
- E2E 테스트 추가 (Playwright)
