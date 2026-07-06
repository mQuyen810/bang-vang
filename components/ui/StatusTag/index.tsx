"use client";

import clsx from "clsx";

import styles from "./styles.module.scss";

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "processing"
  | "default";

interface StatusTagProps {
  label: string;
  variant?: StatusVariant;
}

export default function StatusTag({
  label,
  variant = "default",
}: StatusTagProps) {
  return (
    <span className={clsx(styles.tag, styles[variant])}>
      <span className={styles.dot} />

      {label}
    </span>
  );
}
