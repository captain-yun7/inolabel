import type {
  SoopLiveStatus,
  SoopLiveApiResponse,
  SoopBoardPost,
  SoopVod,
} from './types'

const LIVE_API_URL = 'https://live.sooplive.co.kr/afreeca/player_live_api.php'
const CHANNEL_API_URL = 'https://chapi.sooplive.co.kr/api'

// 30초 캐시
const liveCache = new Map<string, { data: SoopLiveStatus; timestamp: number }>()
const CACHE_TTL = 30_000

/**
 * SOOP TV 채널의 라이브 상태 조회
 * @param bjId SOOP BJ 아이디
 */
export async function checkLiveStatus(bjId: string): Promise<SoopLiveStatus> {
  // 캐시 확인
  const cached = liveCache.get(bjId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    const formData = new URLSearchParams()
    formData.append('bid', bjId)
    formData.append('type', 'live')
    formData.append('player_type', 'html5')

    const response = await fetch(LIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`SOOP API error: ${response.status}`)
    }

    const raw: SoopLiveApiResponse = await response.json()

    const status: SoopLiveStatus = {
      bjId,
      bjNick: raw.CHANNEL?.BJNICK || bjId,
      title: raw.CHANNEL?.TITLE || '',
      isLive: raw.RESULT === 1 && raw.CHANNEL !== null,
      viewerCount: raw.CHANNEL?.VIEWCNT || 0,
      thumbnailUrl: raw.CHANNEL?.THUMB || null,
      categoryName: raw.CHANNEL?.CATE || null,
      startTime: null,
    }

    // 캐시 저장
    liveCache.set(bjId, { data: status, timestamp: Date.now() })

    return status
  } catch (error) {
    console.error(`SOOP live check failed for ${bjId}:`, error)
    return {
      bjId,
      bjNick: bjId,
      title: '',
      isLive: false,
      viewerCount: 0,
      thumbnailUrl: null,
      categoryName: null,
      startTime: null,
    }
  }
}

/**
 * 여러 채널의 라이브 상태 동시 조회
 * @param bjIds BJ 아이디 배열
 * @param concurrency 동시 요청 수 (기본 3)
 */
export async function checkMultipleLiveStatus(
  bjIds: string[],
  concurrency = 3
): Promise<SoopLiveStatus[]> {
  const results: SoopLiveStatus[] = []

  for (let i = 0; i < bjIds.length; i += concurrency) {
    const batch = bjIds.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(checkLiveStatus))
    results.push(...batchResults)
  }

  return results
}

/**
 * SOOP TV 채널 홈 정보 조회 (게시글, VOD 등)
 * @param bjId SOOP BJ 아이디
 */
export async function getChannelHome(bjId: string): Promise<{
  posts: SoopBoardPost[]
  vods: SoopVod[]
  isLive: boolean
} | null> {
  try {
    const response = await fetch(`${CHANNEL_API_URL}/${bjId}/home`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`SOOP Channel API error: ${response.status}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json()

    // SOOP API raw 필드를 SoopBoardPost로 변환
    const posts: SoopBoardPost[] = (data.boards || []).map((b: Record<string, unknown>) => ({
      title_no: b.title_no as number,
      title: (b.title_name || b.title || '') as string,
      content: (b.content || '') as string,
      write_dt: (b.reg_date || b.write_dt || '') as string,
      read_cnt: typeof b.count === 'object' && b.count !== null
        ? ((b.count as Record<string, number>).read_cnt || 0)
        : (b.read_cnt as number || 0),
      comment_cnt: typeof b.count === 'object' && b.count !== null
        ? ((b.count as Record<string, number>).comment_cnt || 0)
        : (b.comment_cnt as number || 0),
    }))

    // SOOP API raw 필드를 SoopVod로 변환
    const vods: SoopVod[] = (data.vods || []).map((v: Record<string, unknown>) => ({
      title_no: v.title_no as number,
      title: (v.title_name || v.title || '') as string,
      thumbnail: (v.thumb || v.thumbnail || '') as string,
      duration: (v.duration as number) || 0,
      read_cnt: typeof v.count === 'object' && v.count !== null
        ? ((v.count as Record<string, number>).read_cnt || 0)
        : (v.read_cnt as number || 0),
      reg_date: (v.reg_date || '') as string,
    }))

    return {
      posts,
      vods,
      isLive: data.broad !== null,
    }
  } catch (error) {
    console.error(`SOOP channel home failed for ${bjId}:`, error)
    return null
  }
}

/**
 * SOOP TV 채널 URL에서 BJ ID 추출
 * @param url SOOP TV 채널 URL
 */
export function extractBjId(url: string): string | null {
  if (!url) return null

  // https://www.sooplive.co.kr/station/bjid (방송국 URL)
  // https://ch.sooplive.co.kr/bjid
  // https://play.sooplive.co.kr/bjid/12345
  const patterns = [
    /sooplive\.co\.kr\/station\/([a-zA-Z0-9_]+)/,
    /soop\.co\.kr\/station\/([a-zA-Z0-9_]+)/,
    /sooplive\.co\.kr\/([a-zA-Z0-9_]+)/,
    /soop\.co\.kr\/([a-zA-Z0-9_]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  // URL이 아닌 경우 그냥 ID로 사용
  if (/^[a-zA-Z0-9_]+$/.test(url)) {
    return url
  }

  return null
}

/**
 * SOOP TV 방송 URL 생성
 * @param bjId BJ 아이디
 */
export function getSoopStreamUrl(bjId: string): string {
  return `https://play.sooplive.co.kr/${bjId}`
}
