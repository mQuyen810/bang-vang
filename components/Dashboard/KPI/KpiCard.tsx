"use client";

import { motion } from "framer-motion";
import { TrendingUp, LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import styles from "./styles.module.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      delay: i * 0.08, 
      ease: [0.22, 1, 0.36, 1]  as const
    } 
  }),
};

interface KPICardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  color: string;
  index: number;
}

export function KPICard({ label, value, icon: Icon, trend, color, index }: KPICardProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className={styles.card}
    >
      <div className={`${styles.glow} ${color}`} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <div className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </div>
        </div>
        
        <div className={styles.value}>
          <AnimatedCounter value={value} />
        </div>
        
        <div className={styles.trend}>
          <TrendingUp className={styles.trendIcon} />
          {trend}
        </div>
      </div>
    </motion.div>
  );
}