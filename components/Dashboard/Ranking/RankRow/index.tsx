"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.scss";

interface RankRowProps {
  rank: number;
  emp: {
    id: string;
    name: string;
    avatar: string;
    department: string;
    output: number;
    capacity: number;
    bugsResolved?: number;
  };
  metricLabel: string;
  variant?: "default" | "bug";
}

export function RankRow({ rank, emp, metricLabel, variant = "default" }: RankRowProps) {
  const metricValue = variant === "bug" ? (emp.bugsResolved || 0) : emp.output;
  const maxValue = variant === "bug" ? 100 : emp.capacity;
  const pct = Math.min(100, Math.round((metricValue / maxValue) * 100));

  const gradientClass = variant === "bug" 
    ? styles.bugGradient 
    : styles.defaultGradient;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ x: 2 }}
      className={styles.rankRow}
    >
      <div className={styles.rankNumber}>
        {rank}
      </div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {emp.avatar}
        </div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{emp.name}</div>
          <div className={styles.userMeta}>
            {emp.department} · {emp.id}
          </div>
        </div>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.progressHeader}>
          <span>{metricLabel}</span>
          <span className={styles.progressValue}>
            {metricValue} / {maxValue}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressFill} ${gradientClass}`} 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>

      <div className={styles.metricValue}>
        {variant === "bug" ? metricValue : `${metricValue}%`}
      </div>
    </motion.div>
  );
}