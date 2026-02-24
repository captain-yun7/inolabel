'use client'

import styles from './SideBanner.module.css'

/**
 * SideBanner - 심플한 임시 배너
 */
export default function SideBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.logo}>
          <span className={styles.rg}>INO</span>
          <span className={styles.family}>LABEL</span>
        </div>
      </div>
    </div>
  )
}
