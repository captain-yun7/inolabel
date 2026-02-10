'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Radio, Youtube, Instagram, ExternalLink,
  User, Heart, Cake, Ruler, Droplet, X
} from 'lucide-react'
import type { OrgMember, OrganizationRecord } from './MemberCard'
import styles from './ProfileSidebar.module.css'

const getPandaTvUrl = (id: string) => `https://www.pandalive.co.kr/play/${id}`

// OrgMember 또는 OrganizationRecord 모두 지원
type MemberType = OrgMember | OrganizationRecord

interface ProfileSidebarProps {
  member: MemberType | null
  onClose?: () => void
}

const hasProfileInfo = (member: MemberType) => {
  const info = member.profile_info
  if (!info) return false
  return !!(info.mbti || info.blood_type || info.height || info.weight || info.birthday)
}

export function ProfileSidebar({ member, onClose }: ProfileSidebarProps) {
  const hasSocial = member?.social_links && Object.keys(member.social_links).length > 0
  const hasProfile = member ? hasProfileInfo(member) : false

  return (
    <motion.div
      className={styles.sidebar}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 닫기 버튼 */}
      {member && onClose && (
        <button className={styles.closeBtn} onClick={onClose} title="닫기">
          <X size={18} />
        </button>
      )}

      {!member ? (
        <div className={styles.emptyState}>
          <User size={32} />
          <p>멤버를 선택하면<br />프로필이 표시됩니다</p>
        </div>
      ) : (
        <>
          {/* 프로필 헤더 */}
          <div className={styles.profileHeader}>
            <div className={`${styles.avatarWrapper} ${member.is_live ? styles.isLive : ''}`}>
              {member.is_live && <span className={styles.liveBadge}>LIVE</span>}
              <div className={styles.avatar}>
                {member.image_url ? (
                  <Image src={member.image_url} alt={member.name} fill className={styles.avatarImage} />
                ) : (
                  <div className={styles.avatarPlaceholder}>{member.name.charAt(0)}</div>
                )}
              </div>
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.nameRow}>
                <h2 className={styles.name}>{member.name}</h2>
                <span className={styles.unitBadge} data-unit={member.unit}>
                  {member.unit === 'excel' ? 'EXCEL' : 'STAR'}
                </span>
              </div>
              {/* 대표는 role 표시, 멤버는 current_rank 표시 */}
              <span className={styles.role}>
                {member.role === '대표' ? member.role : member.current_rank || member.role}
              </span>
              <span className={`${styles.statusBadge} ${member.is_live ? styles.live : ''}`}>
                {member.is_live ? '🔴 방송 중' : '⚫ 오프라인'}
              </span>
            </div>
          </div>

          {/* 라이브 CTA */}
          {member.is_live && member.social_links?.pandatv && (
            <div className={styles.liveCta}>
              <a
                href={getPandaTvUrl(member.social_links.pandatv)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.watchBtn}
              >
                <Radio size={16} />
                지금 방송 보러가기
              </a>
            </div>
          )}

          <div className={styles.sidebarContent}>
            {/* 프로필 섹션 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <User size={14} />
                프로필
              </h3>
              {hasProfile ? (
                <div className={styles.profileGrid}>
                  {member.profile_info?.mbti && (
                    <div className={styles.profileCard}>
                      <span className={styles.profileIcon}>🧠</span>
                      <div className={styles.profileCardContent}>
                        <span className={styles.profileLabel}>MBTI</span>
                        <span className={styles.profileValue}>{member.profile_info.mbti}</span>
                      </div>
                    </div>
                  )}
                  {member.profile_info?.blood_type && (
                    <div className={styles.profileCard}>
                      <span className={styles.profileIcon}>🩸</span>
                      <div className={styles.profileCardContent}>
                        <span className={styles.profileLabel}>혈액형</span>
                        <span className={styles.profileValue}>{member.profile_info.blood_type}</span>
                      </div>
                    </div>
                  )}
                  {member.profile_info?.height && (
                    <div className={styles.profileCard}>
                      <span className={styles.profileIcon}>📏</span>
                      <div className={styles.profileCardContent}>
                        <span className={styles.profileLabel}>키</span>
                        <span className={styles.profileValue}>{member.profile_info.height}</span>
                      </div>
                    </div>
                  )}
                  {member.profile_info?.weight && (
                    <div className={styles.profileCard}>
                      <span className={styles.profileIcon}>⚖️</span>
                      <div className={styles.profileCardContent}>
                        <span className={styles.profileLabel}>몸무게</span>
                        <span className={styles.profileValue}>{member.profile_info.weight}</span>
                      </div>
                    </div>
                  )}
                  {member.profile_info?.birthday && (
                    <div className={styles.profileCard}>
                      <span className={styles.profileIcon}>🎂</span>
                      <div className={styles.profileCardContent}>
                        <span className={styles.profileLabel}>생일</span>
                        <span className={styles.profileValue}>{member.profile_info.birthday}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.emptySection}>
                  <p>등록된 프로필 정보가 없습니다</p>
                </div>
              )}
            </div>

            {/* 소셜 섹션 */}
            {hasSocial && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Radio size={14} />
                  소셜
                </h3>
                <div className={styles.socialGrid}>
                  {member.social_links?.pandatv && (
                    <a
                      href={getPandaTvUrl(member.social_links.pandatv)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialCard}
                      data-platform="pandatv"
                    >
                      <Radio size={18} />
                      <span className={styles.socialName}>팬더티비</span>
                      <ExternalLink size={12} className={styles.socialArrow} />
                    </a>
                  )}
                  {member.social_links?.chzzk && (
                    <a
                      href={member.social_links.chzzk}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialCard}
                      data-platform="chzzk"
                    >
                      <Heart size={18} />
                      <span className={styles.socialName}>치지직</span>
                      <ExternalLink size={12} className={styles.socialArrow} />
                    </a>
                  )}
                  {member.social_links?.youtube && (
                    <a
                      href={member.social_links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialCard}
                      data-platform="youtube"
                    >
                      <Youtube size={18} />
                      <span className={styles.socialName}>유튜브</span>
                      <ExternalLink size={12} className={styles.socialArrow} />
                    </a>
                  )}
                  {member.social_links?.instagram && (
                    <a
                      href={member.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialCard}
                      data-platform="instagram"
                    >
                      <Instagram size={18} />
                      <span className={styles.socialName}>인스타그램</span>
                      <ExternalLink size={12} className={styles.socialArrow} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
