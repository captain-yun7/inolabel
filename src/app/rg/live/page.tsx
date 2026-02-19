"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLiveRoster, useBjRanks } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { OrganizationRecord, UnitFilter } from "@/types/organization";
import { Radio, Target } from "lucide-react";
import styles from "./page.module.css";

// SOOP TV URL 생성
const getSoopTvUrl = (id: string) => `https://play.sooplive.co.kr/${id}`;

// 엑셀부 직급 계층
const EXCEL_TIERS: { label: string; roles: string[] }[] = [
  { label: '대표', roles: ['대표', 'R대표', 'G대표'] },
  { label: '간부', roles: ['부장', '차장', '과장', '팀장'] },
];

// 스타부 직급 계층
const CREW_TIERS: { label: string; roles: string[] }[] = [
  { label: '이사장', roles: ['이사장'] },
  { label: '임원', roles: ['총장', '부총장', '교수진', '교수'] },
];

/**
 * 현재 직급에 해당하는 공약 한 줄 추출
 */
function getCurrentPledge(
  pledgeText: string | null | undefined,
  currentRankPosition: number | null
): { rankLabel: string; content: string } | null {
  if (!pledgeText || currentRankPosition === null) return null;

  const lines = pledgeText.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const match = line.match(/^\[?(\d+(?:[,&\s]*\d+)*(?:등)?)\]?\s*(.+?)\s*[▶ㅡ\-→]\s*(.+)$/);
    if (match) {
      const rankStr = match[1].replace(/등$/, '').replace(/\s+/g, '');
      const ranks = rankStr.split(/[,&]/).map(r => r.trim()).filter(Boolean);
      if (ranks.some(r => parseInt(r, 10) === currentRankPosition)) {
        return { rankLabel: match[2].trim(), content: match[3].trim() };
      }
    } else {
      const simpleMatch = line.match(/^(\d+(?:[,&\s]*\d+)*(?:등)?)\s+(.+?)\s+[▶ㅡ\-→]\s*(.+)$/);
      if (simpleMatch) {
        const rankStr = simpleMatch[1].replace(/등$/, '').replace(/\s+/g, '');
        const ranks = rankStr.split(/[,&]/).map(r => r.trim()).filter(Boolean);
        if (ranks.some(r => parseInt(r, 10) === currentRankPosition)) {
          return { rankLabel: simpleMatch[2].trim(), content: simpleMatch[3].trim() };
        }
      }
    }
  }

  return null;
}

export default function LivePage() {
  const { members, isLoading } = useLiveRoster({ realtime: true });
  const { getRankByName } = useBjRanks();
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('all');

  // Filter by unit
  const unitFilteredMembers = useMemo(() => {
    return unitFilter === 'all'
      ? members
      : members.filter((member) => member.unit === unitFilter);
  }, [members, unitFilter]);

  // 직급 순으로 정렬
  const sortByRank = useCallback((memberList: OrganizationRecord[]) => {
    return [...memberList].sort((a, b) => {
      const rankA = a.current_rank ? getRankByName(a.current_rank)?.level ?? 999 : 999;
      const rankB = b.current_rank ? getRankByName(b.current_rank)?.level ?? 999 : 999;
      return rankA - rankB;
    });
  }, [getRankByName]);

  // 유닛별 멤버를 계층 구조로 그룹화
  const groupMembersByTier = useCallback((memberList: OrganizationRecord[], unit: 'excel' | 'crew') => {
    const tiers = unit === 'excel' ? EXCEL_TIERS : CREW_TIERS;
    const groups: { label: string; members: OrganizationRecord[] }[] = [];
    const assigned = new Set<number>();

    for (const tier of tiers) {
      const tierMembers = memberList.filter(m =>
        tier.roles.some(r => m.role === r) && !assigned.has(m.id)
      );
      tierMembers.forEach(m => assigned.add(m.id));
      if (tierMembers.length > 0) {
        groups.push({ label: tier.label, members: sortByRank(tierMembers) });
      }
    }

    const remaining = memberList.filter(m => !assigned.has(m.id));
    if (remaining.length > 0) {
      const label = unit === 'excel' ? '그외 직급' : '학생';
      groups.push({ label, members: sortByRank(remaining) });
    }

    return groups;
  }, [sortByRank]);

  // 유닛별 그룹화
  const excelMembers = useMemo(() =>
    groupMembersByTier(members.filter(m => m.unit === 'excel'), 'excel'),
    [members, groupMembersByTier]
  );

  const crewMembers = useMemo(() =>
    groupMembersByTier(members.filter(m => m.unit === 'crew'), 'crew'),
    [members, groupMembersByTier]
  );

  // 전체 보기일 때는 두 유닛 모두 표시
  const allGrouped = useMemo(() => {
    if (unitFilter === 'excel') return [{ unitLabel: '엑셀부', groups: excelMembers }];
    if (unitFilter === 'crew') return [{ unitLabel: '스타부', groups: crewMembers }];
    return [
      { unitLabel: '엑셀부', groups: excelMembers },
      { unitLabel: '스타부', groups: crewMembers },
    ];
  }, [unitFilter, excelMembers, crewMembers]);

  const liveCount = unitFilteredMembers.filter(m => m.is_live).length;
  const totalCount = unitFilteredMembers.length;

  // 멤버 카드 렌더링 (공약표 인라인 포함)
  const renderMemberCard = (member: OrganizationRecord, index: number) => {
    const soopId = member.social_links?.sooptv || member.social_links?.pandatv;
    const rankLevel = member.current_rank
      ? getRankByName(member.current_rank)?.level ?? null
      : null;
    const pledge = getCurrentPledge(
      member.profile_info?.position_pledge,
      rankLevel
    );

    return (
      <motion.div
        key={member.id}
        className={`${styles.orgCard} ${member.is_live ? styles.liveCard : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <div className={`${styles.cardAvatar} ${member.is_live ? styles.liveAvatar : ''}`}>
          {member.image_url ? (
            <Image
              src={member.image_url}
              alt={member.name}
              fill
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {member.name.charAt(0)}
            </div>
          )}
          {member.is_live && <span className={styles.liveBadge}>Live</span>}
        </div>
        <div className={styles.cardInfo}>
          <span className={styles.cardName}>{member.name}</span>
          <span className={styles.cardRole}>
            {member.role === '대표' || member.role === 'R대표' || member.role === 'G대표'
              ? member.role
              : member.current_rank || member.role}
          </span>
          {member.is_live && soopId && (
            <a
              href={getSoopTvUrl(soopId)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.watchBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <Radio size={12} />
              시청하기
            </a>
          )}
          {pledge && (
            <div className={styles.pledgeBadge}>
              <span className={styles.pledgeRankLabel}>
                <Target size={10} />
                {pledge.rankLabel}
              </span>
              <span className={styles.pledgeContent}>{pledge.content}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>라이브 방송</h1>
        <p className={styles.pageDesc}>이노레이블 멤버들의 실시간 방송 현황</p>
      </header>

      {/* Content */}
      <div className={styles.container}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.unitFilter}>
            {(['all', 'excel', 'crew'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setUnitFilter(unit)}
                className={`${styles.unitButton} ${unitFilter === unit ? styles.active : ''}`}
                data-unit={unit}
              >
                {unit === 'all' ? '전체' : unit === 'excel' ? '엑셀부' : '스타부'}
              </button>
            ))}
          </div>
          <div className={styles.statsBar}>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              <span className={styles.liveCount}>LIVE {liveCount}</span>
            </div>
            <span className={styles.totalCount}>전체 {totalCount}명</span>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>멤버 목록을 불러오는 중...</span>
          </div>
        ) : (
          <div className={styles.orgChart}>
            {allGrouped.map(({ unitLabel, groups }) => (
              <section key={unitLabel} className={styles.unitSection}>
                <h2 className={styles.unitSectionTitle}>{unitLabel}</h2>
                {groups.map((group) => (
                  <div key={group.label} className={styles.tierGroup}>
                    <div className={styles.tierLabel}>
                      <span className={styles.tierLine} />
                      <span className={styles.tierText}>{group.label}</span>
                      <span className={styles.tierLine} />
                    </div>
                    <div className={styles.grid}>
                      {group.members.map((member, index) => renderMemberCard(member, index))}
                    </div>
                  </div>
                ))}
              </section>
            ))}

            {totalCount === 0 && (
              <div className={styles.empty}>
                <Radio size={48} className={styles.emptyIcon} />
                <p>등록된 멤버가 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
