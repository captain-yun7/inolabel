"""
Supabase Database Operations
"""
from datetime import datetime, timezone
from typing import Optional
from supabase import create_client, Client

from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEBUG
from scraper import LiveStatus


def get_supabase_client() -> Client:
    """Supabase 클라이언트 생성"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")

    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def get_pandatv_members(client: Client) -> list[dict]:
    """
    PandaTV ID가 있는 활성 멤버 조회

    social_links.pandatv에 ID만 저장되어 있음 (예: "hj042300")

    Returns:
        [{"id": 1, "user_id": "hj042300", "is_live": false}, ...]
    """
    response = client.table("organization").select(
        "id, social_links, is_live"
    ).eq("is_active", True).execute()

    members = []
    for row in response.data:
        social_links = row.get("social_links") or {}
        pandatv_id = social_links.get("pandatv")

        if pandatv_id:
            members.append({
                "id": row["id"],
                "user_id": pandatv_id,  # ID 직접 사용
                "is_live": row.get("is_live", False)
            })

    return members


def update_live_status(
    client: Client,
    member_id: int,
    user_id: str,
    status: LiveStatus
) -> None:
    """
    라이브 상태 업데이트

    - live_status 테이블 upsert
    - organization.is_live 업데이트
    """
    now = datetime.now(timezone.utc).isoformat()

    # live_status 테이블 업데이트 (존재 확인 후 insert/update)
    live_status_data = {
        "member_id": member_id,
        "platform": "pandatv",
        "stream_url": f"https://www.pandalive.co.kr/play/{user_id}",
        "thumbnail_url": status.thumbnail_url,
        "is_live": status.is_live,
        "viewer_count": status.viewer_count or 0,
        "last_checked": now,
    }

    try:
        # 먼저 기존 레코드 확인
        existing = client.table("live_status").select("id").eq(
            "member_id", member_id
        ).eq("platform", "pandatv").execute()

        if existing.data:
            # 존재하면 업데이트
            client.table("live_status").update({
                "stream_url": live_status_data["stream_url"],
                "thumbnail_url": live_status_data["thumbnail_url"],
                "is_live": live_status_data["is_live"],
                "viewer_count": live_status_data["viewer_count"],
                "last_checked": live_status_data["last_checked"],
            }).eq("member_id", member_id).eq("platform", "pandatv").execute()
        else:
            # 없으면 삽입
            client.table("live_status").insert(live_status_data).execute()

        if DEBUG:
            print(f"[DB] Updated live_status for member {member_id}")
    except Exception as e:
        print(f"[DB] Error updating live_status: {e}")

    # organization.is_live 업데이트
    try:
        client.table("organization").update({
            "is_live": status.is_live
        }).eq("id", member_id).execute()

        if DEBUG:
            print(f"[DB] Updated organization.is_live for member {member_id} to {status.is_live}")
    except Exception as e:
        print(f"[DB] Error updating organization: {e}")


def batch_update_live_status(
    client: Client,
    members: list[dict],
    statuses: list[LiveStatus]
) -> dict:
    """
    여러 멤버의 라이브 상태 일괄 업데이트

    Returns:
        {"total": 10, "updated": 8, "live": 2, "errors": [...]}
    """
    result = {
        "total": len(members),
        "updated": 0,
        "live": 0,
        "errors": []
    }

    # user_id -> status 맵
    status_map = {s.user_id: s for s in statuses}

    for member in members:
        user_id = member["user_id"]
        status = status_map.get(user_id)

        if not status:
            result["errors"].append(f"No status for {user_id}")
            continue

        if status.error:
            result["errors"].append(f"{user_id}: {status.error}")
            continue

        try:
            update_live_status(client, member["id"], user_id, status)
            result["updated"] += 1
            if status.is_live:
                result["live"] += 1
        except Exception as e:
            result["errors"].append(f"{user_id}: {str(e)}")

    return result
