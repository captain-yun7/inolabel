'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, FileText, Clock, Radio, Eye, RefreshCw, Film, PenTool, MessageSquare, ShoppingBag, UserCheck } from 'lucide-react'
import { StatsCard, DataTable, Column } from '@/components/admin'
import { useSupabaseContext } from '@/lib/context'
import { useLiveRoster } from '@/lib/hooks'
import styles from './page.module.css'

interface FormatDateOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
}

const formatDate = (dateStr: string, options?: FormatDateOptions): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', options);
};

interface DashboardStats {
  totalMembers: number
  recentlyActiveMembers: number
  activeSeasons: number
  recentMembers: RecentMember[]
  totalPosts: number
  totalMedia: number
  totalSignatures: number
}

interface RecentMember {
  id: string
  nickname: string
  email: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const supabase = useSupabaseContext()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [goodsShopVisible, setGoodsShopVisible] = useState(true)
  const [isTogglingGoods, setIsTogglingGoods] = useState(false)

  // 실시간 라이브 상태
  const { members, liveStatusByMemberId, isLoading: liveLoading, refetch: refetchLive } = useLiveRoster({ realtime: true })
  const liveMembers = members.filter(m => m.is_live)
  const totalViewers = Object.values(liveStatusByMemberId)
    .flat()
    .filter(status => status.isLive)
    .reduce((sum, status) => sum + status.viewerCount, 0)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)

    try {
      // 회원 수
      const { count: memberCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // 활성 시즌
      const { count: activeSeasonCount } = await supabase
        .from('seasons')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // 최근 가입
      const { data: recentMembers } = await supabase
        .from('profiles')
        .select('id, nickname, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // 최근 24시간 활동 회원 수 (게시글 또는 댓글 작성)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const [recentPostAuthors, recentCommentAuthors] = await Promise.all([
        supabase.from('posts').select('author_id').gte('created_at', oneDayAgo),
        supabase.from('comments').select('author_id').gte('created_at', oneDayAgo),
      ])
      const activeAuthorIds = new Set([
        ...(recentPostAuthors.data || []).map(p => p.author_id),
        ...(recentCommentAuthors.data || []).map(c => c.author_id),
      ])

      // 콘텐츠 통계 - 병렬 처리
      const [postsCount, mediaCount, signaturesCount] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('media_content').select('*', { count: 'exact', head: true }),
        supabase.from('signatures').select('*', { count: 'exact', head: true }),
      ])

      // 굿즈샵 설정
      const { data: goodsSetting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'goods_shop_visible')
        .single()

      if (goodsSetting) {
        setGoodsShopVisible(goodsSetting.value === 'true' || goodsSetting.value === true)
      }

      setStats({
        totalMembers: memberCount || 0,
        recentlyActiveMembers: activeAuthorIds.size,
        activeSeasons: activeSeasonCount || 0,
        recentMembers: (recentMembers || []).map((m) => ({
          id: m.id,
          nickname: m.nickname,
          email: m.email || '',
          createdAt: m.created_at,
        })),
        totalPosts: postsCount.count || 0,
        totalMedia: mediaCount.count || 0,
        totalSignatures: signaturesCount.count || 0,
      })
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error)
    }

    setIsLoading(false)
  }, [supabase])

  const handleToggleGoodsShop = async () => {
    setIsTogglingGoods(true)
    const newValue = !goodsShopVisible
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'goods_shop_visible', value: String(newValue), updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (!error) {
      setGoodsShopVisible(newValue)
    }
    setIsTogglingGoods(false)
  }

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const formatDateTime = (dateStr: string) =>
    formatDate(dateStr, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const memberColumns: Column<RecentMember>[] = [
    { key: 'nickname', header: '닉네임' },
    { key: 'email', header: '이메일' },
    {
      key: 'createdAt',
      header: '가입일',
      width: '140px',
      render: (item) => formatDateTime(item.createdAt),
    },
  ]

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>대시보드 로딩 중...</span>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <p className={styles.subtitle}>이노레이블 관리자 페이지</p>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="전체 회원"
          value={stats?.totalMembers.toLocaleString() || '0'}
          icon={Users}
          color="primary"
          delay={0}
        />
        <StatsCard
          title="24시간 활동"
          value={stats?.recentlyActiveMembers.toLocaleString() || '0'}
          icon={UserCheck}
          color="success"
          delay={0.1}
        />
      </div>

      {/* 사이트 설정 토글 */}
      <motion.div
        className={styles.contentStatsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div
          className={styles.contentStatCard}
          style={{ cursor: 'pointer', opacity: isTogglingGoods ? 0.5 : 1 }}
          onClick={handleToggleGoodsShop}
        >
          <ShoppingBag size={20} className={styles.contentStatIcon} />
          <div className={styles.contentStatInfo}>
            <span className={styles.contentStatValue}>{goodsShopVisible ? 'ON' : 'OFF'}</span>
            <span className={styles.contentStatLabel}>레이블 굿즈샵</span>
          </div>
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: goodsShopVisible ? '#fd68ba' : '#555',
            position: 'relative', transition: 'background 0.2s', marginLeft: 'auto',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 2,
              left: goodsShopVisible ? 18 : 2,
              transition: 'left 0.2s',
            }} />
          </div>
        </div>
      </motion.div>

      {/* Content Stats */}
      <motion.div
        className={styles.contentStatsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className={styles.contentStatCard}>
          <MessageSquare size={20} className={styles.contentStatIcon} />
          <div className={styles.contentStatInfo}>
            <span className={styles.contentStatValue}>{stats?.totalPosts || 0}</span>
            <span className={styles.contentStatLabel}>게시글</span>
          </div>
        </div>
        <div className={styles.contentStatCard}>
          <Film size={20} className={styles.contentStatIcon} />
          <div className={styles.contentStatInfo}>
            <span className={styles.contentStatValue}>{stats?.totalMedia || 0}</span>
            <span className={styles.contentStatLabel}>미디어</span>
          </div>
        </div>
        <div className={styles.contentStatCard}>
          <PenTool size={20} className={styles.contentStatIcon} />
          <div className={styles.contentStatInfo}>
            <span className={styles.contentStatValue}>{stats?.totalSignatures || 0}</span>
            <span className={styles.contentStatLabel}>시그니처</span>
          </div>
        </div>
      </motion.div>

      {/* Live Status Section */}
      <motion.section
        className={styles.liveSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.liveHeaderLeft}>
            <Radio size={20} className={styles.liveIcon} />
            <h2>실시간 라이브 현황</h2>
            {liveMembers.length > 0 && (
              <span className={styles.liveBadge}>{liveMembers.length} LIVE</span>
            )}
          </div>
          <button
            onClick={() => refetchLive()}
            className={styles.refreshBtn}
            disabled={liveLoading}
          >
            <RefreshCw size={16} className={liveLoading ? styles.spinning : ''} />
            <span>새로고침</span>
          </button>
        </div>

        <div className={styles.liveStatsRow}>
          <div className={styles.liveStat}>
            <Radio size={18} className={styles.liveStatIcon} />
            <div className={styles.liveStatInfo}>
              <span className={styles.liveStatValue}>{liveMembers.length}</span>
              <span className={styles.liveStatLabel}>방송 중</span>
            </div>
          </div>
          <div className={styles.liveStat}>
            <Eye size={18} />
            <div className={styles.liveStatInfo}>
              <span className={styles.liveStatValue}>{totalViewers.toLocaleString()}</span>
              <span className={styles.liveStatLabel}>총 시청자</span>
            </div>
          </div>
          <div className={styles.liveStat}>
            <Users size={18} />
            <div className={styles.liveStatInfo}>
              <span className={styles.liveStatValue}>{members.length}</span>
              <span className={styles.liveStatLabel}>전체 멤버</span>
            </div>
          </div>
        </div>

        {liveMembers.length > 0 ? (
          <div className={styles.liveList}>
            {liveMembers.map((member) => {
              const liveEntries = liveStatusByMemberId[member.id] || []
              const activeLive = liveEntries.find(e => e.isLive)
              return (
                <div key={member.id} className={styles.liveCard}>
                  <div className={styles.liveCardHeader}>
                    <div className={styles.liveIndicator} />
                    <span className={styles.liveName}>{member.name}</span>
                    <span className={`${styles.liveUnit} ${member.unit === 'excel' ? styles.excel : styles.crew}`}>
                      {member.unit === 'excel' ? 'EXCEL' : 'STAR'}
                    </span>
                  </div>
                  {activeLive && (
                    <div className={styles.liveCardStats}>
                      <span className={styles.livePlatform}>{activeLive.platform}</span>
                      <span className={styles.liveViewers}>
                        <Eye size={12} />
                        {activeLive.viewerCount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className={styles.noLive}>
            <Radio size={24} />
            <p>현재 방송 중인 멤버가 없습니다</p>
          </div>
        )}
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className={styles.sectionHeader}>
          <Users size={20} />
          <h2>최근 가입</h2>
        </div>
        <DataTable
          data={stats?.recentMembers || []}
          columns={memberColumns}
          searchable={false}
          itemsPerPage={5}
        />
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        className={styles.quickActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2>빠른 작업</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/schedules" className={styles.actionCard}>
            <Calendar size={24} />
            <span>일정 추가</span>
          </a>
          <a href="/admin/notices" className={styles.actionCard}>
            <FileText size={24} />
            <span>공지 작성</span>
          </a>
          <a href="/admin/seasons" className={styles.actionCard}>
            <Clock size={24} />
            <span>시즌 관리</span>
          </a>
        </div>
      </motion.section>
    </div>
  )
}
