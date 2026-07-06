import type { LucideIcon } from "lucide-react";

import styles from "./styles.module.scss";

export interface TabItem<T extends string> {
  key: T;
  label: string;
  count: number;
  icon: LucideIcon;
}

interface IssueTabsProps<T extends string> {
  activeTab: T;
  tabs: readonly TabItem<T>[];
  onChange: (tab: T) => void;
}

export function IssueTabs<T extends string>({
  activeTab,
  tabs,
  onChange,
}: IssueTabsProps<T>) {
  return (
    <div className={styles.tabGroup}>
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`${styles.tabButton} ${
              activeTab === tab.key ? styles.tabActive : ""
            }`}
          >
            <Icon size={16} />
            {tab.label}
            {/* <span className={styles.tabCount}>{tab.count}</span> */}
          </button>
        );
      })}
    </div>
  );
}
