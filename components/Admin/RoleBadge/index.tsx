"use client";

import styles from "./styles.module.scss";

interface RoleBadgeProps {
  isAdmin: boolean;
}

export function RoleBadge({ isAdmin }: RoleBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${isAdmin ? styles.admin : styles.member}`}
    >
      {isAdmin ? "Admin" : "Member"}
    </span>
  );
}
