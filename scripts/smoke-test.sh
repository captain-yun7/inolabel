#!/bin/bash
# RG Family 홈페이지 스모크 테스트
# 사용법: ./scripts/smoke-test.sh [port]

set -e

PORT=${1:-3000}
BASE_URL="http://localhost:$PORT"
TIMEOUT=30
FAILED=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 RG Family Smoke Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Base URL: $BASE_URL"
echo ""

# 서버 준비 대기
echo "⏳ Waiting for server to be ready..."
for i in $(seq 1 $TIMEOUT); do
  if curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo "✅ Server ready (${i}s)"
    break
  fi
  if [ $i -eq $TIMEOUT ]; then
    echo "❌ Server timeout after ${TIMEOUT}s"
    exit 1
  fi
  sleep 1
done

echo ""
echo "📋 Testing critical pages..."
echo ""

# P0: 최우선 페이지
P0_PAGES=(
  "/:홈페이지"
  "/ranking:랭킹"
  "/rg/org:조직도"
)

# P1: 중요 페이지
P1_PAGES=(
  "/notice:공지사항"
  "/rg/sig:시그니처"
  "/rg/live:라이브"
  "/schedule:스케줄"
  "/community/free:자유게시판"
  "/community/vip:VIP라운지"
  "/login:로그인"
)

test_page() {
  local path=$1
  local name=$2
  local priority=$3

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}" --max-time 10 2>/dev/null || echo "000")

  if [ "$STATUS" == "200" ]; then
    echo "  [$priority] ✅ $name ($path) → $STATUS"
  else
    echo "  [$priority] ❌ $name ($path) → $STATUS"
    FAILED=1
  fi
}

echo "━━ P0: Critical ━━"
for item in "${P0_PAGES[@]}"; do
  IFS=':' read -r path name <<< "$item"
  test_page "$path" "$name" "P0"
done

echo ""
echo "━━ P1: Important ━━"
for item in "${P1_PAGES[@]}"; do
  IFS=':' read -r path name <<< "$item"
  test_page "$path" "$name" "P1"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
  echo "✅ All smoke tests PASSED"
  exit 0
else
  echo "❌ Some smoke tests FAILED"
  exit 1
fi
