import type { Metadata } from "next";
import { PageLayout } from "@/components/layout";
import Navbar from "@/components/Navbar";
import { Hero, LiveMembers, CommunityPreview, YouTubeShorts, GoodsShop } from "@/components/home";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "INOLABEL - 이노레이블",
  description: "INOLABEL 공식 사이트. 스타크래프트 티어, 멤버 정보를 확인하세요.",
  openGraph: {
    title: "INOLABEL - 이노레이블",
    description: "INOLABEL 공식 사이트",
    type: "website",
  },
};

export default function Home() {
  return (
    <PageLayout showSideBanners={false}>
      <div className={styles.main}>
        <Navbar />
        <Hero />
        <div className={styles.content}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>LIVE NOW</span>
            <h2 className={styles.sectionTitle}>실시간 멤버</h2>
          </div>

          {/* Live Members - Full Width */}
          <LiveMembers />

          {/* Community Preview */}
          <CommunityPreview />

          {/* YouTube Shorts Section */}
          <div className={styles.sectionAlt}>
            <YouTubeShorts />
          </div>

          {/* Label Goods Shop */}
          <GoodsShop />
        </div>

        <Footer />
      </div>
    </PageLayout>
  );
}
