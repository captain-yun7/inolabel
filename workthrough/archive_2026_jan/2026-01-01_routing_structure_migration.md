# RG Family 라우팅 구조 마이그레이션

## 개요
개발 명세서에 맞춰 라우팅 구조를 전면 변경하여 더 직관적인 URL 구조로 개선했습니다.

## 주요 변경사항

### 라우트 마이그레이션
| Before | After | 설명 |
|--------|-------|------|
| `/info/live` | `/rg/live` | 라이브 멤버 페이지 |
| `/info/org` | `/organization` | 조직도 페이지 |
| `/info/sig` | `/signature` | 시그리스트 페이지 |
| `/info/timeline` | `/timeline` | 타임라인 페이지 |
| `/ranking/total` | `/ranking` | 메인 랭킹 페이지 |
| `/ranking/vip/[userId]` | `/ranking/[userId]` | VIP 개인 페이지 |

### 업데이트된 파일
- `src/app/rg/live/` - 새 위치
- `src/app/organization/` - 새 위치
- `src/app/signature/` - 새 위치
- `src/app/timeline/` - 새 위치
- `src/app/ranking/page.tsx` - 메인 랭킹 (기존 total 내용)
- `src/app/ranking/[userId]/` - VIP 개인 페이지

### 내부 링크 업데이트
- `src/components/Navbar.tsx` - 네비게이션 링크
- `src/components/Footer.tsx` - 푸터 링크
- `src/components/LiveMembers.tsx` - 전체보기 링크
- `src/lib/mock/banners.ts` - 배너 링크
- `src/app/organization/page.tsx` - 내부 탭 링크
- `src/app/ranking/vip/page.tsx` - VIP 라운지 내 링크
- `src/app/ranking/season/[id]/page.tsx` - 시즌 랭킹 내 링크
- `src/app/ranking/[userId]/page.tsx` - VIP 개인 페이지 내 링크

## 결과
- ✅ 빌드 성공
- ✅ 모든 라우트 정상 동작
- ✅ 내부 링크 100% 마이그레이션 완료

## 최종 라우트 구조
```
/                      # 메인 페이지
/rg/live               # 라이브 멤버
/organization          # 조직도
/signature             # 시그리스트
/timeline              # 타임라인
/ranking               # 전체 랭킹 (메인)
/ranking/[userId]      # VIP 개인 페이지
/ranking/season/[id]   # 시즌별 랭킹
/ranking/vip           # VIP 라운지
/notice                # 공지사항
/community/free        # 자유게시판
/community/vip         # VIP 게시판
/schedule              # 일정 캘린더
```

## 다음 단계
- 명세서 기반 추가 기능 구현
- Tailwind CSS 전환 검토 (현재 CSS Modules 유지)
- Zustand 상태관리 전환 검토 (현재 Context API 유지)
