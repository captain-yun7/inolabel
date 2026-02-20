import Link from "next/link";
import Image from "next/image";
import { Youtube, Link2, ExternalLink, Heart } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand & Description */}
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <Image
              src="/assets/logo/inolabel_logo.png"
              alt="INOLABEL"
              width={48}
              height={48}
              style={{ objectFit: "contain" }}
            />
            <span className={styles.logo}>INOLABEL</span>
          </div>
          <p className={styles.description}>
            함께하는 즐거움, 이노레이블과 함께
          </p>
        </div>

        {/* Social & External */}
        <div className={styles.social}>
          <h4 className={styles.linkTitle}>소셜</h4>
          <div className={styles.socialLinks}>
            <a
              href="https://www.sooplive.co.kr/station/pookygamja"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="김인호 방송국"
            >
              <ExternalLink size={18} />
            </a>
            <a
              href="https://www.youtube.com/@kiminho22"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="김인호 YouTube"
            >
              <Youtube size={18} />
            </a>
            <a
              href="http://link.inpock.co.kr/kiminho_official"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="김인호 링크"
            >
              <Link2 size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © {currentYear} INOLABEL. Made with <Heart size={12} className={styles.heartIcon} /> by fans, for fans.
          </span>
          <div className={styles.legal}>
            <Link href="#" className={styles.legalLink}>
              이용약관
            </Link>
            <Link href="#" className={styles.legalLink}>
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
