"""
PandaTV Live Status Checker using Public API

PandaTV 내부 API를 사용하여 라이브 상태를 확인합니다.
Playwright 없이 간단한 HTTP 요청으로 동작합니다.
"""
import httpx
from dataclasses import dataclass
from typing import Optional

from config import DEBUG

PANDATV_API_URL = "https://api.pandalive.co.kr/v1/live"


@dataclass
class LiveStatus:
    """라이브 상태 결과"""
    user_id: str
    is_live: bool
    user_nick: Optional[str] = None
    viewer_count: Optional[int] = None
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    error: Optional[str] = None


def get_all_live_streams() -> list[dict]:
    """
    현재 라이브 중인 모든 BJ 목록 조회 (페이지네이션 처리)

    Returns:
        라이브 중인 BJ 정보 리스트
    """
    all_streams = []
    offset = 0
    limit = 100  # 한 번에 가져올 최대 개수

    try:
        while True:
            response = httpx.get(
                PANDATV_API_URL,
                params={"offset": offset, "limit": limit},
                headers={"User-Agent": "Mozilla/5.0"},
                timeout=30.0
            )
            response.raise_for_status()

            data = response.json()

            if not data.get("result"):
                if DEBUG:
                    print(f"[API] Request failed: {data.get('message', 'Unknown error')}")
                break

            live_list = data.get("list", [])

            if not live_list:
                break

            all_streams.extend(live_list)

            # 가져온 개수가 limit보다 적으면 마지막 페이지
            if len(live_list) < limit:
                break

            offset += limit

        if DEBUG:
            print(f"[API] Found {len(all_streams)} live streams")

        return all_streams

    except Exception as e:
        if DEBUG:
            print(f"[API] Error: {e}")
        return all_streams


def check_user_live_status(user_id: str) -> LiveStatus:
    """
    특정 유저의 라이브 상태 확인

    Args:
        user_id: PandaTV 유저 ID

    Returns:
        LiveStatus 객체
    """
    live_streams = get_all_live_streams()

    # 라이브 목록에서 해당 유저 찾기
    for stream in live_streams:
        if stream.get("userId") == user_id:
            return LiveStatus(
                user_id=user_id,
                is_live=True,
                user_nick=stream.get("userNick"),
                viewer_count=stream.get("user"),
                thumbnail_url=stream.get("thumbUrl"),
                title=stream.get("title")
            )

    # 라이브 목록에 없으면 오프라인
    return LiveStatus(
        user_id=user_id,
        is_live=False
    )


def check_multiple_users(user_ids: list[str]) -> list[LiveStatus]:
    """
    여러 유저의 라이브 상태를 한 번에 확인

    API 호출 1회로 모든 유저 상태 확인 가능

    Args:
        user_ids: PandaTV 유저 ID 목록

    Returns:
        LiveStatus 리스트
    """
    live_streams = get_all_live_streams()

    # userId -> stream 맵 생성
    live_map = {stream.get("userId"): stream for stream in live_streams}

    results = []
    for user_id in user_ids:
        stream = live_map.get(user_id)

        if stream:
            results.append(LiveStatus(
                user_id=user_id,
                is_live=True,
                user_nick=stream.get("userNick"),
                viewer_count=stream.get("user"),
                thumbnail_url=stream.get("thumbUrl"),
                title=stream.get("title")
            ))
        else:
            results.append(LiveStatus(
                user_id=user_id,
                is_live=False
            ))

    return results


# 테스트용
if __name__ == "__main__":
    print("=== PandaTV Live Streams ===\n")

    streams = get_all_live_streams()

    for stream in streams[:10]:
        print(f"  {stream['userId']:15} | {stream['userNick']:10} | viewers: {stream['user']:4}")

    print(f"\nTotal: {len(streams)} live streams")
