# PandaTV 라이브 상태 크롤러

PandaTV에서 RG Family 멤버들의 라이브 상태를 수집하여 Next.js API로 전송하는 크롤러입니다.

## 📋 요구사항

- Python 3.8+
- Chrome 브라우저 (headless 모드 사용)

## 🚀 설치

```bash
# 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
.\venv\Scripts\activate  # Windows

# 패키지 설치
pip install selenium python-dotenv requests webdriver-manager
```

## ⚙️ 환경 설정

프로젝트 루트에 `.env` 파일 생성 또는 수정:

```env
# API 설정
API_URL=http://localhost:3000/api/live-status/update
LIVE_STATUS_API_SECRET=rg-family-api-secret-2026

# PandaTV 로그인 (선택적 - 즐겨찾기 페이지 접근용)
PANDATV_USERNAME=your-username
PANDATV_PASSWORD=your-password
```

## 📖 사용법

### 1회 실행
```bash
python scripts/crawler/crawler_example.py
```

### 지속 실행 모드
```bash
# 기본 2분 간격
python scripts/crawler/crawler_example.py --continuous

# 사용자 정의 간격 (예: 3분 = 180초)
python scripts/crawler/crawler_example.py --continuous 180
```

### 테스트 모드
```bash
# API 연결 테스트 (더미 데이터 사용)
python scripts/crawler/crawler_example.py --test
```

## 🔧 커스터마이징

### BJ 매핑 수정

`crawler_example.py`의 `BJ_MAPPING` 딕셔너리를 수정:

```python
BJ_MAPPING = {
    "린아": 1,    # organization 테이블의 id
    "가애": 2,
    "나노": 3,
    # ... 추가
}
```

### 채널 URL 추가

개별 채널 확인 방식 사용 시:

```python
BJ_CHANNEL_URLS = {
    "린아": "https://www.pandalive.co.kr/channel/rina",
    "가애": "https://www.pandalive.co.kr/channel/gaea",
    # ... 추가
}
```

### 라이브 감지 셀렉터 수정

PandaTV의 실제 DOM 구조에 맞게 `check_channel_live()` 메서드의 셀렉터 수정:

```python
live_selectors = [
    ".live-badge",           # 라이브 배지
    ".is-live",              # 라이브 상태 클래스
    "[data-live='true']",    # 데이터 속성
    # ... PandaTV 실제 셀렉터로 교체
]
```

## 🔒 보안 고려사항

1. **API 키 보호**: `.env` 파일을 `.gitignore`에 추가
2. **Rate Limiting**: 과도한 요청 방지를 위해 요청 간 딜레이 유지
3. **User-Agent**: 일반 브라우저처럼 보이는 User-Agent 사용

## 📊 배포 옵션

### 옵션 1: 로컬 실행 (개발/테스트)
```bash
# 터미널에서 직접 실행
python scripts/crawler/crawler_example.py --continuous 120
```

### 옵션 2: 시스템 서비스 (Linux)

`/etc/systemd/system/pandatv-crawler.service`:
```ini
[Unit]
Description=PandaTV Live Status Crawler
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/rg-family
Environment=PATH=/path/to/venv/bin
ExecStart=/path/to/venv/bin/python scripts/crawler/crawler_example.py --continuous 120
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pandatv-crawler
sudo systemctl start pandatv-crawler
```

### 옵션 3: Docker

```dockerfile
FROM python:3.11-slim

# Chrome 설치
RUN apt-get update && apt-get install -y \
    chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY scripts/crawler/ ./

CMD ["python", "crawler_example.py", "--continuous", "120"]
```

### 옵션 4: Cron Job (간헐적 실행)

```bash
# crontab -e
*/2 * * * * cd /path/to/rg-family && /path/to/venv/bin/python scripts/crawler/crawler_example.py >> /var/log/pandatv-crawler.log 2>&1
```

## 🐛 트러블슈팅

### 드라이버 오류
```bash
# ChromeDriver 재설치
pip uninstall webdriver-manager
pip install webdriver-manager
```

### 페이지 로드 타임아웃
- `Config.PAGE_LOAD_TIMEOUT` 값 증가
- 네트워크 상태 확인

### API 인증 실패
- `.env`의 `LIVE_STATUS_API_SECRET` 확인
- Next.js 서버의 환경변수와 일치하는지 확인

## 📈 모니터링

크롤러 로그 확인:
```bash
# 실시간 로그
tail -f /var/log/pandatv-crawler.log

# 오류만 확인
grep "ERROR" /var/log/pandatv-crawler.log
```

## 🔗 관련 API

- `GET /api/live-status` - 현재 라이브 상태 조회
- `POST /api/live-status/update` - 라이브 상태 업데이트 (API Key 필요)
- `POST /api/live-status/sync` - DB 동기화 (Cron용)
