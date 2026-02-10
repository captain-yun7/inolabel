# PandaTV Live Status Checker

PandaTV 내부 API를 사용하여 라이브 상태를 확인합니다.
Playwright 없이 간단한 HTTP 요청으로 동작합니다.

## 설치

```bash
cd python-live-scraper

# 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

## 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 편집
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 사용법

```bash
# 현재 라이브 목록 보기
python main.py --list

# 특정 유저 상태 확인
python main.py --test user_id

# DB 동기화 (한 번 실행)
python main.py

# 스케줄러로 반복 실행 (3분 간격)
python main.py --schedule

# 디버그 모드
python main.py --debug
```

## Railway 배포

1. [Railway](https://railway.app) 프로젝트 생성
2. `python-live-scraper` 폴더 배포
3. 환경변수 설정:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SCRAPE_INTERVAL_SECONDS=180`

## 구조

```
python-live-scraper/
├── main.py          # CLI 엔트리포인트
├── scraper.py       # PandaTV API 클라이언트
├── db.py            # Supabase 연동
├── config.py        # 환경 설정
├── requirements.txt # 의존성
└── .env.example     # 환경변수 템플릿
```

## API 정보

PandaTV 내부 API 사용:
- `GET https://api.pandalive.co.kr/v1/live` - 현재 라이브 목록
- 인증 불필요
- 응답: `{ "list": [{ "userId", "userNick", "user" (시청자수), "thumbUrl", ... }] }`
