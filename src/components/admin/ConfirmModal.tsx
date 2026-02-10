'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import styles from './ConfirmModal.module.css'

export interface ConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = '확인',
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'danger',
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onCancel} className={styles.closeButton}>
              <X size={18} />
            </button>

            <div className={`${styles.iconWrapper} ${styles[variant]}`}>
              <AlertTriangle size={28} />
            </div>

            <h3 className={styles.title}>{title}</h3>

            <p className={styles.message}>{message}</p>

            <div className={styles.buttons}>
              <button onClick={onCancel} className={styles.cancelButton}>
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`${styles.confirmButton} ${styles[variant]}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
