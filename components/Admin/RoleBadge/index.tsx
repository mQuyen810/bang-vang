"use client";

import styles from "./styles.module.scss";

interface RoleBadgeProps {
  isAdmin: boolean;
  roleName?: string | null;
}

export function RoleBadge({ isAdmin, roleName }: RoleBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${isAdmin ? styles.admin : styles.member}`}
    >
      {roleName || (isAdmin ? "Super Admin" : "Người dùng")}
    </span>
  );
}
