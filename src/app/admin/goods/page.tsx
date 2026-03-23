'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus, X, Save, Trash2, ExternalLink, Settings } from 'lucide-react'
/* eslint-disable @next/next/no-img-element */
import { useSupabaseContext } from '@/lib/context'
import { useAlert } from '@/lib/hooks'
import { getGoods, createGoods, updateGoods, deleteGoods, bulkCreateGoods } from '@/lib/actions/goods'
import styles from '../shared.module.css'

interface GoodsItem {
  id: number
  name: string
  price: number
  image_url: string
  description: string | null
  detail_image_url: string | null
  purchase_url: string | null
  is_active: boolean
}

export default function GoodsAdminPage() {
  const supabase = useSupabaseContext()
  const { showConfirm, showError, showSuccess } = useAlert()
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<GoodsItem> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 섹션 제목 설정
  const [sectionTitle, setSectionTitle] = useState('레이블 굿즈샵')
  const [isSavingTitle, setIsSavingTitle] = useState(false)

  // 크롤링
  const [scrapeUrl, setScrapeUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)

  const fetchGoods = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await getGoods()

    if (!error && data) {
      setGoods(data as GoodsItem[])
    }
    setIsLoading(false)
  }, [])

  // 섹션 제목 로드
  useEffect(() => {
    async function loadTitle() {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'goods_shop_title')
        .maybeSingle()
      if (data?.value && typeof data.value === 'string') {
        setSectionTitle(data.value)
      }
    }
    loadTitle()
  }, [supabase])

  useEffect(() => {
    fetchGoods()
  }, [fetchGoods])

  const saveSectionTitle = async () => {
    setIsSavingTitle(true)
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'goods_shop_title', value: sectionTitle }, { onConflict: 'key' })
    if (error) {
      showError('제목 저장 실패', '오류')
    } else {
      showSuccess('섹션 제목이 저장되었습니다.', '저장 완료')
    }
    setIsSavingTitle(false)
  }

  const handleAdd = () => {
    setEditingItem({
      name: '',
      price: 0,
      image_url: '',
      description: '',
      detail_image_url: '',
      purchase_url: '',
      is_active: true,
    })
    setIsNew(true)
    setIsModalOpen(true)
  }

  const handleEdit = (item: GoodsItem) => {
    setEditingItem({ ...item })
    setIsNew(false)
    setIsModalOpen(true)
  }

  const handleDelete = async (item: GoodsItem) => {
    const confirmed = await showConfirm(`"${item.name}" 상품을 삭제하시겠습니까?`, {
      title: '삭제 확인',
      variant: 'danger',
    })
    if (!confirmed) return

    const { error } = await deleteGoods(item.id)
    if (error) {
      showError('삭제 실패: ' + error, '오류')
    } else {
      await fetchGoods()
    }
  }

  const handleSave = async () => {
    if (!editingItem?.name || !editingItem?.image_url) {
      showError('상품명과 이미지 URL은 필수입니다.', '입력 오류')
      return
    }

    setIsSaving(true)
    const payload = {
      name: editingItem.name,
      price: editingItem.price || 0,
      image_url: editingItem.image_url,
      description: editingItem.description || null,
      detail_image_url: editingItem.detail_image_url || null,
      purchase_url: editingItem.purchase_url || null,
      is_active: editingItem.is_active ?? true,
    }

    if (isNew) {
      const { error } = await createGoods(payload)
      if (error) {
        showError('추가 실패: ' + error, '오류')
        setIsSaving(false)
        return
      }
    } else if (editingItem.id) {
      const { error } = await updateGoods(editingItem.id, payload)
      if (error) {
        showError('수정 실패: ' + error, '오류')
        setIsSaving(false)
        return
      }
    }

    setIsModalOpen(false)
    setEditingItem(null)
    setIsSaving(false)
    await fetchGoods()
  }

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return
    setIsScraping(true)
    try {
      const res = await fetch(`/api/goods/scrape?url=${encodeURIComponent(scrapeUrl.trim())}`)
      const json = await res.json()

      if (json.error) {
        showError(json.error, '크롤링 실패')
      } else if (json.products && json.products.length > 0) {
        // 크롤링된 상품들을 서버 액션으로 DB에 저장
        const { error } = await bulkCreateGoods(
          json.products.map((product: { name: string; price: number; image_url: string; url: string }) => ({
            name: product.name,
            price: product.price || 0,
            image_url: product.image_url || '',
            purchase_url: product.url || scrapeUrl,
            is_active: true,
          }))
        )
        if (error) {
          showError('상품 저장 실패: ' + error, '오류')
        } else {
          showSuccess(`${json.products.length}개 상품이 추가되었습니다.`, '크롤링 완료')
          setScrapeUrl('')
          await fetchGoods()
        }
      } else {
        showError('상품을 찾을 수 없습니다.', '크롤링 결과')
      }
    } catch {
      showError('크롤링 중 오류가 발생했습니다.', '오류')
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <ShoppingBag size={24} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>굿즈 관리</h1>
            <p className={styles.subtitle}>레이블 굿즈샵 상품 관리</p>
          </div>
        </div>
        <button onClick={handleAdd} className={styles.addButton}>
          <Plus size={18} />
          상품 추가
        </button>
      </header>

      {/* 섹션 제목 설정 */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
        <Settings size={16} style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          placeholder="굿즈샵 섹션 제목"
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
          onClick={saveSectionTitle}
          disabled={isSavingTitle}
          className={styles.addButton}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <Save size={14} />
          {isSavingTitle ? '저장 중...' : '제목 저장'}
        </button>
      </div>

      {/* URL 크롤링 */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        marginBottom: '1.5rem',
        padding: '1rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--surface)',
      }}>
        <ExternalLink size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          type="url"
          value={scrapeUrl}
          onChange={(e) => setScrapeUrl(e.target.value)}
          placeholder="외부 쇼핑몰 URL 입력 (예: doublecheckstores.com/88)"
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
          }}
        />
        <button
          onClick={handleScrape}
          disabled={isScraping || !scrapeUrl.trim()}
          className={styles.addButton}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          {isScraping ? '크롤링 중...' : '크롤링'}
        </button>
      </div>

      {/* 상품 목록 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
          로딩 중...
        </div>
      ) : goods.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
          <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {goods.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
                opacity: item.is_active ? 1 : 0.5,
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: 'var(--surface)' }}>
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} referrerPolicy="no-referrer" />
                )}
              </div>
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Intl.NumberFormat('ko-KR').format(item.price)}원
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      border: '1px solid var(--danger, #ef4444)',
                      borderRadius: '4px',
                      background: 'transparent',
                      color: 'var(--danger, #ef4444)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 편집 모달 */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '500px' }}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{isNew ? '상품 추가' : '상품 수정'}</h2>
                <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>상품명 *</label>
                  <input
                    type="text"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>가격 (원)</label>
                  <input
                    type="number"
                    value={editingItem.price || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>이미지 URL *</label>
                  <input
                    type="url"
                    value={editingItem.image_url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                    className={styles.input}
                  />
                  {editingItem.image_url && (
                    <div style={{ marginTop: '0.5rem', width: '120px', height: '120px', position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                      <img src={editingItem.image_url} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>상세 이미지 URL</label>
                  <input
                    type="url"
                    value={editingItem.detail_image_url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, detail_image_url: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>구매 URL</label>
                  <input
                    type="url"
                    value={editingItem.purchase_url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, purchase_url: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block', color: 'var(--text-secondary)' }}>설명</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className={styles.input}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={editingItem.is_active ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                    id="goods-active"
                  />
                  <label htmlFor="goods-active" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>활성화 (홈페이지에 표시)</label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                  취소
                </button>
                <button onClick={handleSave} disabled={isSaving} className={styles.saveButton}>
                  <Save size={16} />
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
