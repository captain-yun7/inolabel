import type { Metadata } from 'next'
import { PageLayout } from '@/components/layout'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getTiersWithMembers } from '@/lib/actions/starcraft-tier'
import TierBoard from '@/components/starcraft/TierBoard'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '스타크래프트 티어표 | INNO LABEL',
  description: '이노레이블 스타크래프트 티어 랭킹',
}

export default async function StarcraftTierPage() {
  const { data: tiers, error } = await getTiersWithMembers()

  return (
    <PageLayout>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>스타크래프트 티어표</h1>
            <p className={styles.subtitle}>INNO LABEL 스타크래프트 실력 랭킹</p>
            <p className={styles.tierOrder}>갓 &gt; 킹 &gt; 잭 &gt; 스페이드 &gt; 0 ~ 8 &gt; 유스</p>
          </div>

          <div className={styles.content}>
            {error ? (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            ) : (
              <TierBoard tiers={tiers || []} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageLayout>
  )
}
