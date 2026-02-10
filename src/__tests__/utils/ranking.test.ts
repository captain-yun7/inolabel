import { describe, it, expect } from 'vitest'
import { getRankIcon, getRankTier, getInitials } from '@/lib/utils'
import { Crown, Medal, Award, Star } from 'lucide-react'

describe('getRankIcon', () => {
  describe('standard variant (default)', () => {
    it('should return Crown for rank 1', () => {
      expect(getRankIcon(1)).toBe(Crown)
    })

    it('should return Medal for rank 2', () => {
      expect(getRankIcon(2)).toBe(Medal)
    })

    it('should return Award for rank 3', () => {
      expect(getRankIcon(3)).toBe(Award)
    })

    it('should return null for rank > 3', () => {
      expect(getRankIcon(4)).toBeNull()
      expect(getRankIcon(10)).toBeNull()
    })
  })

  describe('minimal variant', () => {
    it('should return Crown for rank 1', () => {
      expect(getRankIcon(1, 'minimal')).toBe(Crown)
    })

    it('should return Star for rank 2', () => {
      expect(getRankIcon(2, 'minimal')).toBe(Star)
    })

    it('should return Star for rank 3', () => {
      expect(getRankIcon(3, 'minimal')).toBe(Star)
    })

    it('should return null for rank > 3', () => {
      expect(getRankIcon(4, 'minimal')).toBeNull()
    })
  })
})

describe('getRankTier', () => {
  describe('standard variant (default)', () => {
    it('should return gold for rank 1', () => {
      expect(getRankTier(1)).toBe('gold')
    })

    it('should return silver for rank 2', () => {
      expect(getRankTier(2)).toBe('silver')
    })

    it('should return bronze for rank 3', () => {
      expect(getRankTier(3)).toBe('bronze')
    })

    it('should return default for rank > 3', () => {
      expect(getRankTier(4)).toBe('default')
      expect(getRankTier(100)).toBe('default')
    })
  })

  describe('elite variant', () => {
    it('should return gold for rank 1', () => {
      expect(getRankTier(1, 'elite')).toBe('gold')
    })

    it('should return elite for rank 2', () => {
      expect(getRankTier(2, 'elite')).toBe('elite')
    })

    it('should return elite for rank 3', () => {
      expect(getRankTier(3, 'elite')).toBe('elite')
    })

    it('should return default for rank > 3', () => {
      expect(getRankTier(4, 'elite')).toBe('default')
    })
  })
})

describe('getInitials', () => {
  describe('Korean names', () => {
    it('should return first 2 characters by default', () => {
      expect(getInitials('홍길동')).toBe('홍길')
      expect(getInitials('김철수')).toBe('김철')
    })

    it('should respect koreanMax option', () => {
      expect(getInitials('홍길동', { koreanMax: 1 })).toBe('홍')
      expect(getInitials('김철수', { koreanMax: 3 })).toBe('김철수')
    })
  })

  describe('English names', () => {
    it('should return first 2 characters by default', () => {
      expect(getInitials('John')).toBe('JO')
      expect(getInitials('Alice')).toBe('AL')
    })

    it('should respect englishMax option', () => {
      expect(getInitials('John', { englishMax: 1 })).toBe('J')
      expect(getInitials('Alice', { englishMax: 3 })).toBe('ALI')
    })
  })

  describe('Special characters', () => {
    it('should remove special characters before processing', () => {
      expect(getInitials('@@홍길동##')).toBe('홍길')
      expect(getInitials('***John***')).toBe('JO')
    })

    it('should handle numbers and special chars only', () => {
      expect(getInitials('123!@#')).toBe('')
    })
  })
})
