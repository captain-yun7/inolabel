"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "./TabFilter.module.css";

interface Tab {
  label: string;
  value: string;
  path?: string; // Optional direct path
}

interface TabFilterProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export default function TabFilter({
  tabs,
  activeTab,
  onTabChange,
}: TabFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (tab: Tab) => {
    if (tab.path) {
      router.push(tab.path);
    } else if (onTabChange) {
      onTabChange(tab.value);
    }
  };

  return (
    <div className={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.value || (tab.path && pathname === tab.path);
        return (
          <button
            key={tab.value}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
