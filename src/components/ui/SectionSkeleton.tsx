'use client'

import styles from './SectionSkeleton.module.css'

interface SectionSkeletonProps {
  type?: 'shorts' | 'vod' | 'default'
}

export default function SectionSkeleton({ type = 'default' }: SectionSkeletonProps) {
  if (type === 'shorts') {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleSkeleton} />
          <div className={styles.line} />
        </div>
        <div className={styles.shortsGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.shortCard}>
              <div className={styles.shortThumb} />
              <div className={styles.shortTitle} />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (type === 'vod') {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleSkeleton} />
          <div className={styles.line} />
        </div>
        <div className={styles.vodGrid}>
          <div className={styles.vodFeatured} />
          <div className={styles.vodList}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.vodItem}>
                <div className={styles.vodThumb} />
                <div className={styles.vodInfo}>
                  <div className={styles.vodTitle} />
                  <div className={styles.vodDate} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton} />
        <div className={styles.line} />
      </div>
      <div className={styles.defaultContent} />
    </section>
  )
}
