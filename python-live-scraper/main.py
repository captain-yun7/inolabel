#!/usr/bin/env python3
"""
PandaTV Live Status Checker - Main Entry Point

PandaTV API를 사용하여 라이브 상태를 확인합니다.

Usage:
    # 한 번 실행
    python main.py

    # 스케줄러로 반복 실행
    python main.py --schedule

    # 특정 유저만 테스트
    python main.py --test user_id

    # 현재 라이브 목록 보기
    python main.py --list
"""
import argparse
from datetime import datetime

import schedule
import time

from config import SCRAPE_INTERVAL_SECONDS, DEBUG
from scraper import get_all_live_streams, check_multiple_users, check_user_live_status
from db import get_supabase_client, get_pandatv_members, batch_update_live_status


def sync_live_status():
    """
    모든 PandaTV 멤버의 라이브 상태 동기화
    """
    print(f"\n{'='*50}")
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting live status sync...")
    print(f"{'='*50}")

    try:
        # Supabase 연결
        client = get_supabase_client()

        # PandaTV 멤버 조회
        members = get_pandatv_members(client)
        print(f"Found {len(members)} PandaTV members")

        if not members:
            print("No PandaTV members to check")
            return

        # 유저 ID 목록
        user_ids = [m["user_id"] for m in members]
        print(f"Users: {user_ids}")

        # 라이브 상태 확인 (API 1회 호출로 전체 확인)
        print("\nChecking live status via API...")
        statuses = check_multiple_users(user_ids)

        # 결과 출력
        for status in statuses:
            emoji = "🔴" if status.is_live else "⚫"
            print(f"  {emoji} {status.user_id}: {'LIVE' if status.is_live else 'offline'}")
            if status.viewer_count:
                print(f"      viewers: {status.viewer_count}")

        # DB 업데이트
        print("\nUpdating database...")
        result = batch_update_live_status(client, members, statuses)

        print(f"\n{'='*50}")
        print(f"Sync completed!")
        print(f"  Total: {result['total']}")
        print(f"  Updated: {result['updated']}")
        print(f"  Live: {result['live']}")
        if result["errors"]:
            print(f"  Errors: {len(result['errors'])}")
            for err in result["errors"][:5]:
                print(f"    - {err}")
        print(f"{'='*50}\n")

    except Exception as e:
        print(f"\n[ERROR] Sync failed: {e}")
        raise


def test_user(user_id: str):
    """단일 유저 테스트"""
    print(f"\nTesting user: {user_id}")

    status = check_user_live_status(user_id)

    print(f"\nResult:")
    print(f"  User ID: {status.user_id}")
    print(f"  Live: {status.is_live}")
    if status.is_live:
        print(f"  Nickname: {status.user_nick}")
        print(f"  Title: {status.title}")
        print(f"  Viewers: {status.viewer_count}")
        print(f"  Thumbnail: {status.thumbnail_url}")


def list_live_streams():
    """현재 라이브 중인 모든 BJ 목록"""
    print("\n=== PandaTV Live Streams ===\n")

    streams = get_all_live_streams()

    if not streams:
        print("No live streams found")
        return

    for stream in streams:
        print(f"  {stream['userId']:15} | {stream['userNick']:15} | viewers: {stream['user']:4} | {stream.get('title', '')[:30]}")

    print(f"\nTotal: {len(streams)} live streams")


def main():
    parser = argparse.ArgumentParser(description="PandaTV Live Status Checker")
    parser.add_argument(
        "--schedule",
        action="store_true",
        help=f"Run on schedule every {SCRAPE_INTERVAL_SECONDS} seconds"
    )
    parser.add_argument(
        "--test",
        type=str,
        metavar="USER_ID",
        help="Test a specific user"
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List all currently live streams"
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug mode"
    )

    args = parser.parse_args()

    # Debug 모드 오버라이드
    if args.debug:
        import config
        config.DEBUG = True

    if args.list:
        # 라이브 목록 보기
        list_live_streams()
    elif args.test:
        # 단일 유저 테스트
        test_user(args.test)
    elif args.schedule:
        # 스케줄러 모드
        print(f"Starting scheduler (interval: {SCRAPE_INTERVAL_SECONDS}s)")
        print("Press Ctrl+C to stop\n")

        # 즉시 한 번 실행
        sync_live_status()

        # 스케줄 등록
        schedule.every(SCRAPE_INTERVAL_SECONDS).seconds.do(sync_live_status)

        while True:
            schedule.run_pending()
            time.sleep(1)
    else:
        # 한 번 실행
        sync_live_status()


if __name__ == "__main__":
    main()
