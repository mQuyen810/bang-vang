"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.scss";

const DECOR_ITEMS = [
  { x: "10%", y: "28%", icon: "🏆", size: 30, dur: 6 },
  { x: "86%", y: "16%", icon: "🥇", size: 26, dur: 7 },
  { x: "6%", y: "72%", icon: "⭐", size: 20, dur: 5 },
  { x: "90%", y: "78%", icon: "👑", size: 22, dur: 8 },
  { x: "18%", y: "88%", icon: "✨", size: 18, dur: 4 },
  { x: "80%", y: "55%", icon: "💎", size: 22, dur: 6.5 },
];

export function FloatingDecor() {
  return (
    <div className={styles.floatingDecor}>
      {DECOR_ITEMS.map((it, i) => (
        <motion.div
          key={i}
          className={styles.floatingItem}
          style={{
            left: it.x,
            top: it.y,
            fontSize: it.size,
          }}
          animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
          transition={{
            duration: it.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          {it.icon}
        </motion.div>
      ))}
    </div>
  );
}
