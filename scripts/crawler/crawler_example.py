"""
PandaTV 라이브 상태 크롤러

필요 패키지:
    pip install selenium python-dotenv requests webdriver-manager

사용법:
    1회 실행: python crawler_example.py
    지속 실행: python crawler_example.py --continuous [interval_seconds]
    테스트:    python crawler_example.py --test

환경변수 (.env):
    API_URL=http://localhost:3000/api/live-status/update
    LIVE_STATUS_API_SECRET=your-secret-key
    PANDATV_USERNAME=your-username (optional)
    PANDATV_PASSWORD=your-password (optional)
"""

import os
import time
import json
import logging
from datetime import datetime
from typing import Set, Dict, List, Optional

import requests
from dotenv import load_dotenv

# Selenium imports
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    from webdriver_manager.chrome import ChromeDriverManager
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# 환경 변수 로드
load_dotenv()

# ============================================
# 설정
# ============================================
class Config:
    API_URL = os.getenv("API_URL", "http://localhost:3000/api/live-status/update")
    API_SECRET = os.getenv("LIVE_STATUS_API_SECRET", "rg-family-api-secret-2026")
    PANDATV_USERNAME = os.getenv("PANDATV_USERNAME", "")
    PANDATV_PASSWORD = os.getenv("PANDATV_PASSWORD", "")
    PANDATV_BASE_URL = "https://www.pandalive.co.kr"
    
    # 크롤링 설정
    PAGE_LOAD_TIMEOUT = 15
    ELEMENT_WAIT_TIMEOUT = 10
    REQUEST_TIMEOUT = 30
    RETRY_COUNT = 3
    RETRY_DELAY = 5

# BJ 이름 -> member_id 매핑 (organization 테이블 기준)
# 실제 배포 시 Supabase에서 동적으로 가져오는 것을 권장
BJ_MAPPING: Dict[str, int] = {
    "린아": 1,
    "가애": 2,
    "나노": 3,
    "아이린": 4,
    "유나": 5,
    "소아": 6,
    "나나": 7,
    "조이": 8,
    "하린": 9,
    "이태린": 10,
    "지유": 11,
    "예린": 12,
    "시아": 13,
    "사라": 14,
}

# BJ PandaTV URL 매핑 (개별 채널 체크용)
BJ_CHANNEL_URLS: Dict[str, str] = {
    "린아": f"{Config.PANDATV_BASE_URL}/channel/rina",
    "가애": f"{Config.PANDATV_BASE_URL}/channel/gaea",
    "나노": f"{Config.PANDATV_BASE_URL}/channel/nano",
    # ... 나머지 멤버 추가
}


# ============================================
# 유틸리티 함수
# ============================================
def create_driver() -> Optional[webdriver.Chrome]:
    """Headless Chrome 드라이버 생성"""
    if not SELENIUM_AVAILABLE:
        logger.error("Selenium이 설치되지 않았습니다: pip install selenium webdriver-manager")
        return None
    
    options = Options()
    options.add_argument("--headless=new")  # 새로운 headless 모드
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )

    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.set_page_load_timeout(Config.PAGE_LOAD_TIMEOUT)
        return driver
    except Exception as e:
        logger.error(f"드라이버 생성 실패: {e}")
        return None


def fetch_member_mapping_from_api() -> Dict[str, int]:
    """
    API에서 멤버 매핑 정보 가져오기 (선택적)
    """
    try:
        response = requests.get(
            Config.API_URL.replace("/update", ""),  # GET endpoint
            timeout=Config.REQUEST_TIMEOUT
        )
        if response.status_code == 200:
            data = response.json()
            # API 응답 형식에 맞게 파싱
            return {m["name"]: m["id"] for m in data.get("members", [])}
    except Exception as e:
        logger.warning(f"멤버 매핑 API 호출 실패, 기본값 사용: {e}")
    
    return BJ_MAPPING


# ============================================
# PandaTV 크롤러
# ============================================
class PandaTVCrawler:
    """PandaTV 라이브 상태 크롤러"""
    
    def __init__(self, driver: webdriver.Chrome):
        self.driver = driver
        self.logged_in = False
    
    def login(self, username: str, password: str) -> bool:
        """
        PandaTV 로그인
        
        참고: PandaTV의 실제 로그인 페이지 구조에 맞게 수정 필요
        """
        if not username or not password:
            logger.info("로그인 정보 없음 - 비로그인 모드로 진행")
            return False
        
        try:
            login_url = f"{Config.PANDATV_BASE_URL}/login"
            self.driver.get(login_url)
            
            # TODO: 실제 PandaTV 로그인 페이지 DOM에 맞게 수정
            # WebDriverWait(self.driver, Config.ELEMENT_WAIT_TIMEOUT).until(
            #     EC.presence_of_element_located((By.ID, "username"))
            # )
            # self.driver.find_element(By.ID, "username").send_keys(username)
            # self.driver.find_element(By.ID, "password").send_keys(password)
            # self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
            # time.sleep(2)
            
            logger.warning("로그인 로직 미구현 - 실제 DOM 셀렉터 필요")
            self.logged_in = False
            return False
            
        except Exception as e:
            logger.error(f"로그인 실패: {e}")
            return False
    
    def check_channel_live(self, channel_url: str) -> bool:
        """
        개별 채널의 라이브 상태 확인
        
        Args:
            channel_url: PandaTV 채널 URL
            
        Returns:
            bool: 라이브 중이면 True
        """
        try:
            self.driver.get(channel_url)
            
            # 페이지 로드 대기
            WebDriverWait(self.driver, Config.ELEMENT_WAIT_TIMEOUT).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # TODO: PandaTV 실제 라이브 표시 요소에 맞게 수정
            # 일반적인 라이브 표시 패턴들:
            # - "LIVE" 배지
            # - 비디오 플레이어 존재
            # - 특정 클래스명
            
            # 예시 셀렉터들 (실제 사이트에 맞게 수정 필요):
            live_selectors = [
                ".live-badge",
                ".is-live",
                "[data-live='true']",
                ".player-live-indicator",
                ".live-status.on",
            ]
            
            for selector in live_selectors:
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if element.is_displayed():
                        return True
                except NoSuchElementException:
                    continue
            
            return False
            
        except TimeoutException:
            logger.warning(f"페이지 로드 타임아웃: {channel_url}")
            return False
        except Exception as e:
            logger.error(f"채널 체크 실패 ({channel_url}): {e}")
            return False
    
    def get_all_live_members(self) -> Set[str]:
        """
        즐겨찾기/팔로우 페이지에서 라이브 중인 멤버 수집
        
        Returns:
            Set[str]: 라이브 중인 BJ 이름 집합
        """
        live_bjs: Set[str] = set()
        
        try:
            # 방법 1: 즐겨찾기 페이지에서 일괄 확인 (로그인 필요)
            if self.logged_in:
                favorite_url = f"{Config.PANDATV_BASE_URL}/favorite"
                self.driver.get(favorite_url)
                
                WebDriverWait(self.driver, Config.ELEMENT_WAIT_TIMEOUT).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                # TODO: 실제 DOM 구조에 맞게 셀렉터 변경
                # live_elements = self.driver.find_elements(
                #     By.CSS_SELECTOR, ".bj-card.is-live .bj-name"
                # )
                # for elem in live_elements:
                #     bj_name = elem.text.strip()
                #     if bj_name in BJ_MAPPING:
                #         live_bjs.add(bj_name)
            
            # 방법 2: 개별 채널 순회 확인 (로그인 불필요)
            else:
                for bj_name, channel_url in BJ_CHANNEL_URLS.items():
                    if self.check_channel_live(channel_url):
                        live_bjs.add(bj_name)
                        logger.info(f"라이브 감지: {bj_name}")
                    time.sleep(1)  # Rate limiting
                    
        except Exception as e:
            logger.error(f"라이브 멤버 수집 실패: {e}")
        
        return live_bjs


# ============================================
# API 업데이트
# ============================================
def update_live_status_api(live_bj_names: Set[str], mapping: Dict[str, int]) -> bool:
    """
    RG Family API로 라이브 상태 업데이트
    
    Args:
        live_bj_names: 라이브 중인 BJ 이름 집합
        mapping: BJ 이름 -> member_id 매핑
        
    Returns:
        bool: 성공 여부
    """
    updates: List[Dict] = []
    
    for bj_name, member_id in mapping.items():
        is_live = bj_name in live_bj_names
        updates.append({
            "member_id": member_id,
            "is_live": is_live,
        })
    
    if not updates:
        logger.info("업데이트할 데이터 없음")
        return True
    
    headers = {
        "Content-Type": "application/json",
    }
    if Config.API_SECRET:
        headers["x-api-key"] = Config.API_SECRET
    
    for attempt in range(Config.RETRY_COUNT):
        try:
            response = requests.post(
                Config.API_URL,
                headers=headers,
                json={"updates": updates},
                timeout=Config.REQUEST_TIMEOUT,
            )
            
            if response.status_code == 200:
                result = response.json()
                live_count = len(live_bj_names)
                logger.info(f"✅ 업데이트 완료: {result.get('updated', 0)}건 (라이브: {live_count}명)")
                return True
            else:
                logger.error(f"API 오류 ({response.status_code}): {response.text}")
                
        except requests.RequestException as e:
            logger.error(f"요청 실패 (시도 {attempt + 1}/{Config.RETRY_COUNT}): {e}")
            if attempt < Config.RETRY_COUNT - 1:
                time.sleep(Config.RETRY_DELAY)
    
    return False


# ============================================
# 메인 실행
# ============================================
def run_once() -> bool:
    """1회 크롤링 실행"""
    logger.info("=" * 50)
    logger.info("  PandaTV 라이브 상태 크롤러")
    logger.info(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 50)
    
    if not SELENIUM_AVAILABLE:
        logger.error("Selenium 미설치 - pip install selenium webdriver-manager")
        return False
    
    driver = None
    try:
        # 드라이버 초기화
        logger.info("브라우저 초기화...")
        driver = create_driver()
        if not driver:
            return False
        
        crawler = PandaTVCrawler(driver)
        
        # 로그인 (선택적)
        if Config.PANDATV_USERNAME and Config.PANDATV_PASSWORD:
            logger.info("PandaTV 로그인 시도...")
            crawler.login(Config.PANDATV_USERNAME, Config.PANDATV_PASSWORD)
        
        # 라이브 멤버 수집
        logger.info("라이브 상태 수집 중...")
        live_bjs = crawler.get_all_live_members()
        logger.info(f"라이브 BJ: {live_bjs if live_bjs else '없음'}")
        
        # API 업데이트
        logger.info("API 업데이트 중...")
        success = update_live_status_api(live_bjs, BJ_MAPPING)
        
        return success
        
    except Exception as e:
        logger.error(f"실행 오류: {e}")
        return False
        
    finally:
        if driver:
            driver.quit()
            logger.info("브라우저 종료")


def run_continuously(interval_seconds: int = 120):
    """
    지속 실행 모드
    
    Args:
        interval_seconds: 실행 간격 (초), 기본 2분
    """
    logger.info(f"지속 실행 모드 시작 (간격: {interval_seconds}초)")
    
    while True:
        try:
            run_once()
            logger.info(f"다음 실행까지 {interval_seconds}초 대기...")
            time.sleep(interval_seconds)
        except KeyboardInterrupt:
            logger.info("사용자에 의해 중단됨")
            break


def run_test():
    """테스트 모드 - API 연결 테스트"""
    logger.info("=" * 50)
    logger.info("  테스트 모드")
    logger.info("=" * 50)
    
    # 테스트용 라이브 데이터 (린아, 나노만 라이브)
    test_live = {"린아", "나노"}
    
    logger.info(f"테스트 데이터: {test_live}")
    logger.info(f"API URL: {Config.API_URL}")
    logger.info(f"API Secret: {'설정됨' if Config.API_SECRET else '미설정'}")
    
    success = update_live_status_api(test_live, BJ_MAPPING)
    
    if success:
        logger.info("✅ 테스트 성공!")
    else:
        logger.error("❌ 테스트 실패")
    
    return success


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        
        if arg == "--continuous":
            interval = int(sys.argv[2]) if len(sys.argv) > 2 else 120
            run_continuously(interval)
        elif arg == "--test":
            run_test()
        elif arg == "--help":
            print(__doc__)
        else:
            print(f"알 수 없는 옵션: {arg}")
            print("사용법: python crawler_example.py [--continuous [interval]] [--test] [--help]")
    else:
        run_once()
