'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Plus, X, Save, Radio, Link as LinkIcon, User, List, GitBranch, Loader2, Settings, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { DataTable, Column, ImageUpload, OrgTreeView } from '@/components/admin'
import { useAdminCRUD, useAlert } from '@/lib/hooks'
import { useSupabaseContext } from '@/lib/context'
import { extractBjId } from '@/lib/soop/api'
import styles from '../shared.module.css'

interface SocialLinks {
  pandatv?: string  // 레거시 - 기존 데이터 호환용
  soop?: string
  sooptv?: string
  youtube?: string
  instagram?: string
}

interface ProfileInfo {
  mbti?: string
  bloodType?: string
  height?: number
  weight?: number
  birthday?: string
  starcraftRace?: 'terran' | 'zerg' | 'protoss'
  starcraftTierId?: number
  starcraftTierName?: string
}

interface StarcraftTier {
  id: number
  name: string
}

interface OrgMember {
  id: number
  profileId: string | null
  name: string
  unit: 'excel' | 'crew'
  role: string
  positionOrder: number
  parentId: number | null
  socialLinks: SocialLinks | null
  profileInfo: ProfileInfo | null
  imageUrl: string | null
  isLive: boolean
}

interface Profile {
  id: string
  nickname: string
}

type ViewMode = 'table' | 'tree' | 'sections'

interface RankSection {
  title: string
  roles: string[]
}

interface RankSectionsConfig {
  excel?: RankSection[]
  crew?: RankSection[]
}

export default function OrganizationPage() {
  const supabase = useSupabaseContext()
  const alertHandler = useAlert()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [tiers, setTiers] = useState<StarcraftTier[]>([])
  const [activeUnit, setActiveUnit] = useState<'excel' | 'crew'>('excel')
  const [localMembers, setLocalMembers] = useState<OrgMember[]>([])
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [soopUrl, setSoopUrl] = useState('')
  const [isFetchingProfile, setIsFetchingProfile] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // 직급 구간 설정
  const [rankSections, setRankSections] = useState<RankSectionsConfig>({})
  const [isSavingSections, setIsSavingSections] = useState(false)

  // 직급 구간 설정 로드
  useEffect(() => {
    async function fetchRankSections() {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'org_rank_sections')
        .maybeSingle()
      if (data?.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
          setRankSections(parsed)
        } catch { /* ignore */ }
      }
    }
    fetchRankSections()
  }, [supabase])

  const saveRankSections = async () => {
    setIsSavingSections(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'org_rank_sections', value: rankSections }, { onConflict: 'key' })
      if (error) throw error
      alertHandler.showSuccess('직급 구간 설정이 저장되었습니다.', '저장 완료')
    } catch (err) {
      alertHandler.showError('저장 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류'), '오류')
    } finally {
      setIsSavingSections(false)
    }
  }

  const getCurrentSections = (): RankSection[] => rankSections[activeUnit] || []

  const updateCurrentSections = (sections: RankSection[]) => {
    setRankSections(prev => ({ ...prev, [activeUnit]: sections }))
  }

  const addSection = () => {
    updateCurrentSections([...getCurrentSections(), { title: '', roles: [] }])
  }

  const removeSection = (index: number) => {
    updateCurrentSections(getCurrentSections().filter((_, i) => i !== index))
  }

  const updateSection = (index: number, field: 'title' | 'roles', value: string | string[]) => {
    const updated = [...getCurrentSections()]
    if (field === 'title') {
      updated[index] = { ...updated[index], title: value as string }
    } else {
      updated[index] = { ...updated[index], roles: value as string[] }
    }
    updateCurrentSections(updated)
  }

  // uniqueRoles는 filteredMembers 이후에 정의 (아래 참고)

  // Fetch profiles for linking
  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, nickname')
      .order('nickname')
    setProfiles(data || [])
  }, [supabase])

  // Fetch starcraft tiers
  const fetchTiers = useCallback(async () => {
    const { data } = await supabase
      .from('starcraft_tiers')
      .select('id, name')
      .order('display_order')
    setTiers(data || [])
  }, [supabase])

  useEffect(() => {
    fetchProfiles()
    fetchTiers()
  }, [fetchProfiles, fetchTiers])

  const {
    items: members,
    isLoading,
    isModalOpen,
    isNew,
    editingItem: editingMember,
    setEditingItem: setEditingMember,
    openAddModal: baseOpenAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
    refetch,
  } = useAdminCRUD<OrgMember>({
    tableName: 'organization',
    defaultItem: {
      profileId: null,
      name: '',
      unit: activeUnit,
      role: '',
      positionOrder: 0,
      parentId: null,
      socialLinks: null,
      profileInfo: null,
      imageUrl: null,
      isLive: false,
    },
    orderBy: { column: 'position_order', ascending: true },
    fromDbFormat: (row) => ({
      id: row.id as number,
      profileId: row.profile_id as string | null,
      name: row.name as string,
      unit: row.unit as 'excel' | 'crew',
      role: row.role as string,
      positionOrder: row.position_order as number,
      parentId: row.parent_id as number | null,
      socialLinks: row.social_links as SocialLinks | null,
      profileInfo: row.profile_info as ProfileInfo | null,
      imageUrl: row.image_url as string | null,
      isLive: row.is_live as boolean,
    }),
    toDbFormat: (item) => ({
      name: item.name,
      role: item.role,
      unit: item.unit,
      profile_id: item.profileId,
      parent_id: item.parentId,
      position_order: item.positionOrder,
      social_links: item.socialLinks,
      profile_info: item.profileInfo,
      image_url: item.imageUrl,
    }),
    validate: (item) => {
      if (!item.name || !item.role) return '이름과 직책을 입력해주세요.'
      return null
    },
    beforeDelete: async (item) => {
      // 1. 자식 멤버들의 parent_id를 null로 변경 (self-referencing FK)
      const { error: parentError } = await supabase
        .from('organization')
        .update({ parent_id: null })
        .eq('parent_id', item.id)
      if (parentError) {
        throw new Error(`parent_id 업데이트 실패: ${parentError.message}`)
      }

      // 2. 연관된 live_status 레코드 삭제 (FK 제약 조건)
      const { error: liveError } = await supabase
        .from('live_status')
        .delete()
        .eq('member_id', item.id)
      if (liveError) {
        throw new Error(`live_status 삭제 실패: ${liveError.message}`)
      }
    },
    alertHandler,
  })

  // Sync local members with fetched members
  useEffect(() => {
    setLocalMembers(members)
  }, [members])

  const filteredMembers = localMembers.filter((m) => m.unit === activeUnit)

  // 현재 유닛의 고유 직책 목록
  const uniqueRoles = useMemo(() => {
    return [...new Set(filteredMembers.map(m => m.role))].sort()
  }, [filteredMembers])

  // 드래그앤드롭 순서 변경 핸들러
  const handleReorder = async (reorderedItems: OrgMember[]) => {
    // Update position_order for all reordered items
    const updatedItems = reorderedItems.map((member, index) => ({
      ...member,
      positionOrder: index,
    }))

    // Update local state (merge with other unit's members)
    const otherUnitMembers = localMembers.filter((m) => m.unit !== activeUnit)
    setLocalMembers([...otherUnitMembers, ...updatedItems])

    // Save to database
    setIsSavingOrder(true)
    try {
      const updates = updatedItems.map((member) =>
        supabase
          .from('organization')
          .update({ position_order: member.positionOrder })
          .eq('id', member.id)
      )

      const results = await Promise.all(updates)
      const hasError = results.some((r) => r.error)

      if (hasError) {
        console.error('순서 저장 중 오류 발생')
        await refetch()
      }
    } catch (error) {
      console.error('순서 저장 실패:', error)
      await refetch()
    } finally {
      setIsSavingOrder(false)
    }
  }

  const openAddModal = () => {
    baseOpenAddModal()
    // Override unit with current activeUnit
    setEditingMember((prev) => prev ? { ...prev, unit: activeUnit, positionOrder: filteredMembers.length } : null)
    setSoopUrl('')
    setFetchError(null)
  }

  const handleSoopUrlFetch = async () => {
    if (!soopUrl.trim()) return

    const bjId = extractBjId(soopUrl.trim())
    if (!bjId) {
      setFetchError('유효한 SOOP 방송국 URL이 아닙니다')
      return
    }

    setIsFetchingProfile(true)
    setFetchError(null)

    try {
      const response = await fetch(`/api/soop/station?bjId=${encodeURIComponent(bjId)}&action=profile-image`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '프로필 이미지를 가져올 수 없습니다')
      }

      setEditingMember(prev => prev ? {
        ...prev,
        imageUrl: data.profileImage,
        socialLinks: {
          ...prev.socialLinks,
          sooptv: bjId,
        },
      } : null)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : '프로필 이미지 가져오기 실패')
    } finally {
      setIsFetchingProfile(false)
    }
  }

  const columns: Column<OrgMember>[] = [
    {
      key: 'positionOrder',
      header: '순서',
      width: '50px',
      sortable: false,
      render: (item) => item.positionOrder + 1,
    },
    {
      key: 'imageUrl',
      header: '사진',
      width: '60px',
      render: (item) => (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: item.isLive ? '2px solid var(--live-color)' : '1px solid var(--border)',
          boxShadow: item.isLive ? '0 0 8px var(--live-glow)' : 'none',
        }}>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={40}
              height={40}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <User size={20} style={{ color: 'var(--text-tertiary)' }} />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: '이름',
      width: '120px',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {item.isLive && (
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--live-color)',
              boxShadow: '0 0 8px var(--live-glow)',
              animation: 'pulse 2s infinite',
            }} title="LIVE" />
          )}
          {item.name}
        </div>
      ),
    },
    { key: 'role', header: '직책', width: '100px' },
    {
      key: 'socialLinks',
      header: 'SOOP ID',
      render: (item) => {
        const soopId = item.socialLinks?.sooptv || item.socialLinks?.soop
        return soopId ? (
          <a
            href={`https://www.sooplive.co.kr/station/${soopId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00d4ff', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <LinkIcon size={14} />
            {soopId}
          </a>
        ) : (
          <span style={{ color: 'var(--text-tertiary)' }}>-</span>
        )
      },
    },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Building size={24} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>조직도 관리</h1>
            <p className={styles.subtitle}>이노레이블 조직도{isSavingOrder && ' (저장 중...)'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Mode Toggle */}
          <div className={styles.tabButtons}>
            <button
              onClick={() => setViewMode('table')}
              className={`${styles.tabButton} ${viewMode === 'table' ? styles.active : ''}`}
              title="테이블 보기"
            >
              <List size={16} />
              테이블
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`${styles.tabButton} ${viewMode === 'tree' ? styles.active : ''}`}
              title="트리 보기"
            >
              <GitBranch size={16} />
              트리
            </button>
            <button
              onClick={() => setViewMode('sections')}
              className={`${styles.tabButton} ${viewMode === 'sections' ? styles.active : ''}`}
              title="직급 구간 설정"
            >
              <Settings size={16} />
              구간 설정
            </button>
          </div>
          <button onClick={openAddModal} className={styles.addButton}>
            <Plus size={18} />
            멤버 추가
          </button>
        </div>
      </header>

      {/* Unit Tabs */}
      <div className={styles.typeSelector}>
        <button
          onClick={() => setActiveUnit('excel')}
          className={`${styles.typeButton} ${activeUnit === 'excel' ? styles.active : ''}`}
        >
          엑셀부
        </button>
        <button
          onClick={() => setActiveUnit('crew')}
          className={`${styles.typeButton} ${activeUnit === 'crew' ? styles.active : ''}`}
        >
          스타부
        </button>
      </div>

      {/* Table or Tree View */}
      {viewMode === 'table' ? (
        <DataTable
          data={filteredMembers}
          columns={columns}
          onEdit={openEditModal}
          onDelete={handleDelete}
          searchPlaceholder="이름으로 검색..."
          isLoading={isLoading}
          draggable
          onReorder={handleReorder}
        />
      ) : viewMode === 'tree' ? (
        <OrgTreeView
          members={filteredMembers}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      ) : (
        /* 직급 구간 설정 뷰 */
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {activeUnit === 'excel' ? '엑셀부' : '스타부'} 직급 구간 설정
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={addSection} className={styles.addButton} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Plus size={14} />
                구간 추가
              </button>
              <button
                onClick={saveRankSections}
                disabled={isSavingSections}
                className={styles.addButton}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'var(--success, #22c55e)' }}
              >
                <Save size={14} />
                {isSavingSections ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            각 구간에 표시할 직책을 설정합니다. 어떤 구간에도 속하지 않는 직책은 &quot;기타 멤버&quot;로 표시됩니다.
          </p>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.75rem', background: 'var(--surface)', borderRadius: '8px' }}>
            현재 유닛 직책 목록: {uniqueRoles.length > 0 ? uniqueRoles.join(', ') : '없음'}
          </div>

          {getCurrentSections().length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
              <p>설정된 구간이 없습니다. 기본 구간(대표/차장·과장/팀장·실장/멤버)이 사용됩니다.</p>
              <button onClick={addSection} className={styles.addButton} style={{ marginTop: '1rem' }}>
                <Plus size={14} /> 첫 구간 추가
              </button>
            </div>
          ) : (
            getCurrentSections().map((section, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', minWidth: '2rem' }}>#{idx + 1}</span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(idx, 'title', e.target.value)}
                    placeholder="구간 이름 (예: 대표, 차장/과장)"
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    onClick={() => removeSection(idx)}
                    style={{
                      padding: '0.4rem',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--danger, #ef4444)',
                      cursor: 'pointer',
                    }}
                    title="구간 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingLeft: '2.75rem' }}>
                  {uniqueRoles.map((role) => {
                    const isSelected = section.roles.includes(role)
                    const isUsedElsewhere = !isSelected && getCurrentSections().some((s, i) => i !== idx && s.roles.includes(role))
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          if (isUsedElsewhere) return
                          const newRoles = isSelected
                            ? section.roles.filter(r => r !== role)
                            : [...section.roles, role]
                          updateSection(idx, 'roles', newRoles)
                        }}
                        disabled={isUsedElsewhere}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          border: `1px solid ${isSelected ? 'var(--primary)' : isUsedElsewhere ? 'var(--border)' : 'var(--border)'}`,
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          color: isSelected ? '#fff' : isUsedElsewhere ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                          cursor: isUsedElsewhere ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem',
                          opacity: isUsedElsewhere ? 0.5 : 1,
                        }}
                      >
                        {role}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && editingMember && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>{isNew ? '멤버 추가' : '멤버 수정'}</h2>
                <button onClick={closeModal} className={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* 프로필 이미지 */}
                <div className={styles.formGroup}>
                  <label>프로필 이미지</label>
                  <ImageUpload
                    value={editingMember.imageUrl ?? null}
                    onChange={(url) => setEditingMember({ ...editingMember, imageUrl: url })}
                    folder="members"
                    size={80}
                  />
                </div>

                {/* SOOP 방송국 URL로 프로필 이미지 가져오기 */}
                <div className={styles.formGroup}>
                  <label>
                    <LinkIcon size={14} style={{ marginRight: '0.25rem' }} />
                    SOOP 방송국 URL
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={soopUrl}
                      onChange={(e) => {
                        setSoopUrl(e.target.value)
                        setFetchError(null)
                      }}
                      className={styles.input}
                      placeholder="https://www.sooplive.co.kr/station/bjid"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={handleSoopUrlFetch}
                      disabled={isFetchingProfile || !soopUrl.trim()}
                      className={styles.saveButton}
                      style={{
                        padding: '0.625rem 0.875rem',
                        opacity: isFetchingProfile || !soopUrl.trim() ? 0.5 : 1,
                        cursor: isFetchingProfile || !soopUrl.trim() ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isFetchingProfile ? (
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        '가져오기'
                      )}
                    </button>
                  </div>
                  {fetchError && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      {fetchError}
                    </span>
                  )}
                  <span className={styles.helperText} style={{ color: 'var(--text-tertiary)' }}>
                    URL 입력 시 프로필 이미지 + SOOP ID 자동 입력
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>이름 *</label>
                  <input
                    type="text"
                    value={editingMember.name || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    className={styles.input}
                    placeholder="멤버 이름"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>직책 *</label>
                  <input
                    type="text"
                    value={editingMember.role || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    className={styles.input}
                    placeholder="직책을 입력하세요 (예: 대표, 멤버, 팀장)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>부서</label>
                  <div className={styles.typeSelector}>
                    <button
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, unit: 'excel' })}
                      className={`${styles.typeButton} ${editingMember.unit === 'excel' ? styles.active : ''}`}
                    >
                      엑셀부
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, unit: 'crew' })}
                      className={`${styles.typeButton} ${editingMember.unit === 'crew' ? styles.active : ''}`}
                    >
                      스타부
                    </button>
                  </div>
                </div>

                {/* 스타크래프트 종족/티어 - 스타부일 때만 표시 */}
                {editingMember.unit === 'crew' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--surface)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                      <label>스타크래프트 종족</label>
                      <select
                        value={editingMember.profileInfo?.starcraftRace || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              starcraftRace: (e.target.value || undefined) as ProfileInfo['starcraftRace'],
                            },
                          })
                        }
                        className={styles.select}
                      >
                        <option value="">선택 안함</option>
                        <option value="terran">테란 (T)</option>
                        <option value="zerg">저그 (Z)</option>
                        <option value="protoss">토스 (P)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                      <label>스타크래프트 티어</label>
                      <select
                        value={editingMember.profileInfo?.starcraftTierId || ''}
                        onChange={(e) => {
                          const tierId = e.target.value ? parseInt(e.target.value) : undefined
                          const tierName = tiers.find(t => t.id === tierId)?.name
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              starcraftTierId: tierId,
                              starcraftTierName: tierName,
                            },
                          })
                        }}
                        className={styles.select}
                      >
                        <option value="">선택 안함</option>
                        {tiers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>연결된 회원 (선택)</label>
                  <select
                    value={editingMember.profileId || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, profileId: e.target.value || null })
                    }
                    className={styles.select}
                  >
                    <option value="">연결 안함</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nickname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>순서</label>
                  <input
                    type="number"
                    value={editingMember.positionOrder ?? 0}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        positionOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className={styles.input}
                    min={0}
                  />
                </div>

                {/* Profile Info */}
                <div className={styles.formGroup}>
                  <label style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>프로필 정보</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--surface)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                      <label>MBTI</label>
                      <input
                        type="text"
                        value={editingMember.profileInfo?.mbti || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              mbti: e.target.value.toUpperCase() || undefined,
                            },
                          })
                        }
                        className={styles.input}
                        placeholder="ENFP"
                        maxLength={4}
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                      <label>혈액형</label>
                      <select
                        value={editingMember.profileInfo?.bloodType || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              bloodType: e.target.value || undefined,
                            },
                          })
                        }
                        className={styles.select}
                      >
                        <option value="">선택</option>
                        <option value="A">A형</option>
                        <option value="B">B형</option>
                        <option value="O">O형</option>
                        <option value="AB">AB형</option>
                      </select>
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                      <label>키 (cm)</label>
                      <input
                        type="number"
                        value={editingMember.profileInfo?.height || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              height: e.target.value ? parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        className={styles.input}
                        placeholder="170"
                        min={100}
                        max={250}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0 }}>
                      <label>몸무게 (kg)</label>
                      <input
                        type="number"
                        value={editingMember.profileInfo?.weight || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              weight: e.target.value ? parseInt(e.target.value) : undefined,
                            },
                          })
                        }
                        className={styles.input}
                        placeholder="65"
                        min={30}
                        max={200}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ margin: 0, gridColumn: 'span 2' }}>
                      <label>생일</label>
                      <input
                        type="date"
                        value={editingMember.profileInfo?.birthday || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            profileInfo: {
                              ...editingMember.profileInfo,
                              birthday: e.target.value || undefined,
                            },
                          })
                        }
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className={styles.formGroup}>
                  <label>
                    <Radio size={14} style={{ marginRight: '0.25rem' }} />
                    SOOP TV ID
                  </label>
                  <input
                    type="text"
                    value={editingMember.socialLinks?.sooptv || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          sooptv: e.target.value || undefined,
                        },
                      })
                    }
                    className={styles.input}
                    placeholder="bjid"
                  />
                  <span className={styles.helperText} style={{ color: 'var(--text-tertiary)' }}>
                    SOOP 방송국 URL 입력 시 자동 입력됩니다
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <Radio size={14} style={{ marginRight: '0.25rem' }} />
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={editingMember.socialLinks?.instagram || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          instagram: e.target.value || undefined,
                        },
                      })
                    }
                    className={styles.input}
                    placeholder="https://www.instagram.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <Radio size={14} style={{ marginRight: '0.25rem' }} />
                    YouTube
                  </label>
                  <input
                    type="text"
                    value={editingMember.socialLinks?.youtube || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          youtube: e.target.value || undefined,
                        },
                      })
                    }
                    className={styles.input}
                    placeholder="https://www.youtube.com/@channel"
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button onClick={closeModal} className={styles.cancelButton}>
                  취소
                </button>
                <button onClick={handleSave} className={styles.saveButton}>
                  <Save size={16} />
                  {isNew ? '추가' : '저장'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
