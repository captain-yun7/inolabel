// SOOP TV API 타입 정의

/** 라이브 상태 응답 */
export interface SoopLiveStatus {
  bjId: string
  bjNick: string
  title: string
  isLive: boolean
  viewerCount: number
  thumbnailUrl: string | null
  categoryName: string | null
  startTime: string | null
}

/** 라이브 API 원시 응답 (player_live_api.php) */
export interface SoopLiveApiResponse {
  CHANNEL: {
    BJID: string
    BJNICK: string
    TITLE: string
    THUMB: string
    CATE: string
    VIEWCNT: number
    BESSION: number
  } | null
  RESULT: number
}

/** 채널 홈 API 응답 (chapi) */
export interface SoopChannelHomeResponse {
  profile_image: string
  station: {
    user_id: string
    user_nick: string
    station_title: string
  }
  broad: {
    broad_no: number
    broad_title: string
    current_sum_viewer: number
    broad_thumb: string
  } | null
  boards: SoopBoardPost[]
  vods: SoopVod[]
}

/** 채널 게시글 */
export interface SoopBoardPost {
  title_no: number
  title: string
  content: string
  write_dt: string
  read_cnt: number
  comment_cnt: number
}

/** VOD 정보 */
export interface SoopVod {
  title_no: number
  title: string
  thumbnail: string
  duration: number
  read_cnt: number
  reg_date: string
}

/** SOOP TV 설정 */
export interface SoopConfig {
  bjId: string | null
  enabled: boolean
}
