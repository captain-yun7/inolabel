import Link from "next/link";
import Image from "next/image";
import { Youtube, MessageCircle, ExternalLink, Heart } from "lucide-react";
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
              alt="INNO LABEL"
              width={48}
              height={48}
              style={{ objectFit: "contain" }}
            />
            <span className={styles.logo}>INNO LABEL</span>
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
              href="https://www.sooplive.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="SOOP"
            >
              <ExternalLink size={18} />
            </a>
            <a href="#" className={styles.socialLink} aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="#" className={styles.socialLink} aria-label="Discord">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © {currentYear} INNO LABEL. Made with <Heart size={12} className={styles.heartIcon} /> by fans, for fans.
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
