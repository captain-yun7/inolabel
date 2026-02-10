"use client";

import { ChevronRight } from "lucide-react";
// import styles from './SectionHeader.module.css'; // Optional: Use inline styles for simplicity or create module if needed.

export default function SectionHeader({
  title,
  link,
}: {
  title: string;
  link?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{title}</h3>
      {link && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.9rem",
            color: "#888",
            cursor: "pointer",
          }}
        >
          <span>More</span>
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
}
