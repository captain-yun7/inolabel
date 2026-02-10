# CSS 변수 마이그레이션 완료

## 개요
Admin 페이지 및 Info 페이지의 모든 하드코딩된 색상을 CSS 변수로 마이그레이션하여 테마 일관성을 확보했습니다.

## 주요 변경사항

### globals.css 추가 변수
- `--modal-overlay-strong`: rgba(0, 0, 0, 0.8)
- `--modal-overlay-dark`: rgba(0, 0, 0, 0.85)

### Admin 페이지 수정
- `shared.module.css`: 뱃지(superadmin, admin, moderator, crew), statusBadge, modalOverlay
- `banners/page.module.css`: statusButton, deleteButton 색상
- `Sidebar.module.css`: navItem.active 배경색
- `DataTable.module.css`: 테이블 hover, 액션 메뉴
- `CsvUploader.module.css`: dropZone, errorBox, resultBox
- `StatsCard.module.css`: iconWrapper 변형, change 인디케이터

### Info 페이지 수정
- `organization/page.module.css`: 모달 전체 (overlay, avatar, badge, text, button)
- `MemberDetailModal.module.css`: modalOverlay, modalUnit 배경
- `SigDetailModal.module.css`: overlay, tabDate, playButton, duration, related items
- `SigGallery.module.css`: crewBtn.active 색상 (live-color)
- `OrgTree.module.css`: avatar gradient

## 결과
- ✅ 빌드 성공 (29 페이지)
- ✅ 모든 Admin/Info CSS 파일 테마 변수 사용
- ✅ 하드코딩된 rgba/hex 색상 제거

## 다음 단계
- 브라우저에서 시각적 테스트
- 라이트 테마 전환 시 스타일 확인
