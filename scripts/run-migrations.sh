#!/bin/bash
# ===========================================
# RG Family - Supabase 마이그레이션 실행 스크립트
# ===========================================

set -e

echo "============================================="
echo "  RG Family Database Migration"
echo "============================================="

# 환경변수 로드
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Supabase URL 확인
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다."
    echo "   .env.local 파일을 확인하세요."
    exit 1
fi

SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
SUPABASE_KEY=$SUPABASE_SERVICE_ROLE_KEY

echo ""
echo "📌 Supabase URL: $SUPABASE_URL"
echo ""

# 마이그레이션 파일 순서대로 실행
MIGRATIONS_DIR="supabase/migrations"

echo "📁 마이그레이션 파일 목록:"
ls -la $MIGRATIONS_DIR
echo ""

echo "⚠️  주의사항:"
echo "   1. Supabase Dashboard > SQL Editor에서 각 파일을 순서대로 실행하세요."
echo "   2. 또는 Supabase CLI를 사용하세요: supabase db push"
echo ""

echo "📋 실행 순서:"
echo "   1. 20241201_init_schema.sql (기본 스키마)"
echo "   2. 20241229_create_banners_table.sql (배너 테이블)"
echo "   3. 20250112_init_schema.sql (스키마 업데이트)"
echo "   4. 20260112_add_rpc_functions.sql (RPC 함수)"
echo "   5. 20260112_create_guestbook_table.sql (방명록)"
echo "   6. 20260112_rls_vip_live.sql (RLS 정책)"
echo ""

# Supabase CLI 확인
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI 감지됨"
    echo ""
    read -p "Supabase CLI로 마이그레이션을 실행할까요? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        echo ""
        echo "🚀 마이그레이션 실행 중..."
        supabase db push
        echo ""
        echo "✅ 마이그레이션 완료!"
    fi
else
    echo "ℹ️  Supabase CLI가 설치되지 않았습니다."
    echo "   설치: npm install -g supabase"
    echo "   또는 Supabase Dashboard에서 수동으로 실행하세요."
fi

echo ""
echo "============================================="
echo "  마이그레이션 가이드 완료"
echo "============================================="
