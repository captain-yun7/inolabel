/**
 * 동적 Sitemap 생성
 *
 * SEO 최적화를 위한 사이트맵을 자동 생성합니다.
 * /sitemap.xml 경로로 접근 가능합니다.
 */

import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rgfamily.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/ranking`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ranking/vip`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/rg/org`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/rg/sig`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/rg/history`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/rg/live`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/schedule`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/notice`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/community/free`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/community/vip`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ]

  // 시즌별 랭킹 페이지 (동적)
  const seasonPages: MetadataRoute.Sitemap = [1, 2, 3, 4].map((seasonId) => ({
    url: `${BASE_URL}/ranking/season/${seasonId}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...seasonPages]
}
