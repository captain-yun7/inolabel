'use client'

import { Search, Tag } from 'lucide-react'
import { CATEGORY_LABELS, getCategoryColor } from '@/lib/hooks/useTimelineData'
import styles from './Timeline.module.css'

interface TimelineFilterProps {
  categories: string[]
  selectedCategory: string | null
  searchQuery: string
  onCategoryChange: (category: string | null) => void
  onSearchChange: (query: string) => void
}

export default function TimelineFilter({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: TimelineFilterProps) {
  return (
    <div className={styles.filterSection}>
      {/* Category Filter */}
      <div className={styles.filterRow}>
        <div className={styles.filterLabel}>
          <Tag size={18} />
          <span>카테고리</span>
        </div>
        <div className={styles.categoryFilter}>
          <button
            onClick={() => onCategoryChange(null)}
            className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ''}`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`${styles.categoryButton} ${selectedCategory === cat ? styles.active : ''}`}
              style={
                {
                  '--category-color': getCategoryColor(cat),
                } as React.CSSProperties
              }
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className={styles.filterRow}>
        <div className={styles.filterLabel}>
          <Search size={18} />
          <span>검색</span>
        </div>
        <div className={styles.searchFilter}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="제목, 내용으로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
