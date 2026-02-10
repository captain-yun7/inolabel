'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save } from 'lucide-react'
import styles from '@/app/admin/shared.module.css'

interface AdminModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean
  /** 모달 제목 */
  title: string
  /** 닫기 핸들러 */
  onClose: () => void
  /** 저장 핸들러 */
  onSave: () => void
  /** 저장 버튼 텍스트 (기본: '저장') */
  saveLabel?: string
  /** 취소 버튼 텍스트 (기본: '취소') */
  cancelLabel?: string
  /** 저장 버튼 비활성화 */
  saveDisabled?: boolean
  /** 모달 최대 너비 (기본: 'auto') */
  maxWidth?: string
  /** 모달 내용 */
  children: ReactNode
}

/**
 * AdminModal - Admin 페이지용 공통 모달 컴포넌트
 *
 * @example
 * ```tsx
 * <AdminModal
 *   isOpen={isModalOpen}
 *   title="시즌 추가"
 *   onClose={closeModal}
 *   onSave={handleSave}
 *   saveLabel="추가"
 * >
 *   <FormFields />
 * </AdminModal>
 * ```
 */
export default function AdminModal({
  isOpen,
  title,
  onClose,
  onSave,
  saveLabel = '저장',
  cancelLabel = '취소',
  saveDisabled = false,
  maxWidth,
  children,
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={maxWidth ? { maxWidth } : undefined}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <h2>{title}</h2>
              <button onClick={onClose} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className={styles.modalBody}>
              {children}
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <button onClick={onClose} className={styles.cancelButton}>
                {cancelLabel}
              </button>
              <button
                onClick={onSave}
                className={styles.saveButton}
                disabled={saveDisabled}
              >
                <Save size={16} />
                {saveLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
