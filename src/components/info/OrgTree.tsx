"use client";

import { motion } from "framer-motion";
import styles from "./OrgTree.module.css";

interface Member {
  name: string;
  role: string;
  image?: string;
  sub?: Member[];
}

interface OrgTreeProps {
  data: Member;
}

export default function OrgTree({ data }: OrgTreeProps) {
  return (
    <div className={styles.tree}>
      <Node member={data} level={0} />
    </div>
  );
}

function Node({ member, level }: { member: Member; level: number }) {
  const isRoot = level === 0;

  return (
    <div className={styles.nodeWrapper}>
      <motion.div
        className={`${styles.card} ${isRoot ? styles.rootCard : ""}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={styles.avatar}>
          {/* Placeholder for now or specific image */}
          <div className={styles.placeholderImg} />
        </div>
        <div className={styles.info}>
          <span className={styles.role}>{member.role}</span>
          <strong className={styles.name}>{member.name}</strong>
        </div>
      </motion.div>

      {member.sub && member.sub.length > 0 && (
        <>
          <div className={styles.line} />
          <div
            className={styles.children}
            style={{ gridTemplateColumns: `repeat(${member.sub.length}, 1fr)` }}
          >
            {member.sub.map((child, idx) => (
              <div key={idx} className={styles.childContainer}>
                <Node member={child} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
