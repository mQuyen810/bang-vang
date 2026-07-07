"use client";

import { Users } from "lucide-react";
import styles from "./styles.module.scss";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "Không có dữ liệu" }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconWrapper}>
        <Users className={styles.icon} />
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
