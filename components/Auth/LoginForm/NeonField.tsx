"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.scss";

interface NeonFieldProps {
  focused: boolean;
  children: React.ReactNode;
}

export function NeonField({ focused, children }: NeonFieldProps) {
  return (
    <div className={styles.neonField}>
      <motion.div
        className={styles.neonFieldGlow}
        style={{
          backgroundImage: focused
            ? "linear-gradient(90deg, #4FC3F7, #8B5CF6, #4FC3F7)"
            : "linear-gradient(90deg, rgba(79,195,247,0.25), rgba(139,92,246,0.25))",
          backgroundSize: "200% 100%",
          backgroundRepeat: "no-repeat",
          filter: focused ? "blur(3px)" : "blur(1px)",
          opacity: focused ? 0.9 : 0.5,
        }}
        animate={focused ? { backgroundPosition: ["0% 0%", "200% 0%"] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div
        className={styles.neonFieldInner}
        style={{
          borderColor: focused
            ? "rgba(79,195,247,0.7)"
            : "rgba(154,216,255,0.2)",
          boxShadow: focused
            ? "0 0 25px rgba(79,195,247,0.45), inset 0 0 20px rgba(139,92,246,0.15)"
            : "inset 0 0 12px rgba(0,0,0,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
