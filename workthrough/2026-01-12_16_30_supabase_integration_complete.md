# Supabase 연동 완료

## 개요
Supabase 데이터베이스 연동을 완료하고 Vercel 프로덕션 환경에 배포했습니다. 테이블 생성 및 API 연결이 정상 동작합니다.

## 주요 변경사항

### 1. 환경변수 설정
- **로컬**: `.env.local` 업데이트
- **프로덕션**: Vercel 환경변수 설정

```env
NEXT_PUBLIC_SUPABASE_URL=https://eilwlpxvjwyidqjjypqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_sD6DA2oJ3ReBZqjetdPSJQ_Uuv31Uw1
SUPABASE_SERVICE_ROLE_KEY=sb_secret_mfn0iKLBzK2AX-E2eVIHmg_gHhGmdCx
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### 2. Supabase 테이블 생성 (15개)
SQL 마이그레이션 실행 (`supabase/migrations/20250112_init_schema.sql`)

| 테이블 | 용도 |
|--------|------|
| profiles | 사용자 프로필 |
| seasons | 시즌 정보 |
| organization | 조직도 멤버 |
| donations | 후원 내역 |
| vip_rewards | VIP 보상 |
| vip_images | VIP 이미지 |
| signatures | 시그니처 갤러리 |
| schedules | 일정 |
| timeline_events | 타임라인 |
| notices | 공지사항 |
| posts | 게시글 |
| comments | 댓글 |
| media_content | Shorts/VOD |
| live_status | 라이브 상태 |
| banners | 배너 |

### 3. API 연결 테스트 결과
모든 Supabase API 요청 **200 OK** 반환:
- `GET /rest/v1/organization` ✅
- `GET /rest/v1/notices` ✅
- `GET /rest/v1/media_content` ✅
- `GET /rest/v1/live_status` ✅

## 결과
- Supabase 연동 완료
- Vercel 프로덕션 배포 완료
- 빌드 성공 (31 페이지)

## 다음 단계

### 단기
- [ ] Admin 페이지에서 초기 데이터 추가
- [ ] 시즌 데이터 생성
- [ ] 멤버(organization) 데이터 추가

### 중기 (개발자 협업)
- [ ] PandaTV 라이브 상태 크롤러 구현 (Selenium/헤드리스 브라우저)
- [ ] 후원 데이터 CSV 업로드 테스트
- [ ] 인증 시스템 연동 (Supabase Auth)

## 개발자 공유용 정보

### 키 정보
- **프로젝트 ID**: `eilwlpxvjwyidqjjypqo`
- **URL**: `https://eilwlpxvjwyidqjjypqo.supabase.co`
- **Anon Key**: `sb_publishable_sD6DA2oJ3ReBZqjetdPSJQ_Uuv31Uw1`
- **Service Role Key**: `sb_secret_mfn0iKLBzK2AX-E2eVIHmg_gHhGmdCx`

### 환경 설정 파일
- `.env.example` - 템플릿 (다른 개발자용)
- `.env.local` - 로컬 개발용 (git ignored)

### 통화 요약 (2026-01-12)
- 목업 데이터 → 실제 Supabase 연동 필요
- 라이브 기능: PandaTV API 없음, 크롤링 필요
- 내일 오전 10시 후속 통화 예정
