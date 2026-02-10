'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import styles from './AlertModal.module.css'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  type?: AlertType
  confirmText?: string
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = '확인',
}: AlertModalProps) {
  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className={styles.closeButton}>
              <X size={18} />
            </button>

            <div className={`${styles.iconWrapper} ${styles[type]}`}>
              <Icon size={28} />
            </div>

            {title && <h3 className={styles.title}>{title}</h3>}

            <p className={styles.message}>{message}</p>

            <button onClick={onClose} className={`${styles.confirmButton} ${styles[type]}`}>
              {confirmText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
