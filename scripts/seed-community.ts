/**
 * 커뮤니티 게시판 시딩 스크립트
 * - 가상 프로필 생성 (account_type: 'virtual')
 * - 자유게시판, 추천게시판, 밈게시판, 건의게시판에 게시글 삽입
 * - 댓글 및 대댓글 삽입
 *
 * 사용법: npx tsx scripts/seed-community.ts
 */

import { getServiceClient } from './lib/supabase'
import { randomUUID } from 'crypto'

const supabase = getServiceClient()

// ==========================================
// 1. 가상 프로필 (커뮤니티 시딩용)
// ==========================================
interface VirtualProfile {
  id: string
  nickname: string
  role: 'member' | 'vip' | 'moderator' | 'admin'
  unit: 'excel' | 'crew' | null
  account_type: 'virtual'
}

const profiles: VirtualProfile[] = [
  { id: randomUUID(), nickname: '별빛하트', role: 'vip', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '린아사랑해', role: 'member', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '숲속의곰', role: 'member', unit: 'crew', account_type: 'virtual' },
  { id: randomUUID(), nickname: '스타장인', role: 'member', unit: 'crew', account_type: 'virtual' },
  { id: randomUUID(), nickname: '핑크판다', role: 'vip', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '댕댕이맘', role: 'member', unit: null, account_type: 'virtual' },
  { id: randomUUID(), nickname: '캡틴윤', role: 'moderator', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '치킨마스터', role: 'member', unit: null, account_type: 'virtual' },
  { id: randomUUID(), nickname: '새벽감성', role: 'member', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '로니팬', role: 'vip', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '월아짱', role: 'member', unit: 'excel', account_type: 'virtual' },
  { id: randomUUID(), nickname: '테란의신', role: 'member', unit: 'crew', account_type: 'virtual' },
  { id: randomUUID(), nickname: '저그러시', role: 'member', unit: 'crew', account_type: 'virtual' },
  { id: randomUUID(), nickname: '깻잎논쟁', role: 'member', unit: null, account_type: 'virtual' },
  { id: randomUUID(), nickname: '이노라벨', role: 'admin', unit: 'excel', account_type: 'virtual' },
]

// 프로필 인덱스로 빠르게 접근
function pid(index: number): string {
  return profiles[index].id
}

// ==========================================
// 2. 게시글 데이터
// ==========================================
type BoardType = 'free' | 'recommend' | 'meme' | 'report'

interface PostSeed {
  board_type: BoardType
  title: string
  content: string
  author_idx: number // profiles[] index
  view_count: number
  like_count: number
  is_anonymous: boolean
  days_ago: number // 며칠 전 작성
}

const posts: PostSeed[] = [
  // ===== 자유게시판 (free) =====
  {
    board_type: 'free',
    title: '오늘 방송 레전드였습니다 ㅋㅋㅋ',
    content: `<p>오늘 린아님 방송 다들 보셨나요?</p>
<p>스타 직급전에서 3연승 하시면서 분위기 미쳤었는데 ㅋㅋㅋ</p>
<p>특히 마지막 판에서 역전하는 거 보고 소름 돋았습니다.</p>
<p>채팅창도 하트 폭주했고 역시 우리 린아님이 최고입니다! 💖</p>`,
    author_idx: 1,
    view_count: 342,
    like_count: 28,
    is_anonymous: false,
    days_ago: 0,
  },
  {
    board_type: 'free',
    title: '신입인데 인사드립니다!',
    content: `<p>안녕하세요! 이번에 새로 가입한 댕댕이맘입니다.</p>
<p>유튜브에서 하이라이트 보고 팬이 됐어요. 방송을 본 지는 한 달 정도 됐는데 팬클럽이 있다는 걸 이제 알았네요 ㅎㅎ</p>
<p>앞으로 열심히 활동하겠습니다. 잘 부탁드려요~!</p>`,
    author_idx: 5,
    view_count: 156,
    like_count: 15,
    is_anonymous: false,
    days_ago: 1,
  },
  {
    board_type: 'free',
    title: '직급전 시즌1 결과 정리해봤습니다',
    content: `<p>시즌1 직급전 결과를 한번 정리해봤어요.</p>
<p><strong>🏆 1회차</strong></p>
<ul>
<li>1위: 별빛하트 - 역대급 하트 폭탄</li>
<li>2위: 핑크판다 - 마지막까지 접전</li>
<li>3위: 로니팬 - 꾸준한 후원</li>
</ul>
<p><strong>🏆 2회차</strong></p>
<ul>
<li>1위: 핑크판다 - 이번엔 역전승!</li>
<li>2위: 별빛하트 - 아쉬운 2위</li>
<li>3위: 월아짱 - 다크호스 등장</li>
</ul>
<p>시즌2도 기대됩니다! 다들 화이팅 🔥</p>`,
    author_idx: 6,
    view_count: 521,
    like_count: 42,
    is_anonymous: false,
    days_ago: 2,
  },
  {
    board_type: 'free',
    title: '혹시 굿즈 제작 계획 있나요?',
    content: `<p>다른 팬클럽 보면 아크릴 스탠드나 포토카드 같은 굿즈 만드는 곳 많던데</p>
<p>이노레이블도 공식 굿즈 나오면 좋겠어요!</p>
<p>개인적으로 슬로건이나 응원봉 같은 거 있으면 방송할 때 인증샷 올리고 싶은데... 수요조사 해보면 어떨까요?</p>`,
    author_idx: 8,
    view_count: 203,
    like_count: 31,
    is_anonymous: false,
    days_ago: 3,
  },
  {
    board_type: 'free',
    title: '스타 1:1 대회 관전 후기',
    content: `<p>어제 크루부 내부 1:1 스타 대회 관전했는데 진짜 재밌었어요.</p>
<p>테란의신 vs 저그러시 결승전이 명경기였습니다.</p>
<p>특히 럴커 포위 당했는데 탱크 시즈로 뚫는 거 보고 와... 감탄만 나왔어요.</p>
<p>다음 대회는 언제인가요? 시청자 참여도 가능하면 좋겠는데!</p>`,
    author_idx: 2,
    view_count: 178,
    like_count: 19,
    is_anonymous: false,
    days_ago: 4,
  },
  {
    board_type: 'free',
    title: '이번 주 방송 일정 아시는 분?',
    content: `<p>이번 주에 특별 방송 한다고 들었는데 정확한 시간 아시는 분 계신가요?</p>
<p>캘린더에 아직 업데이트가 안 된 것 같아서요.</p>
<p>평일 저녁이면 좋겠는데... 주말에만 가능하신 건지 궁금합니다.</p>`,
    author_idx: 13,
    view_count: 89,
    like_count: 3,
    is_anonymous: false,
    days_ago: 5,
  },
  {
    board_type: 'free',
    title: '사이트 새로 바뀌었네요! 깔끔하다',
    content: `<p>오랜만에 들어왔더니 사이트가 완전 리뉴얼됐네요!</p>
<p>이전보다 훨씬 깔끔하고 라이브 상태도 바로 보이고 좋습니다.</p>
<p>다크모드도 지원하고 모바일에서도 잘 보이고... 운영진 분들 수고 많으셨습니다 👏</p>
<p>조직도 페이지가 특히 맘에 들어요. cnine.kr 느낌도 나고!</p>`,
    author_idx: 0,
    view_count: 267,
    like_count: 35,
    is_anonymous: false,
    days_ago: 1,
  },
  {
    board_type: 'free',
    title: '방송 중에 나온 노래 제목 아시는 분!',
    content: `<p>어제 방송에서 게임 시작 전에 틀어주신 노래가 너무 좋았는데 제목이 뭔지 모르겠어요 ㅠㅠ</p>
<p>"나나나~" 하는 멜로디였는데... 혹시 아시는 분 있으신가요?</p>
<p>클립 타임스탬프는 대략 1시간 23분쯤이었습니다.</p>`,
    author_idx: 10,
    view_count: 67,
    like_count: 5,
    is_anonymous: false,
    days_ago: 6,
  },
  {
    board_type: 'free',
    title: '오프라인 모임 관심 있으신 분?',
    content: `<p>서울/수도권 쪽에서 오프라인 번개 한번 하면 어떨까 해서 글 올려봅니다.</p>
<p>치킨집에서 방송 같이 보면서 하트도 쏘고 하면 재밌을 것 같은데요 ㅎㅎ</p>
<p>관심 있으신 분은 댓글 달아주세요! 인원 파악해서 날짜 잡아볼게요.</p>`,
    author_idx: 7,
    view_count: 145,
    like_count: 22,
    is_anonymous: false,
    days_ago: 7,
  },
  {
    board_type: 'free',
    title: '이노레이블 가입 1주년 후기',
    content: `<p>벌써 가입한 지 1년이 됐네요.</p>
<p>처음에는 그냥 방송 재밌어서 시작했는데, 지금은 팬클럽 멤버들이랑 친해져서 매일 들어오게 됩니다.</p>
<p>직급전도 재밌고, 크루부 스타 대회도 재밌고, VIP 혜택도 좋고...</p>
<p>앞으로도 오래오래 함께하고 싶습니다. 여러분 모두 감사해요! 🎉</p>`,
    author_idx: 4,
    view_count: 198,
    like_count: 38,
    is_anonymous: false,
    days_ago: 3,
  },

  // ===== 추천게시판 (recommend) =====
  {
    board_type: 'recommend',
    title: '린아님 레전드 하이라이트 모음',
    content: `<p>유튜브에 올라온 린아님 역대 레전드 하이라이트 영상 정리해봤습니다!</p>
<p><strong>TOP 5 명장면:</strong></p>
<ol>
<li>시즌1 직급전 마지막 판 역전 - 채팅 폭주</li>
<li>12시간 마라톤 방송 - 새벽 5시까지 함께한 팬들</li>
<li>스타 1:1 BJ 대결 우승 - 결승전 명경기</li>
<li>깜짝 오프라인 이벤트 - 팬들 울린 감동 영상</li>
<li>만우절 특별 방송 - 역대급 웃음</li>
</ol>
<p>다들 기억나시나요? ㅎㅎ 빠진 거 있으면 댓글로 추천해주세요!</p>`,
    author_idx: 9,
    view_count: 412,
    like_count: 45,
    is_anonymous: false,
    days_ago: 2,
  },
  {
    board_type: 'recommend',
    title: '방송 볼 때 추천 간식 리스트',
    content: `<p>심야 방송 볼 때 맛있는 간식 추천합니다 🍕</p>
<ul>
<li><strong>치킨</strong> - 역시 방송 관전 국룰 (교촌 레드 추천)</li>
<li><strong>떡볶이</strong> - 매운 거 먹으면서 응원하면 텐션 업</li>
<li><strong>팝콘</strong> - 영화관 느낌으로 관전</li>
<li><strong>아이스크림</strong> - 여름엔 이게 최고</li>
<li><strong>과일</strong> - 건강파를 위한 선택</li>
</ul>
<p>여러분은 뭐 드시면서 보세요? 댓글로 공유해주세요~</p>`,
    author_idx: 7,
    view_count: 234,
    like_count: 27,
    is_anonymous: false,
    days_ago: 5,
  },
  {
    board_type: 'recommend',
    title: '스타크래프트 입문자를 위한 가이드',
    content: `<p>크루부 방송 보면서 스타 시작하신 분들을 위한 초보 가이드입니다!</p>
<p><strong>종족 선택 가이드:</strong></p>
<ul>
<li>🔵 <strong>테란</strong> - 가장 직관적, 마린+메딕 조합으로 시작</li>
<li>🟣 <strong>저그</strong> - 물량 러시가 매력적, 초반 빠른 공격 가능</li>
<li>🟡 <strong>프로토스</strong> - 유닛 하나하나가 강력, 드라군 A키 입문</li>
</ul>
<p><strong>추천 연습 방법:</strong></p>
<ol>
<li>캠페인 먼저 클리어하기</li>
<li>컴퓨터 상대로 1:1 연습</li>
<li>크루부 내부 친선전 참가하기</li>
</ol>
<p>궁금한 거 있으면 편하게 물어보세요!</p>`,
    author_idx: 11,
    view_count: 356,
    like_count: 33,
    is_anonymous: false,
    days_ago: 8,
  },
  {
    board_type: 'recommend',
    title: '비슷한 분위기 방송 추천해주세요',
    content: `<p>린아님 방송 없는 날에 볼만한 비슷한 분위기 방송 추천해주세요!</p>
<p>제가 좋아하는 포인트:</p>
<ul>
<li>시청자와 소통 잘 하는 것</li>
<li>게임 실력도 있으면서 재미도 있는 것</li>
<li>팬들 챙겨주는 느낌</li>
</ul>
<p>숲TV 위주로 추천 부탁드립니다~</p>`,
    author_idx: 5,
    view_count: 123,
    like_count: 8,
    is_anonymous: false,
    days_ago: 10,
  },

  // ===== 밈게시판 (meme) =====
  {
    board_type: 'meme',
    title: '오늘자 방송 짤 ㅋㅋㅋㅋ',
    content: `<p>오늘 방송에서 캡쳐한 레전드 표정 모음입니다 ㅋㅋㅋ</p>
<p>1. 하트 1000개 터졌을 때 놀란 표정</p>
<p>2. 스타에서 질 뻔했을 때 식은땀 흘리는 표정</p>
<p>3. 시청자한테 감동받아서 울먹이는 표정</p>
<p>셋 다 짤로 만들기 딱 좋은데 ㅋㅋㅋ 누가 편집 좀 해주세요!</p>`,
    author_idx: 3,
    view_count: 567,
    like_count: 52,
    is_anonymous: false,
    days_ago: 1,
  },
  {
    board_type: 'meme',
    title: '"하트 쏴라" 시리즈 모음.jpg',
    content: `<p>팬클럽 디스코드에서 유행하는 "하트 쏴라" 시리즈 모아봤습니다 ㅋㅋ</p>
<p>- 하트 안 쏘면 어떻게 되냐고요? → 직급 강등됩니다</p>
<p>- 월급날 통장에서 자동 이체되는 하트</p>
<p>- 하트 충전하러 가는 나.jpg</p>
<p>- "이번 달은 절약해야지" → 방송 시작 5분 후 → 하트 올인</p>
<p>공감 되시는 분 손! ✋ ㅋㅋㅋ</p>`,
    author_idx: 13,
    view_count: 432,
    like_count: 61,
    is_anonymous: false,
    days_ago: 3,
  },
  {
    board_type: 'meme',
    title: '방송 보기 전 vs 후',
    content: `<p><strong>방송 보기 전:</strong></p>
<p>"오늘은 일찍 자야지"</p>
<p>"하트는 적당히만 쏘자"</p>
<p>"1시간만 보고 끌게"</p>
<br>
<p><strong>방송 보고 난 후:</strong></p>
<p>시간: 새벽 4시</p>
<p>하트 잔액: 0</p>
<p>내일 출근: 6시간 후</p>
<p>후회: 없음 😎</p>
<br>
<p>다들 공감하시죠? ㅋㅋㅋㅋ</p>`,
    author_idx: 1,
    view_count: 389,
    like_count: 47,
    is_anonymous: false,
    days_ago: 5,
  },
  {
    board_type: 'meme',
    title: '스타 종족별 특징 요약 ㅋㅋ',
    content: `<p>크루부 멤버들 종족별 특징 (100% 주관적)</p>
<p><strong>🔵 테란 유저:</strong></p>
<p>- "스캔 한번만 더 쓰면 이기는데..."</p>
<p>- 탱크 한 대에 인생을 건다</p>
<p>- 벌처 지뢰 장인</p>
<br>
<p><strong>🟣 저그 유저:</strong></p>
<p>- 저글링 100마리가 기본</p>
<p>- "럴커만 나오면 끝인데..."</p>
<p>- 디파일러 쓸 줄 알면 고수</p>
<br>
<p><strong>🟡 프토 유저:</strong></p>
<p>- 캐리어 뽑으면 이미 게임 끝</p>
<p>- 리버 한 방에 일희일비</p>
<p>- "아비터만 나오면..."</p>
<br>
<p>아 맞다 결론: 다 "~만 하면 이기는데"ㅋㅋㅋ</p>`,
    author_idx: 12,
    view_count: 298,
    like_count: 39,
    is_anonymous: false,
    days_ago: 7,
  },

  // ===== 건의게시판 (report) =====
  {
    board_type: 'report',
    title: '모바일에서 캘린더 스크롤 버그',
    content: `<p>안드로이드 크롬에서 캘린더 페이지 들어가면 좌우 스크롤이 잘 안 됩니다.</p>
<p><strong>환경:</strong></p>
<ul>
<li>기기: 갤럭시 S24</li>
<li>브라우저: Chrome 최신버전</li>
<li>증상: 캘린더 날짜가 잘려서 보임</li>
</ul>
<p>PC에서는 정상이고 모바일에서만 이런 것 같아요. 확인 부탁드립니다!</p>`,
    author_idx: 8,
    view_count: 45,
    like_count: 3,
    is_anonymous: false,
    days_ago: 2,
  },
  {
    board_type: 'report',
    title: '프로필 사진 변경 기능 요청',
    content: `<p>현재 프로필 사진을 변경하는 방법이 없는 것 같은데, 마이페이지에서 직접 변경할 수 있게 해주시면 좋겠습니다.</p>
<p>가능하다면:</p>
<ol>
<li>이미지 업로드 (최대 2MB 정도)</li>
<li>원형으로 자르기(크롭) 기능</li>
<li>기본 아바타 선택 옵션</li>
</ol>
<p>검토 부탁드립니다. 감사합니다! 🙏</p>`,
    author_idx: 10,
    view_count: 78,
    like_count: 12,
    is_anonymous: false,
    days_ago: 4,
  },
  {
    board_type: 'report',
    title: '게시판 이미지 첨부 기능',
    content: `<p>게시글 작성할 때 이미지 첨부가 안 되는 것 같아요.</p>
<p>밈 게시판 같은 경우는 이미지 업로드가 필수적인데, 현재는 텍스트만 올릴 수 있어서 아쉽습니다.</p>
<p>이미지 업로드 기능 추가해주시면 감사하겠습니다!</p>`,
    author_idx: 3,
    view_count: 56,
    like_count: 9,
    is_anonymous: false,
    days_ago: 6,
  },

  // ===== 익명게시판 (anonymous) =====
  {
    board_type: 'free',
    title: '주말 방송 같이 보실 분~',
    content: `<p>이번 주 토요일 저녁 8시 방송 예정이래요!</p>
<p>디스코드 음성채팅에서 같이 보실 분 모집합니다 ㅎㅎ</p>
<p>하트 이벤트도 있다고 하니까 다들 충전 해오세요~</p>`,
    author_idx: 4,
    view_count: 134,
    like_count: 11,
    is_anonymous: false,
    days_ago: 0,
  },
  {
    board_type: 'free',
    title: 'VIP 혜택 진짜 좋네요',
    content: `<p>이번에 VIP 달성했는데 혜택이 생각보다 좋아서 놀랐습니다.</p>
<p>시그니처 영상 퀄리티가 장난 아니고, 전용 뱃지도 예쁘고요.</p>
<p>아직 VIP 아니신 분들도 도전해보세요! 후회 안 합니다 ㅎㅎ</p>`,
    author_idx: 0,
    view_count: 215,
    like_count: 24,
    is_anonymous: false,
    days_ago: 4,
  },
]

// ==========================================
// 3. 댓글 데이터
// ==========================================
interface CommentSeed {
  post_idx: number // posts[] index
  author_idx: number // profiles[] index
  content: string
  is_anonymous: boolean
  parent_comment_idx?: number // 이 배열 내 인덱스 (대댓글용)
}

const comments: CommentSeed[] = [
  // 게시글 0: 오늘 방송 레전드
  { post_idx: 0, author_idx: 0, content: '진짜 미쳤었죠 ㅋㅋ 마지막 판 역전 소름이었어요', is_anonymous: false },
  { post_idx: 0, author_idx: 4, content: '하트 500개 쐈습니다 ㅎㅎ 역시 린아님!', is_anonymous: false },
  { post_idx: 0, author_idx: 8, content: '다시보기 어디서 볼 수 있나요?', is_anonymous: false },
  { post_idx: 0, author_idx: 6, content: '숲TV 다시보기에 올라와 있습니다!', is_anonymous: false }, // 대댓글 (idx 2에 대한)

  // 게시글 1: 신입인사
  { post_idx: 1, author_idx: 6, content: '환영합니다! 앞으로 함께해요~ 🎉', is_anonymous: false },
  { post_idx: 1, author_idx: 0, content: '반갑습니다 ㅎㅎ 방송 재밌으시죠?', is_anonymous: false },
  { post_idx: 1, author_idx: 9, content: '가입 축하해요! 직급전도 꼭 참여해보세요', is_anonymous: false },
  { post_idx: 1, author_idx: 2, content: '어서오세요~ 크루부도 관심 있으시면 문의해주세요!', is_anonymous: false },

  // 게시글 2: 직급전 정리
  { post_idx: 2, author_idx: 0, content: '정리 감사합니다! 시즌2도 1위 노려야죠 ㅎㅎ', is_anonymous: false },
  { post_idx: 2, author_idx: 4, content: '시즌2는 내가 1위 먹는다... 두고 보세요 🔥', is_anonymous: false },
  { post_idx: 2, author_idx: 10, content: '다크호스라니 ㅋㅋ 다음 시즌도 열심히 하겠습니다!', is_anonymous: false },
  { post_idx: 2, author_idx: 13, content: '캡틴윤님 정리 항상 깔끔하시네요 👍', is_anonymous: false },
  { post_idx: 2, author_idx: 1, content: '시즌2 대기 중... 빨리 시작했으면 좋겠어요', is_anonymous: false },

  // 게시글 3: 굿즈 제작
  { post_idx: 3, author_idx: 0, content: '아크릴 스탠드 나오면 바로 구매합니다!', is_anonymous: false },
  { post_idx: 3, author_idx: 4, content: '슬로건 + 응원봉 세트 나오면 대박일 듯', is_anonymous: false },
  { post_idx: 3, author_idx: 14, content: '좋은 의견 감사합니다. 내부적으로 검토해보겠습니다!', is_anonymous: false },
  { post_idx: 3, author_idx: 7, content: '포토카드도 넣어주세요!! BJ 멤버 포카 ㅎㅎ', is_anonymous: false },

  // 게시글 4: 스타 대회 후기
  { post_idx: 4, author_idx: 11, content: '결승전 진짜 치열했죠 ㅋㅋ 다음엔 제가 우승합니다', is_anonymous: false },
  { post_idx: 4, author_idx: 12, content: '럴커 포위했는데 뚫리다니... 다음엔 더 잘해야겠어요 ㅠ', is_anonymous: false },
  { post_idx: 4, author_idx: 3, content: '시청자 참여전 하면 대박일 듯! 운영진님 검토 부탁요~', is_anonymous: false },

  // 게시글 6: 사이트 리뉴얼
  { post_idx: 6, author_idx: 14, content: '감사합니다! 앞으로도 계속 개선하겠습니다 😊', is_anonymous: false },
  { post_idx: 6, author_idx: 1, content: '다크모드 진짜 예쁘네요! 밤에 눈 안아프고 좋아요', is_anonymous: false },
  { post_idx: 6, author_idx: 5, content: '모바일에서도 잘 되네요~ 최고입니다', is_anonymous: false },
  { post_idx: 6, author_idx: 8, content: '조직도 페이지 호버 효과 맘에 들어요 ㅎㅎ', is_anonymous: false },

  // 게시글 8: 오프라인 모임
  { post_idx: 8, author_idx: 1, content: '서울이면 참여하고 싶습니다! 강남 쪽이면 좋겠어요', is_anonymous: false },
  { post_idx: 8, author_idx: 0, content: '저도 참여할게요! 직접 만나면 반가울 것 같아요 ㅎㅎ', is_anonymous: false },
  { post_idx: 8, author_idx: 4, content: '치킨 + 방송 관전 = 최고의 조합이죠', is_anonymous: false },
  { post_idx: 8, author_idx: 13, content: '인원 많으면 가게 예약 필요할 수도 있어요. 미리 파악해주세요!', is_anonymous: false },

  // 게시글 9: 1주년 후기
  { post_idx: 9, author_idx: 6, content: '1주년 축하합니다! 🎂 앞으로도 함께해요', is_anonymous: false },
  { post_idx: 9, author_idx: 1, content: '핑크판다님 항상 열심히 활동해주셔서 감사해요!', is_anonymous: false },

  // 게시글 10: 하이라이트 추천
  { post_idx: 10, author_idx: 0, content: '12시간 마라톤 방송 때 진짜 울뻔했어요 ㅠㅠ', is_anonymous: false },
  { post_idx: 10, author_idx: 1, content: '만우절 방송 빠질 수 없죠 ㅋㅋㅋ 레전드', is_anonymous: false },
  { post_idx: 10, author_idx: 4, content: '깜짝 오프라인 이벤트는 진짜 인생 이벤트였어요', is_anonymous: false },

  // 게시글 11: 간식 추천
  { post_idx: 11, author_idx: 2, content: '치킨이 국룰이죠 ㅋㅋ 교촌 레드 인정합니다', is_anonymous: false },
  { post_idx: 11, author_idx: 8, content: '저는 야식으로 라면 끓여먹어요 ㅎㅎ 방송이랑 찰떡궁합', is_anonymous: false },

  // 게시글 12: 스타 입문 가이드
  { post_idx: 12, author_idx: 2, content: '좋은 가이드 감사합니다! 저그 시작해볼게요', is_anonymous: false },
  { post_idx: 12, author_idx: 5, content: '프토 입문했는데 드라군 A키가 뭔가요? ㅋㅋ', is_anonymous: false },
  { post_idx: 12, author_idx: 11, content: '드라군 A키 = 어택 클릭으로 보내기입니다! 기본 중의 기본이에요 ㅎ', is_anonymous: false },

  // 게시글 14: 밈 - 오늘자 짤
  { post_idx: 14, author_idx: 1, content: 'ㅋㅋㅋㅋㅋ 3번 표정 찐이었어요', is_anonymous: false },
  { post_idx: 14, author_idx: 0, content: '누가 편집해서 올려주세요 제발 ㅋㅋ', is_anonymous: false },
  { post_idx: 14, author_idx: 10, content: '1번 놀란 표정이 밈 감입니다 ㅋㅋㅋ', is_anonymous: false },

  // 게시글 15: 하트쏴라 시리즈
  { post_idx: 15, author_idx: 0, content: '월급날 자동이체 하트... 너무 현실적이라 웃기네요 ㅋㅋ', is_anonymous: false },
  { post_idx: 15, author_idx: 4, content: '"이번 달은 절약" → 5분 후 올인 ← 이거 나인데? ㅋㅋㅋ', is_anonymous: false },
  { post_idx: 15, author_idx: 8, content: '공감 100% ㅋㅋㅋ 손 ✋', is_anonymous: false },

  // 게시글 16: 방송 전 vs 후
  { post_idx: 16, author_idx: 3, content: '하트 잔액 0은 진짜 공감 안 될 수가 없음 ㅋㅋ', is_anonymous: false },
  { post_idx: 16, author_idx: 5, content: '후회는 없다... 이 말에 모든 게 담겨있네요 😂', is_anonymous: false },

  // 게시글 18: 모바일 캘린더 버그 (건의)
  { post_idx: 18, author_idx: 14, content: '제보 감사합니다. 확인 후 수정하겠습니다!', is_anonymous: false },
  { post_idx: 18, author_idx: 8, content: '저도 같은 증상이에요! 아이폰에서도 그렇습니다', is_anonymous: false },

  // 게시글 19: 프로필 사진 변경
  { post_idx: 19, author_idx: 14, content: '좋은 건의 감사합니다. 다음 업데이트에 반영 검토하겠습니다!', is_anonymous: false },
  { post_idx: 19, author_idx: 5, content: '저도 이거 필요했어요! 빨리 나왔으면 좋겠네요', is_anonymous: false },
]

// ==========================================
// 실행
// ==========================================
async function main() {
  console.log('🌱 커뮤니티 게시판 시딩 시작...\n')

  // 1. 기존 데이터 확인
  const { count: existingPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
  if (existingPosts && existingPosts > 0) {
    console.log(`⚠️  이미 ${existingPosts}개의 게시글이 있습니다. 중복 방지를 위해 종료합니다.`)
    console.log('   초기화하려면 먼저 데이터를 삭제한 후 다시 실행하세요.')
    return
  }

  // 2. auth.users + 프로필 생성 (Supabase Admin Auth API)
  console.log('👤 가상 유저 + 프로필 생성 중...')
  for (const p of profiles) {
    // auth.users에 가상 유저 생성
    const email = `${p.id.slice(0, 8)}@virtual.inno-label.kr`
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: `Virtual!${p.id.slice(0, 12)}`,
      email_confirm: true,
      user_metadata: { nickname: p.nickname, is_virtual: true },
    })

    if (authError) {
      console.error(`  ❌ Auth 유저 "${p.nickname}" 생성 실패:`, authError.message)
      continue
    }

    // 생성된 auth user ID로 프로필 ID 덮어쓰기
    const realId = authUser.user.id
    p.id = realId

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: realId,
      nickname: p.nickname,
      role: p.role,
      unit: p.unit,
      account_type: p.account_type,
      total_donation: 0,
    })
    if (profileError) {
      console.error(`  ❌ 프로필 "${p.nickname}" 생성 실패:`, profileError.message)
    } else {
      console.log(`  ✅ ${p.nickname} (${p.role})`)
    }
  }
  console.log(`  📊 ${profiles.length}개 유저 처리 완료\n`)

  // 3. 게시글 생성
  console.log('📝 게시글 생성 중...')
  const postIds: number[] = []

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i]
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - p.days_ago)
    createdAt.setHours(
      Math.floor(Math.random() * 14) + 9, // 9~22시
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    )

    const { data, error } = await supabase
      .from('posts')
      .insert({
        board_type: p.board_type,
        title: p.title,
        content: p.content,
        author_id: pid(p.author_idx),
        view_count: p.view_count,
        like_count: p.like_count,
        comment_count: 0, // 나중에 업데이트
        is_anonymous: p.is_anonymous,
        is_deleted: false,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error(`  ❌ 게시글 "${p.title}" 생성 실패:`, error.message)
      postIds.push(-1)
    } else {
      postIds.push(data.id)
      console.log(`  ✅ [${p.board_type}] ${p.title}`)
    }
  }
  console.log(`\n  📊 총 ${postIds.filter((id) => id !== -1).length}/${posts.length}개 게시글 생성\n`)

  // 4. 댓글 생성
  console.log('💬 댓글 생성 중...')
  const commentIds: number[] = []
  let commentSuccess = 0

  // 대댓글 매핑 (특정 댓글에 대한 답글)
  const replyMap: Record<number, number> = {
    3: 2, // 댓글[3]은 댓글[2]의 대댓글
    19: 18, // 댓글[19]은 댓글[18]의 대댓글 (럴커 포위 대댓글)
    38: 37, // 스타 입문 대댓글
  }

  for (let i = 0; i < comments.length; i++) {
    const c = comments[i]
    const actualPostId = postIds[c.post_idx]
    if (actualPostId === -1) {
      commentIds.push(-1)
      continue
    }

    const parentId = replyMap[i] !== undefined ? commentIds[replyMap[i]] : null

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: actualPostId,
        author_id: pid(c.author_idx),
        content: c.content,
        parent_id: parentId && parentId !== -1 ? parentId : null,
        is_anonymous: c.is_anonymous,
        is_deleted: false,
      })
      .select('id')
      .single()

    if (error) {
      console.error(`  ❌ 댓글 생성 실패 (게시글 #${c.post_idx}):`, error.message)
      commentIds.push(-1)
    } else {
      commentIds.push(data.id)
      commentSuccess++
    }
  }
  console.log(`  ✅ ${commentSuccess}/${comments.length}개 댓글 생성\n`)

  // 5. 게시글별 댓글 수 업데이트
  console.log('🔄 댓글 수 업데이트 중...')
  const commentCounts: Record<number, number> = {}
  for (const c of comments) {
    const actualPostId = postIds[c.post_idx]
    if (actualPostId !== -1) {
      commentCounts[actualPostId] = (commentCounts[actualPostId] || 0) + 1
    }
  }

  for (const [postId, count] of Object.entries(commentCounts)) {
    await supabase
      .from('posts')
      .update({ comment_count: count })
      .eq('id', Number(postId))
  }
  console.log(`  ✅ ${Object.keys(commentCounts).length}개 게시글 댓글 수 업데이트 완료\n`)

  // 6. 결과 요약
  console.log('═══════════════════════════════════════')
  console.log('🎉 커뮤니티 시딩 완료!')
  console.log('═══════════════════════════════════════')

  const boardCounts: Record<string, number> = {}
  for (const p of posts) {
    boardCounts[p.board_type] = (boardCounts[p.board_type] || 0) + 1
  }
  console.log(`  👤 프로필: ${profiles.length}개`)
  for (const [board, count] of Object.entries(boardCounts)) {
    const label: Record<string, string> = {
      free: '자유게시판',
      recommend: '추천게시판',
      meme: '밈게시판',
      report: '건의게시판',
    }
    console.log(`  📋 ${label[board] || board}: ${count}개 게시글`)
  }
  console.log(`  💬 댓글: ${commentSuccess}개`)
  console.log('')
}

main().catch((err) => {
  console.error('❌ 시딩 실패:', err)
  process.exit(1)
})
