'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTiersWithMembers, addTierMember, removeTierMember, updateTierMember } from '@/lib/actions/starcraft-tier'
import type { StarcraftTierWithMembers, StarcraftTierMember } from '@/types/database'
import styles from '../shared.module.css'

export default function AdminStarcraftTierPage() {
  const [tiers, setTiers] = useState<StarcraftTierWithMembers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerRace, setNewPlayerRace] = useState<string>('')
  const [newPlayerDesc, setNewPlayerDesc] = useState('')
  const [editingMember, setEditingMember] = useState<StarcraftTierMember | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleAddMember = async () => {
    if (!selectedTierId || !newPlayerName.trim()) return
    setIsSubmitting(true)
    const { error } = await addTierMember({
      tier_id: selectedTierId,
      player_name: newPlayerName.trim(),
      race: (newPlayerRace || null) as StarcraftTierMember['race'],
      description: newPlayerDesc || null,
    })
    if (!error) {
      setNewPlayerName('')
      setNewPlayerRace('')
      setNewPlayerDesc('')
      await fetchTiers()
    } else {
      alert(error)
    }
    setIsSubmitting(false)
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const { error } = await removeTierMember(memberId)
    if (!error) {
      await fetchTiers()
    } else {
      alert(error)
    }
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return
    setIsSubmitting(true)
    const { error } = await updateTierMember(editingMember.id, {
      player_name: editingMember.player_name,
      race: editingMember.race,
      description: editingMember.description,
    })
    if (!error) {
      setEditingMember(null)
      await fetchTiers()
    } else {
      alert(error)
    }
    setIsSubmitting(false)
  }

  const handleMoveMember = async (member: StarcraftTierMember, newTierId: number) => {
    setIsSubmitting(true)
    const { error } = await updateTierMember(member.id, { tier_id: newTierId })
    if (!error) {
      await fetchTiers()
    } else {
      alert(error)
    }
    setIsSubmitting(false)
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
        <p className={styles.subtitle}>티어별 멤버를 관리합니다</p>
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
          <button
            onClick={handleAddMember}
            disabled={!selectedTierId || !newPlayerName.trim() || isSubmitting}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: selectedTierId && newPlayerName.trim() ? '#fd68ba' : '#555',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: selectedTierId && newPlayerName.trim() ? 'pointer' : 'not-allowed',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            {isSubmitting ? '추가 중...' : '추가'}
          </button>
        </div>
      </div>

      {/* 수정 모달 */}
      {editingMember && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface, #1a1a1a)', borderRadius: '16px', padding: '2rem', width: '400px', maxWidth: '90vw' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>멤버 수정</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                value={editingMember.player_name}
                onChange={(e) => setEditingMember({ ...editingMember, player_name: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
              />
              <select
                value={editingMember.race || ''}
                onChange={(e) => setEditingMember({ ...editingMember, race: (e.target.value || null) as StarcraftTierMember['race'] })}
                style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
              >
                <option value="">종족 없음</option>
                <option value="terran">테란</option>
                <option value="zerg">저그</option>
                <option value="protoss">프로토스</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleUpdateMember}
                  disabled={isSubmitting}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#fd68ba', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingMember(null)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#555', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 티어 목록 */}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {tier.members.map((member) => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{member.player_name}</span>
                        {member.race && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                            {member.race === 'terran' ? 'T' : member.race === 'zerg' ? 'Z' : 'P'}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {/* 티어 이동 드롭다운 */}
                        <select
                          value={member.tier_id}
                          onChange={(e) => {
                            const newTierId = Number(e.target.value)
                            if (newTierId !== member.tier_id) {
                              handleMoveMember(member, newTierId)
                            }
                          }}
                          style={{ padding: '4px 6px', borderRadius: '6px', background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}
                        >
                          {tiers.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingMember({ ...member })}
                          style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff5050', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
