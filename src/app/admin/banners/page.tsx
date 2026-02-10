'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  Plus,
  X,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Link as LinkIcon,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { DataTable, Column } from '@/components/admin'
import { useSupabaseContext } from '@/lib/context'
import { useAlert } from '@/lib/hooks'
import styles from '../shared.module.css'
import bannerStyles from './page.module.css'

interface Banner {
  id: number
  title: string
  imageUrl: string
  linkUrl: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export default function BannersPage() {
  const supabase = useSupabaseContext()
  const { showConfirm, showError } = useAlert()
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fetchBanners = useCallback(async () => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('배너 데이터 로드 실패:', error)
    } else {
      setBanners(
        (data || []).map((b) => ({
          id: b.id,
          title: b.title || '',
          imageUrl: b.image_url,
          linkUrl: b.link_url,
          displayOrder: b.display_order,
          isActive: b.is_active,
          createdAt: b.created_at,
        }))
      )
    }

    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const handleAdd = () => {
    const maxOrder = Math.max(0, ...banners.map(b => b.displayOrder))
    setEditingBanner({
      title: '',
      imageUrl: '',
      linkUrl: '',
      displayOrder: maxOrder + 1,
      isActive: true,
    })
    setIsNew(true)
    setPreviewUrl(null)
    setIsModalOpen(true)
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsNew(false)
    setPreviewUrl(banner.imageUrl)
    setIsModalOpen(true)
  }

  const handleDelete = async (banner: Banner) => {
    const confirmed = await showConfirm('정말 삭제하시겠습니까?', {
      title: '배너 삭제',
      variant: 'danger',
      confirmText: '삭제',
      cancelText: '취소',
    })
    if (!confirmed) return

    const { error } = await supabase.from('banners').delete().eq('id', banner.id)

    if (error) {
      console.error('배너 삭제 실패:', error)
      showError('삭제에 실패했습니다.')
    } else {
      fetchBanners()
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !banner.isActive })
      .eq('id', banner.id)

    if (error) {
      console.error('배너 상태 변경 실패:', error)
      showError('상태 변경에 실패했습니다.')
    } else {
      fetchBanners()
    }
  }

  const handleSave = async () => {
    if (!editingBanner || !editingBanner.imageUrl) {
      showError('이미지 URL을 입력해주세요.', '입력 오류')
      return
    }

    if (isNew) {
      const { error } = await supabase.from('banners').insert({
        title: editingBanner.title || null,
        image_url: editingBanner.imageUrl,
        link_url: editingBanner.linkUrl || null,
        display_order: editingBanner.displayOrder,
        is_active: editingBanner.isActive ?? true,
      })

      if (error) {
        console.error('배너 등록 실패:', error)
        showError('등록에 실패했습니다.')
        return
      }
    } else {
      const { error } = await supabase
        .from('banners')
        .update({
          title: editingBanner.title || null,
          image_url: editingBanner.imageUrl,
          link_url: editingBanner.linkUrl || null,
          display_order: editingBanner.displayOrder,
          is_active: editingBanner.isActive,
        })
        .eq('id', editingBanner.id!)

      if (error) {
        console.error('배너 수정 실패:', error)
        showError('수정에 실패했습니다.')
        return
      }
    }

    setIsModalOpen(false)
    setEditingBanner(null)
    setPreviewUrl(null)
    fetchBanners()
  }

  const handleImageUrlChange = (url: string) => {
    setEditingBanner(prev => ({ ...prev, imageUrl: url }))
    setPreviewUrl(url)
  }

  const columns: Column<Banner>[] = [
    {
      key: 'displayOrder',
      header: '순서',
      width: '60px',
      render: (banner) => (
        <div className={bannerStyles.orderCell}>
          <GripVertical size={14} />
          <span>{banner.displayOrder}</span>
        </div>
      ),
    },
    {
      key: 'imageUrl',
      header: '미리보기',
      width: '120px',
      render: (banner) => (
        <div className={bannerStyles.previewCell}>
          {banner.imageUrl ? (
            <Image
              src={banner.imageUrl}
              alt={banner.title || '배너'}
              width={100}
              height={50}
              className={bannerStyles.thumbnail}
            />
          ) : (
            <div className={bannerStyles.noImage}>
              <ImageIcon size={20} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      header: '제목',
      render: (banner) => banner.title || '-',
    },
    {
      key: 'linkUrl',
      header: '링크',
      render: (banner) =>
        banner.linkUrl ? (
          <a
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={bannerStyles.link}
          >
            <LinkIcon size={14} />
            <span>{banner.linkUrl.length > 30 ? `${banner.linkUrl.slice(0, 30)}...` : banner.linkUrl}</span>
          </a>
        ) : (
          '-'
        ),
    },
    {
      key: 'isActive',
      header: '상태',
      width: '80px',
      render: (banner) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggleActive(banner)
          }}
          className={`${bannerStyles.statusButton} ${banner.isActive ? bannerStyles.active : bannerStyles.inactive}`}
        >
          {banner.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>{banner.isActive ? '활성' : '비활성'}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '50px',
      render: (banner) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(banner)
          }}
          className={bannerStyles.deleteButton}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ImageIcon size={28} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>배너 관리</h1>
            <p className={styles.subtitle}>메인 페이지 슬라이드 배너를 관리합니다</p>
          </div>
        </div>
        <button className={styles.addButton} onClick={handleAdd}>
          <Plus size={18} />
          <span>배너 추가</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={banners}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingBanner && (
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
            >
              <div className={styles.modalHeader}>
                <h2>{isNew ? '배너 추가' : '배너 수정'}</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Image Preview */}
                <div className={bannerStyles.imagePreview}>
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="배너 미리보기"
                      fill
                      className={bannerStyles.previewImage}
                      onError={() => setPreviewUrl(null)}
                    />
                  ) : (
                    <div className={bannerStyles.noPreview}>
                      <ImageIcon size={48} />
                      <span>이미지 URL을 입력하면 미리보기가 표시됩니다</span>
                    </div>
                  )}
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>
                    이미지 URL <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="url"
                    value={editingBanner.imageUrl || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>제목 (선택)</label>
                  <input
                    type="text"
                    value={editingBanner.title || ''}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, title: e.target.value })
                    }
                    placeholder="배너 제목"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>링크 URL (선택)</label>
                  <input
                    type="url"
                    value={editingBanner.linkUrl || ''}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, linkUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>표시 순서</label>
                  <input
                    type="number"
                    value={editingBanner.displayOrder || 0}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className={styles.input}
                    style={{ width: '100px' }}
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={editingBanner.isActive ?? true}
                      onChange={(e) =>
                        setEditingBanner({
                          ...editingBanner,
                          isActive: e.target.checked,
                        })
                      }
                      className={styles.checkbox}
                    />
                    <span>활성화</span>
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button className={styles.saveButton} onClick={handleSave}>
                  <Save size={16} />
                  <span>{isNew ? '등록' : '저장'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
