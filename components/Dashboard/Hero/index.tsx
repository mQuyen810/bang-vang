"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plane, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import styles from "./styles.module.scss";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.2,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const HERO_OUT_DELAY = 19.5; // ~20s: bắt đầu kéo biến mất
const FLY_DURATION = 20; // máy bay kéo hero ~20s

export function Hero() {
  const { user } = useAuthStore();

  const match = user?.display_name?.match(/^(.*?)\s*\((.*?)\)$/);
  const fullName = match?.[1] ?? user?.display_name;

  const { period } = useDashboardStore();

  const [mm, yyyy] = (period ?? "").split("-");
  const month = mm ? Number(mm) : 1;
  const year = yyyy ? Number(yyyy) : new Date().getFullYear();

  const [gone, setGone] = useState(false);

  // Đảm bảo animation chạy 1 lần sau mount
  useEffect(() => {
    const t = window.setTimeout(
      () => {
        setGone(true);
      },
      (FLY_DURATION + 0.05) * 1000,
    );

    return () => window.clearTimeout(t);
  }, []);

  // Xoay nhẹ máy bay theo hướng kéo
  const animateFlyX = useMemo(
    () => ({
      x: "120vw",
    }),
    [],
  );

  return (
    <section className={styles.heroWrapper}>
      {/* Máy bay + kéo hero (timeline ~20s) */}
      <motion.div
        className={styles.flyBanner}
        initial={{ x: "-140vw" }}
        animate={animateFlyX}
        transition={{
          duration: FLY_DURATION,
          ease: "linear",
        }}
      >
        <motion.div
          className={styles.banner}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          🏆 Bảng vàng tháng {month}/{year}
        </motion.div>
      </motion.div>

      {/* Hero */}
      <AnimatePresence>
        {!gone && (
          <motion.section
            className={styles.hero}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit={{
              opacity: 0,
              y: -24,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
            }}
            style={{ willChange: "transform, opacity" }}
            // Bắt đầu kéo biến mất sát thời điểm ~20s
            transition={{
              delay: HERO_OUT_DELAY,
              duration: 0.01,
            }}
          >
            <div className={styles.auroraBg} />
            <div className={styles.overlay} />

            <div className={styles.content}>
              <div className={styles.badge}>
                <Sparkles className={styles.badgeIcon} />

                <span>
                  Bảng xếp hạng · Tháng {month}/{year}
                </span>
              </div>

              <h1 className={styles.title}>
                Chào mừng,{" "}
                <span className={styles.gradientText}>{fullName}</span>
              </h1>

              <p className={styles.description}>
                Hôm nay là một ngày tuyệt vời để ghi danh vào bảng vàng. Theo
                dõi thành tích, năng lực và hiệu suất xử lý bug của toàn đội ngũ
                trong một không gian được thiết kế dành riêng cho những điều
                xuất sắc.
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}
