"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import styles from "./styles.module.scss";
import { useAuthStore } from "@/stores/auth.store";

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
    const { user } = useAuthStore();

    const match = user?.display_name?.match(/^(.*?)\s*\((.*?)\)$/);
    const fullName = match?.[1] ?? user?.display_name;

    // Lấy tháng và năm hiện tại
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

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
                    <span>
            Bảng xếp hạng · Tháng {month}/{year}
          </span>
                </div>

                <h1 className={styles.title}>
                    Chào mừng, <span className={styles.gradientText}>{fullName}</span>
                </h1>

                <p className={styles.description}>
                    Hôm nay là một ngày tuyệt vời để ghi danh vào bảng vàng. Theo dõi
                    thành tích, năng lực và hiệu suất xử lý bug của toàn đội ngũ trong một
                    không gian được thiết kế dành riêng cho những điều xuất sắc.
                </p>
            </div>
        </motion.section>
    );
}