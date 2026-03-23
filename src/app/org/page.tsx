"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrganization, useBjRanks } from "@/lib/hooks";
import { MemberCard } from "@/components/info";
import type { TierInfo } from "@/components/info/MemberCard";
import type { OrganizationRecord } from "@/types/organization";
import { StationNoticesSidebar } from "@/components/info/StationNoticesSidebar";
import AdminOrgOverlay, { useAdminOrgEdit } from "@/components/info/AdminOrgOverlay";
import { getSupabaseClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

type UnitType = "excel" | "crew";
type SortMode = "default" | "live";

interface RankSection {
  title: string;
  roles: string[];
}

interface RankSectionsConfig {
  excel?: RankSection[];
  crew?: RankSection[];
}

const DEFAULT_SECTIONS: RankSectionsConfig = {
  excel: [
    { title: '대표', roles: ['대표', 'R대표', 'G대표', '이사장', '총장'] },
    { title: '차장 / 과장', roles: ['부총장', '차장', '과장'] },
    { title: '팀장 / 실장', roles: ['팀장', '실장', '비서', '교수'] },
  ],
  crew: [
    { title: '대표', roles: ['대표', 'R대표', 'G대표', '이사장', '총장'] },
    { title: '차장 / 과장', roles: ['부총장', '차장', '과장'] },
    { title: '팀장 / 실장', roles: ['팀장', '실장', '비서', '교수'] },
  ],
};

export default function OrganizationPage() {
  const { members, isLoading, getByUnit, getGroupedByRole, getGroupedBySections, refresh } = useOrganization();
  const { getRankByName } = useBjRanks();
  const [selectedMember, setSelectedMember] = useState<OrganizationRecord | null>(null);
  const [activeUnit, setActiveUnit] = useState<UnitType>("excel");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [rankSections, setRankSections] = useState<RankSectionsConfig>(DEFAULT_SECTIONS);

  // 스타크래프트 티어 데이터 (crew 멤버에 종족/티어 표시용)
  const [tierMap, setTierMap] = useState<Record<string, TierInfo>>({});

  useEffect(() => {
    async function fetchTierData() {
      const supabase = getSupabaseClient();
      const { data: tiers } = await supabase
        .from('starcraft_tiers')
        .select('id, name, color');
      const { data: tierMembers } = await supabase
        .from('starcraft_tier_members')
        .select('player_name, race, tier_id');

      if (tiers && tierMembers) {
        const tierLookup = new Map(tiers.map(t => [t.id, { name: t.name, color: t.color }]));
        const map: Record<string, TierInfo> = {};
        for (const tm of tierMembers) {
          const tier = tierLookup.get(tm.tier_id);
          map[tm.player_name] = {
            race: tm.race || undefined,
            tierName: tier?.name,
            tierColor: tier?.color || undefined,
          };
        }
        setTierMap(map);
      }
    }
    fetchTierData();
  }, []);

  // 직급 구간 설정 로드
  useEffect(() => {
    async function fetchRankSections() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'org_rank_sections')
        .maybeSingle();
      if (data?.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setRankSections(parsed);
        } catch { /* use default */ }
      }
    }
    fetchRankSections();
  }, []);

  // 관리자 편집 기능
  const {
    isAdmin,
    editingMember,
    isModalOpen,
    handleMemberClick,
    handleModalClose,
  } = useAdminOrgEdit(refresh);

  // 멤버 클릭 핸들러 - 관리자는 더블클릭으로 편집, 일반 클릭은 선택
  const handleCardClick = (member: OrganizationRecord) => {
    setSelectedMember(selectedMember?.id === member.id ? null : member);
  };

  // 멤버 더블클릭 핸들러 - 관리자만 편집 모달 열기
  const handleCardDoubleClick = (member: OrganizationRecord) => {
    if (isAdmin) {
      handleMemberClick(member);
    }
  };

  // 유닛별 멤버 분류
  const unitMembers = getByUnit(activeUnit) as OrganizationRecord[];

  // 동적 직급 구간으로 그룹화
  const sections = rankSections[activeUnit] || [];
  const dynamicGroups: { title: string; members: OrganizationRecord[] }[] = useMemo(() => {
    if (sections.length === 0) {
      // 설정 없으면 기존 하드코딩 방식 폴백
      const grouped = getGroupedByRole(unitMembers);
      const result: { title: string; members: OrganizationRecord[] }[] = [];
      if (grouped.leaders.length > 0) result.push({ title: [...new Set(grouped.leaders.map(m => m.role))].join(' / '), members: grouped.leaders });
      if (grouped.directors.length > 0) result.push({ title: [...new Set(grouped.directors.map(m => m.role))].join(' / '), members: grouped.directors });
      if (grouped.managers.length > 0) result.push({ title: [...new Set(grouped.managers.map(m => m.role))].join(' / '), members: grouped.managers });
      if (grouped.members.length > 0) result.push({ title: [...new Set(grouped.members.map(m => m.role))].join(' / ') || '멤버', members: grouped.members });
      return result;
    }
    return getGroupedBySections(unitMembers, sections);
  }, [unitMembers, sections, getGroupedByRole, getGroupedBySections]);

  // 그룹 내 정렬 (기본: 직급순, 방송중: 라이브 멤버 상단)
  const sortedGroups = useMemo(() => {
    return dynamicGroups.map((group, idx) => {
      let sorted = [...group.members];

      if (sortMode === 'live') {
        // 방송중 멤버를 상단으로
        sorted.sort((a, b) => (b.is_live ? 1 : 0) - (a.is_live ? 1 : 0));
      } else if (idx === dynamicGroups.length - 1 && dynamicGroups.length > 1) {
        // 기본 모드: 마지막 그룹(일반 멤버)은 직급전 순위로 정렬
        sorted.sort((a, b) => {
          const rankA = a.current_rank ? getRankByName(a.current_rank)?.level ?? 999 : 999;
          const rankB = b.current_rank ? getRankByName(b.current_rank)?.level ?? 999 : 999;
          return rankA - rankB;
        });
      }

      return { ...group, members: sorted };
    });
  }, [dynamicGroups, getRankByName, sortMode]);

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>조직도</h1>
        <p className={styles.pageDesc}>이노레이블 구성원을 소개합니다</p>
      </header>

      {/* Unit Toggle - Clean Tab Style */}
      <div className={styles.unitHeader}>
        <div className={styles.unitToggle}>
          <button
            className={`${styles.unitTab} ${activeUnit === "excel" ? styles.active : ""}`}
            onClick={() => setActiveUnit("excel")}
          >
            <span className={styles.unitName}>EXCEL UNIT</span>
            <span className={styles.unitCount}>{getByUnit("excel").length}명</span>
          </button>
          <button
            className={`${styles.unitTab} ${activeUnit === "crew" ? styles.active : ""}`}
            onClick={() => setActiveUnit("crew")}
          >
            <span className={styles.unitName}>STAR UNIT</span>
            <span className={styles.unitCount}>{getByUnit("crew").length}명</span>
          </button>
        </div>
      </div>

      {/* Sort Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface, #1a1a1a)', borderRadius: '8px', padding: '4px', border: '1px solid var(--card-border, rgba(255,255,255,0.1))' }}>
          <button
            onClick={() => setSortMode('default')}
            style={{
              padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              background: sortMode === 'default' ? 'var(--color-primary, #fd68ba)' : 'transparent',
              color: sortMode === 'default' ? '#fff' : 'var(--text-tertiary)',
            }}
          >
            기본순
          </button>
          <button
            onClick={() => setSortMode('live')}
            style={{
              padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              background: sortMode === 'live' ? '#00d4ff' : 'transparent',
              color: sortMode === 'live' ? '#fff' : 'var(--text-tertiary)',
            }}
          >
            🔴 방송중 우선
          </button>
        </div>
      </div>

      {/* Main Layout - 2 Column: Content + Station Notices Sidebar */}
      <div className={`${styles.mainLayout} ${selectedMember ? styles.sidebarsOpen : ''}`}>
        {/* Content Area */}
        <div className={styles.contentArea}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>조직도를 불러오는 중...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeUnit}
                className={styles.content}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* 동적 직급 구간 섹션 */}
                {sortedGroups.map((group, groupIdx) => (
                  group.members.length > 0 && (
                    <section key={group.title} className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{group.title}</h2>
                        <span className={styles.sectionCount}>{group.members.length}명</span>
                      </div>
                      <div className={`${styles.grid} ${groupIdx === 0 ? styles.gridLeaders : groupIdx === sortedGroups.length - 1 ? styles.gridMembers : styles.gridManagers}`}>
                        {group.members.map((member, index) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onDoubleClick={() => handleCardDoubleClick(member)}
                          >
                            <MemberCard
                              member={member}
                              size={groupIdx === sortedGroups.length - 1 ? "small" : "medium"}
                              onClick={() => handleCardClick(member)}
                              isSelected={selectedMember?.id === member.id}
                              tierInfo={activeUnit === 'crew' ? tierMap[member.name] : undefined}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )
                ))}

                {/* Empty State */}
                {sortedGroups.every(g => g.members.length === 0) && (
                    <div className={styles.emptyState}>
                      <Users size={48} />
                      <p>해당 유닛에 멤버가 없습니다.</p>
                    </div>
                  )}
              </motion.div>
            </AnimatePresence>
          )}
          <Footer />
        </div>

        {/* Right Sidebar - Station Notices */}
        <div className={styles.rightSidebar}>
          <AnimatePresence mode="wait">
            <StationNoticesSidebar member={selectedMember} onClose={() => setSelectedMember(null)} />
          </AnimatePresence>
        </div>
      </div>

      {/* 관리자 오버레이 */}
      <AdminOrgOverlay
        editingMember={editingMember}
        isModalOpen={isModalOpen}
        onModalClose={handleModalClose}
        onMembersChanged={refresh}
      />
    </div>
  );
}
