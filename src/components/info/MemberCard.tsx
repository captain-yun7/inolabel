'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './MemberCard.module.css'
import type { OrganizationRecord } from '@/types/organization'

// Re-export for backward compatibility
export type { OrgMember, OrganizationRecord, ProfileInfo, SocialLinks } from '@/types/organization'

const RACE_LABEL: Record<string, string> = {
  terran: '테란',
  zerg: '저그',
  protoss: '프토',
}

const RACE_COLOR: Record<string, string> = {
  terran: '#3b82f6',
  zerg: '#a855f7',
  protoss: '#f59e0b',
}

export interface TierInfo {
  race?: string
  tierName?: string
  tierColor?: string
}

interface MemberCardProps {
  member: OrganizationRecord
  size: 'large' | 'medium' | 'small'
  onClick: () => void
  isSelected?: boolean
  tierInfo?: TierInfo
}

export function MemberCard({ member, size, onClick, isSelected, tierInfo }: MemberCardProps) {
  const leaderRoles = ['대표', '이사장', '총장', '부장', '팀장']
  const isLeader = leaderRoles.includes(member.role)

  const social = member.social_links as Record<string, string> | null
  const soopUrl = social?.sooptv || social?.soop || social?.pandatv
  const hasSocial = social && (soopUrl || social.youtube || social.instagram)

  return (
    <motion.div
      className={`${styles.memberCard} ${styles[size]} ${isSelected ? styles.selected : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={`${styles.avatarWrapper} ${member.is_live ? styles.isLive : ''} ${isLeader ? styles.isLeader : ''}`}>
        {member.is_live && (
          <span className={styles.liveBadge}>
            LIVE
          </span>
        )}
        <div className={`${styles.avatar} ${member.is_live ? styles.avatarLive : ''}`}>
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
        </div>
      </div>
      <div className={styles.memberInfo}>
        <div className={styles.nameRow}>
          <span className={styles.roleBadge}>{member.role}</span>
          <span className={styles.memberName}>{member.name}</span>
        </div>

        {/* Race + Tier Badges (crew only) */}
        {tierInfo && (tierInfo.race || tierInfo.tierName) && (
          <div className={styles.badges}>
            {tierInfo.race && (
              <span
                className={styles.raceBadge}
                style={{
                  backgroundColor: RACE_COLOR[tierInfo.race] || '#666',
                  color: '#fff',
                }}
              >
                {RACE_LABEL[tierInfo.race] || tierInfo.race}
              </span>
            )}
            {tierInfo.tierName && (
              <span
                className={styles.tierBadge}
                style={{
                  backgroundColor: tierInfo.tierColor || '#333',
                  color: '#fff',
                }}
              >
                {tierInfo.tierName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay - cnine.kr style */}
      <div className={styles.hoverOverlay}>
        {soopUrl && (
          <a
            href={soopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.overlayBtn} ${styles.overlayBtnLive}`}
            onClick={(e) => e.stopPropagation()}
          >
            방송국 바로가기
          </a>
        )}
        {hasSocial && (
          <div className={styles.overlaySocials}>
            {soopUrl && (
              <a href={soopUrl} target="_blank" rel="noopener noreferrer" className={styles.overlaySocialIcon} onClick={(e) => e.stopPropagation()} title="SOOP">
                <SoopIcon />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" className={`${styles.overlaySocialIcon} ${styles.youtube}`} onClick={(e) => e.stopPropagation()} title="YouTube">
                <YoutubeIcon />
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={`${styles.overlaySocialIcon} ${styles.instagram}`} onClick={(e) => e.stopPropagation()} title="Instagram">
                <InstagramIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Mini SVG icons
function SoopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0" />
      <text x="4" y="17" fontSize="14" fontWeight="bold" fill="currentColor">S</text>
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.5.6c-1 .3-1.7 1.1-2 2.1C0 7.9 0 12 0 12s0 4.1.5 5.8c.3 1 1 1.8 2 2.1 1.7.6 9.5.6 9.5.6s7.8 0 9.5-.6c1-.3 1.7-1.1 2-2.1.5-1.7.5-5.8.5-5.8s0-4.1-.5-5.8zM9.5 15.5v-7l6.4 3.5-6.4 3.5z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
