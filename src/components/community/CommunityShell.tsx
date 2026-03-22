'use client'

import { usePathname } from 'next/navigation'
import { PageLayout } from '@/components/layout'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TabFilter from './TabFilter'
import styles from './CommunityShell.module.css'

const tabs = [
  { label: '자유게시판', value: 'free', path: '/community/free' },
  { label: '익명게시판', value: 'anonymous', path: '/community/anonymous' },
  { label: '컨텐츠추천', value: 'recommend', path: '/community/recommend' },
  { label: '짤, 움짤', value: 'meme', path: '/community/meme' },
  { label: '신고게시판', value: 'report', path: '/community/report' },
  { label: 'VIP 라운지', value: 'vip', path: '/community/vip' },
]

const boardMeta: Record<string, { title: string; subtitle: string }> = {
  free: { title: '자유게시판', subtitle: '자유로운 이야기를 나눠보세요' },
  anonymous: { title: '익명게시판', subtitle: '익명으로 자유롭게 작성하세요' },
  recommend: { title: '컨텐츠추천', subtitle: '좋은 컨텐츠를 추천해주세요' },
  meme: { title: '짤, 움짤', subtitle: '재미있는 짤과 움짤을 공유하세요' },
  report: { title: '신고게시판', subtitle: '부적절한 활동을 신고해주세요' },
  vip: { title: 'VIP LOUNGE', subtitle: 'VIP 후원자 전용 프리미엄 커뮤니티' },
}

function getBoardFromPath(pathname: string) {
  const match = pathname.match(/\/community\/(\w+)/)
  return match?.[1] || 'free'
}

export default function CommunityShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const board = getBoardFromPath(pathname)
  const meta = boardMeta[board] || boardMeta.free

  return (
    <PageLayout>
      <div className={styles.main}>
        <Navbar />
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>{meta.title}</h1>
            <p className={styles.subtitle}>{meta.subtitle}</p>
          </div>
        </section>

        <div className={styles.container}>
          <TabFilter tabs={tabs} activeTab={board} />
          <div className={styles.content}>
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </PageLayout>
  )
}
