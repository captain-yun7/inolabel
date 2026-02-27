'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, Eye, MessageSquare, ThumbsUp, PenLine, ChevronDown, Trash2, CheckSquare, Square, Pin, Trophy, Flame } from 'lucide-react'
import { PageLayout } from '@/components/layout'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { InlineError } from '@/components/common/InlineError'
import { useAuthContext } from '@/lib/context'
import { getPosts, deleteMultiplePosts } from '@/lib/actions/posts'
import { formatShortDate } from '@/lib/utils/format'
import TabFilter from '@/components/community/TabFilter'
import styles from './page.module.css'

interface Post {
  id: number
  title: string
  authorName: string
  authorRealName?: string
  isAnonymous: boolean
  viewCount: number
  commentCount: number
  likeCount: number
  createdAt: string
  category?: string
  headerTag?: string | null
}

interface BestPost {
  id: number
  title: string
  likeCount: number
  authorName: string
}

interface PinnedNotice {
  id: number
  title: string
  createdAt: string
}

type BoardType = 'free' | 'anonymous' | 'meme' | 'recommend' | 'report'

interface BoardConfig {
  boardType: BoardType
  activeTab: string
  heroTitle: string
  heroSubtitle: string
  categoryLabel: string
  searchTypes: ('all' | 'title' | 'author')[]
  showPopularBadge: boolean
}

export interface BoardClientProps {
  config: BoardConfig
  initialPosts: Post[]
  initialCount: number
  initialWeeklyBest?: BestPost[]
  initialMonthlyBest?: BestPost[]
  initialNotices?: PinnedNotice[]
}

function isNew(dateStr: string): boolean {
  const postDate = new Date(dateStr)
  const now = new Date()
  const diffDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 1
}

function isHot(viewCount: number, commentCount: number, likeCount: number): boolean {
  return viewCount >= 100 || commentCount >= 10 || likeCount >= 20
}

function isPopular(likeCount: number): boolean {
  return likeCount >= 50
}

const POSTS_PER_PAGE = 20

export default function BoardClient({
  config,
  initialPosts,
  initialCount,
  initialWeeklyBest = [],
  initialMonthlyBest = [],
  initialNotices = [],
}: BoardClientProps) {
  const { boardType, activeTab, heroTitle, heroSubtitle, categoryLabel, searchTypes, showPopularBadge } = config
  const { profile } = useAuthContext()
  const isAdmin = profile && ['admin', 'superadmin', 'moderator'].includes(profile.role)

  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'title' | 'author'>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes'>('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(initialCount)

  const [weeklyBest] = useState<BestPost[]>(initialWeeklyBest)
  const [monthlyBest] = useState<BestPost[]>(initialMonthlyBest)
  const [pinnedNotices] = useState<PinnedNotice[]>(initialNotices)

  // 복수 선택 삭제 관련 상태
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSelectMode, setIsSelectMode] = useState(false)

  const tabs = [
    { label: '자유게시판', value: 'free', path: '/community/free' },
    { label: '익명게시판', value: 'anonymous', path: '/community/anonymous' },
    { label: '컨텐츠추천', value: 'recommend', path: '/community/recommend' },
    { label: '짤, 움짤', value: 'meme', path: '/community/meme' },
    { label: '신고게시판', value: 'report', path: '/community/report' },
  ]

  // 검색어 디바운스 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await getPosts({
      boardType,
      page: currentPage,
      limit: POSTS_PER_PAGE,
      searchQuery: debouncedSearch,
      searchType
    })

    if (result.error) {
      setError('게시글을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.')
      setIsLoading(false)
      return
    }

    if (result.data) {
      setPosts(
        result.data.data.map((p) => {
          const isAnon = p.is_anonymous || false
          const realNickname = p.author_nickname || '알 수 없음'
          return {
            id: p.id,
            title: p.title,
            authorName: isAnon ? '익명' : realNickname,
            authorRealName: isAnon ? realNickname : undefined,
            isAnonymous: isAnon,
            viewCount: p.view_count || 0,
            commentCount: p.comment_count || 0,
            likeCount: p.like_count || 0,
            createdAt: p.created_at,
            category: categoryLabel,
            headerTag: p.header_tag || null,
          }
        })
      )
      setTotalCount(result.data.count)
    }

    setIsLoading(false)
  }, [currentPage, debouncedSearch, searchType, boardType, categoryLabel])

  // 검색/페이지 변경 시에만 fetch (초기 로드는 서버에서 이미 처리)
  const [isInitialRender, setIsInitialRender] = useState(true)
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }
    fetchPosts()
  }, [fetchPosts]) // eslint-disable-line react-hooks/exhaustive-deps

  // 클라이언트 측 정렬
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.viewCount - a.viewCount
      case 'likes':
        return b.likeCount - a.likeCount
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedPosts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sortedPosts.map(p => p.id)))
    }
  }

  const toggleSelectMode = () => {
    setIsSelectMode(prev => !prev)
    setSelectedIds(new Set())
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return

    const confirmMsg = `선택한 ${selectedIds.size}개의 게시글을 삭제하시겠습니까?`
    if (!confirm(confirmMsg)) return

    setIsDeleting(true)
    const result = await deleteMultiplePosts(Array.from(selectedIds))

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      const { deleted, failed } = result.data
      if (failed > 0) {
        alert(`${deleted}개 삭제 완료, ${failed}개 삭제 실패 (권한 없음)`)
      } else {
        alert(`${deleted}개 게시글이 삭제되었습니다.`)
      }
      setSelectedIds(new Set())
      setIsSelectMode(false)
      fetchPosts()
    }

    setIsDeleting(false)
  }

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <PageLayout>
      <div className={styles.main}>
        <Navbar />
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{heroTitle}</h1>
            <p className={styles.subtitle}>{heroSubtitle}</p>
          </div>
        </section>

      <div className={styles.container}>
        <TabFilter tabs={tabs} activeTab={activeTab} />

        {(weeklyBest.length > 0 || monthlyBest.length > 0 || pinnedNotices.length > 0) && (
          <div className={styles.bestSection}>
            {(weeklyBest.length > 0 || monthlyBest.length > 0) && (
              <div className={styles.bestColumns}>
                {weeklyBest.length > 0 && (
                  <div className={styles.bestColumn}>
                    <div className={styles.bestHeader}>
                      <Flame size={14} />
                      <span>주간 BEST</span>
                    </div>
                    <ul className={styles.bestList}>
                      {weeklyBest.map((post, i) => (
                        <li key={post.id}>
                          <Link href={`/community/${boardType}/${post.id}`} className={styles.bestItem}>
                            <span className={styles.bestRank}>{i + 1}</span>
                            <span className={styles.bestTitle}>{post.title}</span>
                            <span className={styles.bestLikes}>
                              <ThumbsUp size={10} />
                              {post.likeCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {monthlyBest.length > 0 && (
                  <div className={styles.bestColumn}>
                    <div className={styles.bestHeader}>
                      <Trophy size={14} />
                      <span>월간 BEST</span>
                    </div>
                    <ul className={styles.bestList}>
                      {monthlyBest.map((post, i) => (
                        <li key={post.id}>
                          <Link href={`/community/${boardType}/${post.id}`} className={styles.bestItem}>
                            <span className={styles.bestRank}>{i + 1}</span>
                            <span className={styles.bestTitle}>{post.title}</span>
                            <span className={styles.bestLikes}>
                              <ThumbsUp size={10} />
                              {post.likeCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {pinnedNotices.length > 0 && (
              <div className={styles.pinnedNotices}>
                {pinnedNotices.map(notice => (
                  <Link
                    key={notice.id}
                    href={`/notices/${notice.id}`}
                    className={styles.pinnedRow}
                  >
                    <Pin size={12} className={styles.pinnedIcon} />
                    <span className={styles.pinnedBadge}>공지</span>
                    <span className={styles.pinnedTitle}>{notice.title}</span>
                    <span className={styles.pinnedDate}>{formatShortDate(notice.createdAt)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.boardHeader}>
          <div className={styles.boardLeft}>
            <span className={styles.totalCount}>
              전체 <strong>{totalCount}</strong>건
            </span>
            {isAdmin && (
              <button
                onClick={toggleSelectMode}
                className={`${styles.selectModeBtn} ${isSelectMode ? styles.active : ''}`}
              >
                <CheckSquare size={14} />
                {isSelectMode ? '선택 취소' : '선택'}
              </button>
            )}
            {isSelectMode && selectedIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className={styles.deleteSelectedBtn}
              >
                <Trash2 size={14} />
                {isDeleting ? '삭제 중...' : `${selectedIds.size}개 삭제`}
              </button>
            )}
            <div className={styles.sortSelect}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'views' | 'likes')}
                className={styles.select}
              >
                <option value="latest">최신순</option>
                <option value="views">조회순</option>
                <option value="likes">추천순</option>
              </select>
              <ChevronDown size={14} className={styles.selectIcon} />
            </div>
          </div>

          <div className={styles.searchArea}>
            <div className={styles.searchTypeSelect}>
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as 'all' | 'title' | 'author')
                  setCurrentPage(1)
                }}
                className={styles.select}
              >
                {searchTypes.includes('all') && <option value="all">전체</option>}
                {searchTypes.includes('title') && <option value="title">제목</option>}
                {searchTypes.includes('author') && <option value="author">작성자</option>}
              </select>
              <ChevronDown size={14} className={styles.selectIcon} />
            </div>
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setDebouncedSearch(searchQuery)
                    setCurrentPage(1)
                  }
                }}
              />
              <button
                className={styles.searchBtn}
                onClick={() => {
                  setDebouncedSearch(searchQuery)
                  setCurrentPage(1)
                }}
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <InlineError message={error} onRetry={fetchPosts} />
        ) : isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>게시글을 불러오는 중...</span>
          </div>
        ) : sortedPosts.length === 0 ? (
          <>
            <div className={styles.empty}>
              <p>등록된 게시글이 없습니다</p>
            </div>
            <div className={styles.boardFooter}>
              <div />
              <Link href={`/community/write?board=${boardType}`} className={styles.writeBtn}>
                <PenLine size={16} />
                글쓰기
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.board} ${isSelectMode ? styles.selectMode : ''}`}>
              <div className={styles.tableHeader}>
                {isSelectMode && (
                  <span className={styles.colCheck}>
                    <button
                      onClick={toggleSelectAll}
                      className={styles.checkBtn}
                      title={selectedIds.size === sortedPosts.length ? '전체 해제' : '전체 선택'}
                    >
                      {selectedIds.size === sortedPosts.length ? (
                        <CheckSquare size={16} className={styles.checkedIcon} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </span>
                )}
                <span className={styles.colNumber}>번호</span>
                <span className={styles.colCategory}>분류</span>
                <span className={styles.colTitle}>제목</span>
                <span className={styles.colAuthor}>글쓴이</span>
                <span className={styles.colDate}>작성일</span>
                <span className={styles.colViews}>조회</span>
                <span className={styles.colLikes}>추천</span>
              </div>

              <div className={styles.tableBody}>
                {sortedPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/community/${boardType}/${post.id}`}
                    className={`${styles.row} ${showPopularBadge && isPopular(post.likeCount) ? styles.popular : ''} ${selectedIds.has(post.id) ? styles.selected : ''}`}
                  >
                    {isSelectMode && (
                      <div className={styles.cellCheck} onClick={(e) => toggleSelect(post.id, e)}>
                        {selectedIds.has(post.id) ? (
                          <CheckSquare size={16} className={styles.checkedIcon} />
                        ) : (
                          <Square size={16} />
                        )}
                      </div>
                    )}
                    <div className={styles.cellNumber}>
                      {sortedPosts.length - index}
                    </div>
                    <div className={styles.cellCategory}>
                      <span className={styles.categoryBadge}>{post.category || categoryLabel}</span>
                    </div>
                    <div className={styles.cellTitle}>
                      <h3 className={styles.postTitle}>
                        {post.headerTag && (
                          <span className={styles.headerTagBadge}>[{post.headerTag}]</span>
                        )}
                        {post.title}
                      </h3>
                      <div className={styles.titleMeta}>
                        {post.commentCount > 0 && (
                          <span className={styles.commentCount}>
                            <MessageSquare size={12} />
                            {post.commentCount}
                          </span>
                        )}
                        {isNew(post.createdAt) && (
                          <span className={styles.newBadge}>N</span>
                        )}
                        {isHot(post.viewCount, post.commentCount, post.likeCount) && (
                          <span className={styles.hotBadge}>HOT</span>
                        )}
                        {showPopularBadge && isPopular(post.likeCount) && (
                          <span className={styles.popularBadge}>인기</span>
                        )}
                      </div>
                    </div>
                    <span className={styles.cellAuthor}>
                      {post.authorName}
                      {isAdmin && post.isAnonymous && post.authorRealName && (
                        <span className={styles.adminRealName}>({post.authorRealName})</span>
                      )}
                    </span>
                    <span className={styles.cellDate}>
                      {formatShortDate(post.createdAt)}
                    </span>
                    <span className={styles.cellViews}>
                      {post.viewCount.toLocaleString()}
                    </span>
                    <span className={styles.cellLikes}>
                      {post.likeCount > 0 ? post.likeCount : '-'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.mobileList}>
              {sortedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${boardType}/${post.id}`}
                  className={styles.mobileCard}
                >
                  <div className={styles.mobileHeader}>
                    <span className={styles.mobileCategoryBadge}>{post.category || categoryLabel}</span>
                    {isNew(post.createdAt) && <span className={styles.newBadge}>N</span>}
                    {isHot(post.viewCount, post.commentCount, post.likeCount) && <span className={styles.hotBadge}>HOT</span>}
                  </div>
                  <h3 className={styles.mobileTitle}>
                    {post.headerTag && (
                      <span className={styles.headerTagBadge}>[{post.headerTag}]</span>
                    )}
                    {post.title}
                    {post.commentCount > 0 && (
                      <span className={styles.mobileCommentCount}>[{post.commentCount}]</span>
                    )}
                  </h3>
                  <div className={styles.mobileMeta}>
                    <span className={styles.mobileAuthor}>
                      {post.authorName}
                      {isAdmin && post.isAnonymous && post.authorRealName && (
                        <span className={styles.adminRealName}>({post.authorRealName})</span>
                      )}
                    </span>
                    <span className={styles.mobileDivider}>·</span>
                    <span>{formatShortDate(post.createdAt)}</span>
                    <span className={styles.mobileDivider}>·</span>
                    <span className={styles.mobileStats}>
                      <Eye size={12} /> {post.viewCount}
                    </span>
                    <span className={styles.mobileStats}>
                      <ThumbsUp size={12} /> {post.likeCount}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.boardFooter}>
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  «
                </button>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  ‹
                </button>
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  ›
                </button>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  »
                </button>
              </div>
              <Link href={`/community/write?board=${boardType}`} className={styles.writeBtn}>
                <PenLine size={16} />
                글쓰기
              </Link>
            </div>
          </>
        )}
        </div>
        <Footer />
      </div>
    </PageLayout>
  )
}
