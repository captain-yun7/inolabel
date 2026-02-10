'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
    >
      <div className={styles.iconWrapper}>
        <Sun
          size={18}
          className={`${styles.icon} ${styles.sunIcon} ${theme === 'light' ? styles.active : ''}`}
        />
        <Moon
          size={18}
          className={`${styles.icon} ${styles.moonIcon} ${theme === 'dark' ? styles.active : ''}`}
        />
      </div>
    </button>
  )
}
