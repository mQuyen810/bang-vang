"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { RankingBug, RankingProductivity } from "@/types/rankingItem";

interface RankRowProps {
  rank: number;
  emp: RankingBug | RankingProductivity;
  metricLabel: string;
  variant?: "default" | "bug";
}

export function RankRow({
  rank,
  emp,
  metricLabel,
  variant = "default",
}: RankRowProps) {
  let metricVal = 0;
  let current = 0;
  let capacity = 100;

  if (variant === "bug") {
    const bug = emp as RankingBug;

    metricVal = bug.bugPercent;
    current = bug.bugCount;
    capacity = bug.subtaskCount;
  } else {
    const productivity = emp as RankingProductivity;

    metricVal = productivity.ratio;
    current = productivity.slsx;
    capacity = productivity.ulnl;
  }

  const pct =
    variant === "bug" ? metricVal : Math.min(100, (current / capacity) * 100);

  const gradientClass =
    variant === "bug" ? styles.bugGradient : styles.defaultGradient;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ x: 2 }}
      className={styles.rankRow}
    >
      <div className={styles.rankNumber}>{rank}</div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>{emp.avatar}</div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{emp.name}</div>
          {/* <div className={styles.userMeta}>{emp.department}</div> */}
        </div>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.progressHeader}>
          <span>{metricLabel}</span>
          <span className={styles.progressValue}>{metricVal} / 100</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${gradientClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={styles.metricValue}>
        {variant === "bug" ? current : `${metricVal.toFixed(2)}%`}
      </div>
    </motion.div>
  );
}
