import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SigGallery from '@/components/info/SigGallery'
import styles from './page.module.css'

export const metadata = {
  title: '시그리스트 | INOLABEL',
  description: 'INOLABEL 멤버별 시그니처 리액션 모음',
}

export default function SigPage() {
  return (
    <div className={styles.main}>
      <Navbar />

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>시그리스트</h1>
        <p className={styles.pageDesc}>이노레이블 멤버별 시그니처 리액션 모음</p>
      </header>

      <SigGallery />
      <Footer />
    </div>
  )
}
