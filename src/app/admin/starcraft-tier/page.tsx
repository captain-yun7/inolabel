'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getTiersWithMembers, addTierMember, removeTierMember, updateTierMember, reorderTierMembers } from '@/lib/actions/starcraft-tier'
import { extractBjId } from '@/lib/soop/api'
import type { StarcraftTierWithMembers, StarcraftTierMember } from '@/types/database'
import styles from '../shared.module.css'

function SortableMemberItem({
  member,
  tiers,
  onEdit,
  onRemove,
  onMove,
}: {
  member: StarcraftTierMember
  tiers: StarcraftTierWithMembers[]
  onEdit: (m: StarcraftTierMember) => void
  onRemove: (id: number) => void
  onMove: (m: StarcraftTierMember, tierId: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: '6px 8px',
    borderRadius: '8px',
    background: isDragging ? 'rgba(253,104,186,0.08)' : 'rgba(255,255,255,0.03)',
    border: isDragging ? '1px dashed rgba(253,104,186,0.3)' : '1px solid transparent',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            padding: '2px 4px',
            fontSize: '14px',
            lineHeight: 1,
            touchAction: 'none',
          }}
          title="드래그하여 순서 변경"
        >
          ⠿
        </button>
        {member.image_url ? (
          <img src={member.image_url} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>?</div>
        )}
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{member.player_name}</span>
        {member.race && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
            {member.race === 'terran' ? 'T' : member.race === 'zerg' ? 'Z' : 'P'}
          </span>
        )}
        {member.soop_id && (
          <span style={{ fontSize: '0.7rem', color: '#00d4ff', padding: '1px 6px', borderRadius: '4px', background: 'rgba(0,212,255,0.1)' }}>
            SOOP
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <select
          value={member.tier_id}
          onChange={(e) => {
            const newTierId = Number(e.target.value)
            if (newTierId !== member.tier_id) onMove(member, newTierId)
          }}
          style={{ padding: '4px 6px', borderRadius: '6px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}
        >
          {tiers.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button
          onClick={() => onEdit({ ...member })}
          style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          수정
        </button>
        <button
          onClick={() => onRemove(member.id)}
          style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff5050', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          삭제
        </button>
      </div>
    </div>
  )
}

export default function AdminStarcraftTierPage() {
  const [tiers, setTiers] = useState<StarcraftTierWithMembers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerRace, setNewPlayerRace] = useState<string>('')
  const [newPlayerDesc, setNewPlayerDesc] = useState('')
  const [newSoopUrl, setNewSoopUrl] = useState('')
  const [editingMember, setEditingMember] = useState<(StarcraftTierMember & { _soopUrl?: string }) | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingProfile, setIsFetchingProfile] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const fetchTiers = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await getTiersWithMembers()
    if (data) setTiers(data)
    if (error) console.error(error)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchTiers()
  }, [fetchTiers])

  const fetchSoopProfileImage = async (soopUrl: string): Promise<{ bjId: string; imageUrl: string } | null> => {
    const bjId = extractBjId(soopUrl.trim())
    if (!bjId) {
      setFetchError('유효한 SOOP 방송국 URL이 아닙니다')
      return null
    }
    setIsFetchingProfile(true)
    setFetchError(null)
    try {
      const response = await fetch(`/api/soop/station?bjId=${encodeURIComponent(bjId)}&action=profile-image`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '프로필 이미지를 가져올 수 없습니다')
      return { bjId, imageUrl: data.profileImage }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : '프로필 이미지 가져오기 실패')
      return null
    } finally {
      setIsFetchingProfile(false)
    }
  }

  const handleAddMember = async () => {
    if (!selectedTierId || !newPlayerName.trim()) return
    setIsSubmitting(true)

    let imageUrl: string | null = null
    let soopId: string | null = null

    if (newSoopUrl.trim()) {
      const result = await fetchSoopProfileImage(newSoopUrl)
      if (result) {
        imageUrl = result.imageUrl
        soopId = result.bjId
      }
    }

    const { data: newMember, error } = await addTierMember({
      tier_id: selectedTierId,
      player_name: newPlayerName.trim(),
      race: (newPlayerRace || null) as StarcraftTierMember['race'],
      description: newPlayerDesc || null,
      image_url: imageUrl,
      soop_id: soopId,
    })
    if (!error && newMember) {
      setNewPlayerName('')
      setNewPlayerRace('')
      setNewPlayerDesc('')
      setNewSoopUrl('')
      setFetchError(null)
      setTiers(prev => prev.map(t =>
        t.id === selectedTierId ? { ...t, members: [...t.members, newMember] } : t
      ))
    } else {
      alert(error)
    }
    setIsSubmitting(false)
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const { error } = await removeTierMember(memberId)
    if (!error) {
      setTiers(prev => prev.map(t => ({
        ...t,
        members: t.members.filter(m => m.id !== memberId),
      })))
    } else {
      alert(error)
    }
  }

  const handleFetchEditProfile = async () => {
    if (!editingMember?._soopUrl?.trim()) return
    const result = await fetchSoopProfileImage(editingMember._soopUrl)
    if (result) {
      setEditingMember(prev => prev ? { ...prev, image_url: result.imageUrl, soop_id: result.bjId } : null)
    }
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return
    setIsSubmitting(true)

    let imageUrl = editingMember.image_url
    let soopId = editingMember.soop_id

    if (editingMember._soopUrl?.trim() && extractBjId(editingMember._soopUrl) !== editingMember.soop_id) {
      const result = await fetchSoopProfileImage(editingMember._soopUrl)
      if (result) {
        imageUrl = result.imageUrl
        soopId = result.bjId
      }
    }

    const { error } = await updateTierMember(editingMember.id, {
      player_name: editingMember.player_name,
      race: editingMember.race,
      description: editingMember.description,
      image_url: imageUrl,
      soop_id: soopId,
    })
    if (!error) {
      const updatedMember = { ...editingMember, image_url: imageUrl, soop_id: soopId }
      setTiers(prev => prev.map(t => ({
        ...t,
        members: t.members.map(m => m.id === updatedMember.id ? { ...m, ...updatedMember } : m),
      })))
      setEditingMember(null)
      setFetchError(null)
    } else {
      alert(error)
    }
    setIsSubmitting(false)
  }

  const handleMoveMember = async (member: StarcraftTierMember, newTierId: number) => {
    setIsSubmitting(true)
    const { error } = await updateTierMember(member.id, { tier_id: newTierId })
    if (!error) {
      setTiers(prev => prev.map(t => {
        if (t.id === member.tier_id) {
          return { ...t, members: t.members.filter(m => m.id !== member.id) }
        }
        if (t.id === newTierId) {
          return { ...t, members: [...t.members, { ...member, tier_id: newTierId }] }
        }
        return t
      }))
    } else {
      alert(error)
    }
    setIsSubmitting(false)
  }

  const handleDragEnd = async (tierId: number, event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const tier = tiers.find(t => t.id === tierId)
    if (!tier) return

    const oldIndex = tier.members.findIndex(m => m.id === active.id)
    const newIndex = tier.members.findIndex(m => m.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    // 로컬 상태 즉시 업데이트 (낙관적)
    const newMembers = [...tier.members]
    const [moved] = newMembers.splice(oldIndex, 1)
    newMembers.splice(newIndex, 0, moved)

    setTiers(prev => prev.map(t =>
      t.id === tierId ? { ...t, members: newMembers } : t
    ))

    // 서버에 순서 저장
    const orders = newMembers.map((m, i) => ({
      id: m.id,
      tier_id: tierId,
      position_order: i,
    }))
    const { error } = await reorderTierMembers(orders)
    if (error) {
      alert(error)
      await fetchTiers() // 실패 시 원복
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>스타크래프트 티어 관리</h1>
          <p className={styles.subtitle}>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>스타크래프트 티어 관리</h1>
        <p className={styles.subtitle}>티어별 멤버를 관리합니다 (드래그로 순서 변경 가능)</p>
      </div>

      {/* 멤버 추가 폼 */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface, #1a1a1a)', borderRadius: '12px', border: '1px solid var(--card-border, rgba(255,255,255,0.1))' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>멤버 추가</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>티어 선택</label>
            <select
              value={selectedTierId || ''}
              onChange={(e) => setSelectedTierId(Number(e.target.value) || null)}
              style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
            >
              <option value="">티어 선택...</option>
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>선수명</label>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="선수/유저 이름"
              style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>종족</label>
            <select
              value={newPlayerRace}
              onChange={(e) => setNewPlayerRace(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
            >
              <option value="">선택...</option>
              <option value="terran">테란 (T)</option>
              <option value="zerg">저그 (Z)</option>
              <option value="protoss">프로토스 (P)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>SOOP 방송국 URL</label>
            <input
              type="text"
              value={newSoopUrl}
              onChange={(e) => setNewSoopUrl(e.target.value)}
              placeholder="https://www.sooplive.co.kr/station/bjid"
              style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '0.875rem', width: '280px' }}
            />
          </div>
          <button
            onClick={handleAddMember}
            disabled={!selectedTierId || !newPlayerName.trim() || isSubmitting || isFetchingProfile}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: selectedTierId && newPlayerName.trim() ? '#fd68ba' : '#555',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: selectedTierId && newPlayerName.trim() ? 'pointer' : 'not-allowed',
              opacity: isSubmitting || isFetchingProfile ? 0.5 : 1,
            }}
          >
            {isFetchingProfile ? '프로필 가져오는 중...' : isSubmitting ? '추가 중...' : '추가'}
          </button>
        </div>
        {fetchError && !editingMember && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#ff5050' }}>{fetchError}</p>
        )}
      </div>

      {/* 수정 모달 */}
      {editingMember && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface, #1a1a1a)', borderRadius: '16px', padding: '2rem', width: '460px', maxWidth: '90vw' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>멤버 수정</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {editingMember.image_url && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <img
                    src={editingMember.image_url}
                    alt={editingMember.player_name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--card-border)' }}
                  />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>선수명</label>
                <input
                  type="text"
                  value={editingMember.player_name}
                  onChange={(e) => setEditingMember({ ...editingMember, player_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>종족</label>
                <select
                  value={editingMember.race || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, race: (e.target.value || null) as StarcraftTierMember['race'] })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                >
                  <option value="">종족 없음</option>
                  <option value="terran">테란</option>
                  <option value="zerg">저그</option>
                  <option value="protoss">프로토스</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>SOOP 방송국 URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={editingMember._soopUrl ?? (editingMember.soop_id ? `https://www.sooplive.co.kr/station/${editingMember.soop_id}` : '')}
                    onChange={(e) => setEditingMember({ ...editingMember, _soopUrl: e.target.value })}
                    placeholder="https://www.sooplive.co.kr/station/bjid"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                  />
                  <button
                    onClick={handleFetchEditProfile}
                    disabled={isFetchingProfile}
                    style={{ padding: '8px 12px', borderRadius: '8px', background: '#3b82f6', color: '#fff', fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', opacity: isFetchingProfile ? 0.5 : 1 }}
                  >
                    {isFetchingProfile ? '가져오는 중...' : '프로필 가져오기'}
                  </button>
                </div>
                {fetchError && editingMember && (
                  <p style={{ marginTop: '4px', fontSize: '0.75rem', color: '#ff5050' }}>{fetchError}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleUpdateMember}
                  disabled={isSubmitting || isFetchingProfile}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#fd68ba', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}
                >
                  {isSubmitting ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => { setEditingMember(null); setFetchError(null) }}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#555', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 티어 목록 (드래그 정렬 가능) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tiers.map((tier) => (
          <div key={tier.id} style={{ background: 'var(--surface, #1a1a1a)', borderRadius: '12px', border: '1px solid var(--card-border, rgba(255,255,255,0.1))', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--card-border, rgba(255,255,255,0.05))', background: tier.color ? `${tier.color}20` : 'transparent' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: tier.color || '#666' }} />
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{tier.name}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>({tier.members.length}명)</span>
            </div>
            <div style={{ padding: '0.75rem 1.25rem' }}>
              {tier.members.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '0.5rem 0' }}>멤버 없음</p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(tier.id, event)}
                >
                  <SortableContext
                    items={tier.members.map(m => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {tier.members.map((member) => (
                        <SortableMemberItem
                          key={member.id}
                          member={member}
                          tiers={tiers}
                          onEdit={setEditingMember}
                          onRemove={handleRemoveMember}
                          onMove={handleMoveMember}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
