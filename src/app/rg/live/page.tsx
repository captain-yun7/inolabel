"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLiveRoster } from "@/lib/hooks";
import { extractBjId } from "@/lib/soop/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { OrganizationRecord, UnitFilter } from "@/types/organization";
import type { SoopBoardPost } from "@/lib/soop/types";
import type { SoopLiveStatus } from "@/lib/soop/types";
import { Radio, FileText, Eye, MessageCircle } from "lucide-react";
import styles from "./page.module.css";

// SOOP TV URL 생성
const getSoopTvUrl = (id: string) => `https://play.sooplive.co.kr/${id}`;

// 멤버 공지사항 타입
interface MemberNotice extends SoopBoardPost {
  memberName: string;
  memberImage: string | null;
  bjId: string;
}

// 상대 시간 계산
function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

// 멤버에서 SOOP bjId 추출 헬퍼
function getMemberBjId(member: OrganizationRecord): string | null {
  const soopUrl = member.social_links?.soop || member.social_links?.sooptv || member.social_links?.pandatv;
  if (!soopUrl) return null;
  return extractBjId(soopUrl);
}

export default function LivePage() {
  const { members, isLoading } = useLiveRoster({ realtime: true });
  const [unitFilter, setUnitFilter] = useState<UnitFilter>("all");
  const [notices, setNotices] = useState<MemberNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  // SOOP API 실시간 라이브 상태
  const [soopLiveMap, setSoopLiveMap] = useState<Record<string, SoopLiveStatus>>({});
  const [liveCheckDone, setLiveCheckDone] = useState(false);
  const liveCheckRef = useRef(false);

  // 이름 기반 중복 제거 (김인호 excel + crew)
  const uniqueMembers = useMemo(() => {
    const seen = new Set<string>();
    return members.filter((m) => {
      if (seen.has(m.name)) return false;
      seen.add(m.name);
      return true;
    });
  }, [members]);

  // SOOP API로 직접 라이브 상태 체크
  useEffect(() => {
    if (uniqueMembers.length === 0 || liveCheckRef.current) return;
    liveCheckRef.current = true;

    const bjIds: string[] = [];
    for (const m of uniqueMembers) {
      const bjId = getMemberBjId(m);
      if (bjId) bjIds.push(bjId);
    }

    if (bjIds.length === 0) {
      setLiveCheckDone(true);
      return;
    }

    fetch(`/api/soop/live?bjIds=${bjIds.join(",")}`)
      .then((res) => res.json())
      .then((json) => {
        const statuses: SoopLiveStatus[] = json.data || [];
        const map: Record<string, SoopLiveStatus> = {};
        for (const s of statuses) {
          map[s.bjId] = s;
        }
        setSoopLiveMap(map);
      })
      .catch(console.error)
      .finally(() => setLiveCheckDone(true));
  }, [uniqueMembers]);

  // 멤버에 실시간 라이브 상태 병합
  const membersWithLive = useMemo(() => {
    return uniqueMembers.map((m) => {
      const bjId = getMemberBjId(m);
      const soopStatus = bjId ? soopLiveMap[bjId] : null;
      if (soopStatus?.isLive) {
        return { ...m, is_live: true, _soopStatus: soopStatus };
      }
      return { ...m, _soopStatus: soopStatus || null };
    });
  }, [uniqueMembers, soopLiveMap]);

  // 유닛 필터 적용
  const filteredMembers = useMemo(() => {
    return unitFilter === "all"
      ? membersWithLive
      : membersWithLive.filter((m) => m.unit === unitFilter);
  }, [membersWithLive, unitFilter]);

  // 라이브 중인 멤버만
  const liveMembers = useMemo(() => {
    return filteredMembers.filter((m) => m.is_live);
  }, [filteredMembers]);

  const liveCount = liveMembers.length;

  // 전체 멤버 공지사항 수집 (서버 bulk API, 5분 캐시)
  const fetchAllNotices = useCallback(async () => {
    setNoticesLoading(true);
    try {
      const res = await fetch("/api/soop/notices");
      if (!res.ok) throw new Error("notices API failed");
      const json = await res.json();
      setNotices(json.data || []);
    } catch (error) {
      console.error("공지사항 수집 실패:", error);
    } finally {
      setNoticesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNotices();
  }, [fetchAllNotices]);

  // 라이브 카드 렌더링
  const renderLiveCard = (member: OrganizationRecord & { _soopStatus?: SoopLiveStatus | null }, index: number) => {
    const bjId = getMemberBjId(member);
    const soopStatus = member._soopStatus;
    const thumbnailUrl = soopStatus?.thumbnailUrl;

    return (
      <motion.a
        key={member.id}
        className={styles.liveCard}
        href={bjId ? getSoopTvUrl(bjId) : "#"}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {/* 썸네일 */}
        <div className={styles.liveThumbnail}>
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={`${member.name} 방송`}
              fill
              className={styles.thumbnailImage}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className={styles.thumbnailPlaceholder}>
              <Radio size={32} />
              <span>LIVE</span>
            </div>
          )}
          <div className={styles.liveTag}>
            <span className={styles.liveDot} />
            LIVE
          </div>
          {soopStatus?.viewerCount ? (
            <div className={styles.viewerCount}>
              <Eye size={12} />
              {soopStatus.viewerCount.toLocaleString()}
            </div>
          ) : null}
        </div>

        {/* 프로필 정보 */}
        <div className={styles.liveCardInfo}>
          <div className={styles.liveCardProfile}>
            <div className={styles.liveCardAvatar}>
              {member.image_url ? (
                <Image
                  src={member.image_url}
                  alt={member.name}
                  width={36}
                  height={36}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.liveCardMeta}>
              <span className={styles.cardName}>{member.name}</span>
              <span className={styles.cardUnit} data-unit={member.unit}>
                {member.unit === "excel" ? "엑셀부" : "스타부"}
              </span>
            </div>
          </div>
        </div>
      </motion.a>
    );
  };

  // 공지사항 카드 렌더링
  const renderNoticeCard = (notice: MemberNotice, index: number) => {
    return (
      <motion.a
        key={`${notice.bjId}-${notice.title_no}`}
        className={styles.noticeCard}
        href={`https://www.sooplive.co.kr/station/${notice.bjId}/board`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
      >
        <div className={styles.noticeProfile}>
          <div className={styles.noticeAvatar}>
            {notice.memberImage ? (
              <Image
                src={notice.memberImage}
                alt={notice.memberName}
                width={32}
                height={32}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {notice.memberName.charAt(0)}
              </div>
            )}
          </div>
          <span className={styles.noticeMemberName}>{notice.memberName}</span>
          <span className={styles.noticeTime}>{getRelativeTime(notice.write_dt)}</span>
        </div>
        <h4 className={styles.noticeTitle}>{notice.title}</h4>
        <div className={styles.noticeStats}>
          <span className={styles.noticeStat}>
            <Eye size={12} />
            {notice.read_cnt.toLocaleString()}
          </span>
          <span className={styles.noticeStat}>
            <MessageCircle size={12} />
            {notice.comment_cnt}
          </span>
        </div>
      </motion.a>
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
            {(["all", "excel", "crew"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setUnitFilter(unit)}
                className={`${styles.unitButton} ${unitFilter === unit ? styles.active : ""}`}
                data-unit={unit}
              >
                {unit === "all" ? "전체" : unit === "excel" ? "엑셀부" : "스타부"}
              </button>
            ))}
          </div>
          <div className={styles.statsBar}>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              <span className={styles.liveCount}>LIVE {liveCount}</span>
            </div>
          </div>
        </div>

        {/* 숲 공지 섹션 - 가로 스크롤 */}
        <section className={styles.noticeSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <FileText size={20} />
              숲 공지
              {notices.length > 0 && (
                <span className={styles.sectionCount}>{notices.length}</span>
              )}
            </h2>
          </div>
          {noticesLoading ? (
            <div className={styles.noticeLoading}>
              <div className={styles.spinner} />
              <span>공지사항을 불러오는 중...</span>
            </div>
          ) : notices.length > 0 ? (
            <div className={styles.noticeScroll}>
              {notices.slice(0, 30).map((notice, index) => renderNoticeCard(notice, index))}
            </div>
          ) : (
            <div className={styles.noticeEmpty}>
              <FileText size={32} className={styles.emptyIcon} />
              <p>공지사항이 없습니다</p>
            </div>
          )}
        </section>

        {/* 라이브 섹션 */}
        {isLoading || !liveCheckDone ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>멤버 목록을 불러오는 중...</span>
          </div>
        ) : liveMembers.length > 0 ? (
          <section className={styles.liveSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Radio size={20} />
                방송 중
                <span className={styles.sectionCount}>{liveCount}</span>
              </h2>
            </div>
            <div className={styles.liveGrid}>
              {liveMembers.map((member, index) => renderLiveCard(member, index))}
            </div>
          </section>
        ) : (
          <div className={styles.empty}>
            <Radio size={48} className={styles.emptyIcon} />
            <p>현재 방송 중인 멤버가 없습니다</p>
            <span className={styles.emptyHint}>멤버가 방송을 시작하면 여기에 표시됩니다</span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
