"use client";

import { useMemo } from "react";
import styles from "./styles.module.scss";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
}

export function Avatar({ name, size = "md", src }: AvatarProps) {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);

  const bgColor = useMemo(() => {
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#3b82f6",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [name]);

  const sizeClass = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  }[size];

  if (src) {
    return (
      <img src={src} alt={name} className={`${styles.avatar} ${sizeClass}`} />
    );
  }

  return (
    <div
      className={`${styles.avatar} ${sizeClass}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
