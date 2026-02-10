/**
 * YouTube URL 유틸리티
 * YouTube URL에서 비디오 ID 추출 및 임베드 URL 생성
 */

/**
 * YouTube URL에서 비디오 ID를 추출
 * 지원 형식:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // 이미 ID만 있는 경우
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * YouTube 임베드 URL 생성
 */
export function getYouTubeEmbedUrl(videoIdOrUrl: string, options?: {
  autoplay?: boolean
  mute?: boolean
  loop?: boolean
  controls?: boolean
}): string | null {
  const videoId = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl

  if (!videoId || videoId.length !== 11) return null

  const params = new URLSearchParams()

  if (options?.autoplay) params.set('autoplay', '1')
  if (options?.mute) params.set('mute', '1')
  if (options?.loop) {
    params.set('loop', '1')
    params.set('playlist', videoId)
  }
  if (options?.controls === false) params.set('controls', '0')

  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`
}

/**
 * YouTube 썸네일 URL 생성
 * 품질 옵션: default, mqdefault, hqdefault, sddefault, maxresdefault
 */
export function getYouTubeThumbnail(
  videoIdOrUrl: string,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq'
): string | null {
  const videoId = extractYouTubeId(videoIdOrUrl)
  if (!videoId) return null

  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

/**
 * YouTube Shorts 임베드 URL 생성
 */
export function getYouTubeShortsEmbedUrl(videoIdOrUrl: string): string | null {
  const videoId = extractYouTubeId(videoIdOrUrl)
  if (!videoId) return null

  return `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}`
}

/**
 * URL이 YouTube URL인지 확인
 */
export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url)
}
