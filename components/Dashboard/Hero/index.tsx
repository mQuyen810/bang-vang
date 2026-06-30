"use client";

import { motion } from "framer-motion";
import { Sparkles, Crown } from "lucide-react";
import { currentUser, productivityRanking } from "@/lib/mock-data";
import styles from "./styles.module.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className={styles.hero}
    >
      <div className={styles.auroraBg} />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <Sparkles className={styles.badgeIcon} />
          <span>Bảng xếp hạng · Q2 2026</span>
        </div>

        <h1 className={styles.title}>
          Chào mừng,{" "}
          <span className={styles.gradientText}>{currentUser.name}</span>
        </h1>

        <p className={styles.description}>
          Hôm nay là một ngày tuyệt vời để ghi danh vào bảng vàng. Theo dõi
          thành tích, năng lực và hiệu suất xử lý bug của toàn đội ngũ trong một
          không gian được thiết kế dành riêng cho những điều xuất sắc.
        </p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.statusDot} /> Synced với Jira · 2 phút trước
          </span>
          <span className={styles.metaItem}>
            <Crown className={styles.crownIcon} /> Top 1:{" "}
            {productivityRanking[0]?.name}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
