# 개발자 협업 가이드

> 통화 내용 (2026-01-12 오후 4:19, 10분 46초) 기반 작업 정리

## 📞 통화 요약

**핵심 합의 사항:**
1. Supabase 연동 작업 → 바이브 코딩 담당
2. BJ 라이브 상태 크롤러 → 개발자 담당 (별도 EXE 프로그램)
3. 내일 (1/13) 오전 10시 진행상황 공유 통화

---

## 현재 상태

### Supabase 연동 상태
- **연결**: ✅ 성공 (Vercel + 로컬 모두 설정 완료)
- **URL**: `https://eilwlpxvjwyidqjjypqo.supabase.co`
- **키 형식**: 새로운 Supabase 키 형식 (sb_publishable_*, sb_secret_*)
- **테이블**: 15개 테이블 생성됨 (초기 데이터 시딩 필요)
- **Mock 데이터**: ❌ OFF (실제 DB 모드)

### 🔑 Supabase 키 정보 (개발자 공유용)

```
Project URL: https://eilwlpxvjwyidqjjypqo.supabase.co

게시 가능한 키 (Anon Key - 클라이언트용):
sb_publishable_sD6DA2oJ3ReBZqjetdPSJQ_Uuv31Uw1

비밀 키 (Service Role Key - 서버/백엔드용):
sb_secret_mfn0iKLBzK2AX-E2eVIHmg_gHhGmdCx
```

> ⚠️ Service Role Key는 관리자 권한이 있으므로 서버/백엔드에서만 사용

### 환경 설정
```env
# .env.local (로컬 개발)
NEXT_PUBLIC_SUPABASE_URL=https://eilwlpxvjwyidqjjypqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_sD6DA2oJ3ReBZqjetdPSJQ_Uuv31Uw1
SUPABASE_SERVICE_ROLE_KEY=sb_secret_mfn0iKLBzK2AX-E2eVIHmg_gHhGmdCx
NEXT_PUBLIC_USE_MOCK_DATA=false
```

---

## 통화 기반 작업 목록

### 1. ✅ Supabase 연동 (완료)
- [x] 프로젝트 생성 및 키 발급
- [x] 환경변수 설정
- [x] 연결 테스트 성공

### 2. 🔄 데이터 마이그레이션 (진행 필요)
현재 Mock 데이터를 실제 DB로 이전해야 함

**필요한 초기 데이터:**
| 테이블 | 설명 | 현재 상태 |
|--------|------|----------|
| profiles | 멤버/후원자 정보 | 0건 |
| seasons | 시즌 정보 | 0건 |
| donations | 후원 내역 | 0건 |
| organization | 조직 구조 | 0건 |
| notices | 공지사항 | 0건 |

**시딩 명령어:**
```bash
npm run db:seed
```

### 3. 📺 BJ 라이브 상태 수집 (개발자 담당)

**문제점:**
- PandaTV는 공식 API 미제공 (아프리카TV, 트위치와 다름)
- 라이브 상태 확인을 위해 크롤링 필요

**통화에서 합의된 방식:**
1. 관리자 계정으로 팬더TV 로그인
2. 감시 대상 BJ들을 **즐겨찾기**에 추가
3. 즐겨찾기 페이지 DOM 파싱 (메인 페이지보다 효율적)
4. **별도 EXE 프로그램**으로 분리 (메인 서버와 독립)
5. 24시간 실행하며 주기적으로 Supabase 업데이트

**아키텍처:**
```
┌─────────────────────────────────────────────────┐
│  크롤러 프로그램 (Python/Selenium)               │
│  - 별도 EXE로 실행                              │
│  - 윈도우/맥 PC에서 24시간 실행                  │
└─────────────────────────────────────────────────┘
                     ↓ (파싱)
┌─────────────────────────────────────────────────┐
│  PandaTV 즐겨찾기 페이지                         │
│  - 관리자 계정 로그인 상태                       │
│  - BJ 20명 정도 등록                            │
└─────────────────────────────────────────────────┘
                     ↓ (is_live 상태)
┌─────────────────────────────────────────────────┐
│  Supabase DB (organization.is_live)             │
│  - Service Role Key로 직접 업데이트              │
└─────────────────────────────────────────────────┘
                     ↓ (읽기)
┌─────────────────────────────────────────────────┐
│  Next.js 프론트엔드                              │
│  - LIVE MEMBERS 섹션에 표시                      │
└─────────────────────────────────────────────────┘
```

**크롤러 예제 코드 위치:**
- `scripts/crawler/crawler_example.py`
- TODO: 로그인 로직, DOM 파싱 셀렉터 구현 필요

### 4. 🚀 Vercel 배포 설정

Vercel Dashboard → Settings → Environment Variables에 추가:

| Key | Value | Environment |
|-----|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | https://eilwlpxvjwyidqjjypqo.supabase.co | Production, Preview |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | sb_publishable_... | Production, Preview |
| SUPABASE_SERVICE_ROLE_KEY | sb_secret_... | Production |
| NEXT_PUBLIC_USE_MOCK_DATA | false | Production |

---

## 역할 분담 제안

### 프론트엔드 (바이브 코딩)
- UI/UX 구현
- Supabase 클라이언트 호출 로직
- Admin CMS 기능

### 백엔드 개발자
- BJ 라이브 상태 크롤러 개발
- 데이터 수집 자동화
- API 최적화

---

## 다음 단계

1. **오늘**: 초기 데이터 시딩 (시즌, 조직 구조)
2. **내일 오전 10시**: 개발자 통화 - 진행 상황 공유
3. **이번 주**: 라이브 상태 수집 프로토타입

---

## 참고 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드 테스트
npm run build

# Supabase 연결 테스트
npm run db:test

# 데이터 시딩
npm run db:seed
```

---

## 📋 통화 녹취 주요 내용

### 개발자 발언 요약

> "지금 목업데이터 사용하고 계셔가지고 DB는 아예 안 붙어있거든요"

> "스파베이스에 가입하셔가지고 서비스 키를 받아야 돼요"

> "목업을 펄스(false)로 하셔서 스파베이스랑 실제 그 키값으로 백앤드랑 통신을 해서"

> "크롤링 많이 해봤기 때문에... 그냥 EXE를 실행시키면 계속 수집하는 거... 별도로 떼는 거죠 프로그램을 나눠가지고"

> "BJ가 20명이다 그럼 그 읽어서 그 이름이 있다 그러면 그 값 읽어서 넣고"

### 합의된 진행 방식

1. **바이브 코딩**: Supabase 연동 테스트 먼저 진행
2. **개발자**: 키 공유받고 연동 확인 후 크롤러 개발
3. **일정**: 내일 오전 10시 통화로 진행상황 공유

---

*마지막 업데이트: 2026-01-12 오후 5:00*
