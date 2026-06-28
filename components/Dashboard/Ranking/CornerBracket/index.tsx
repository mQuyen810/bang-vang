"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.scss";

interface CornerBracketProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "glow" | "gradient";
  className?: string;
  animated?: boolean;
}

export function CornerBracket({ 
  color = "#F6C453",
  size = "md",
  variant = "default",
  className = "",
  animated = true,
}: CornerBracketProps) {
  // Kích thước
  const sizeMap = {
    sm: { width: 16, height: 16, lineLength: 12 },
    md: { width: 24, height: 24, lineLength: 18 },
    lg: { width: 32, height: 32, lineLength: 24 },
  };
  
  const { width, height, lineLength } = sizeMap[size];
  
  // Variant styles
  const variantStyles = {
    default: {
      lineColor: color,
      opacity: 0.6,
      glow: "none",
    },
    glow: {
      lineColor: color,
      opacity: 0.8,
      glow: `0 0 12px ${color}40, 0 0 24px ${color}20`,
    },
    gradient: {
      lineColor: `linear-gradient(135deg, ${color}, ${color}88)`,
      opacity: 0.9,
      glow: `0 0 16px ${color}30`,
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.div
      className={`${styles.cornerBracket} ${className}`}
      style={{
        width,
        height,
        '--line-color': style.lineColor,
        '--line-opacity': style.opacity,
        '--line-glow': style.glow,
      } as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Đường kẻ ngang */}
      <motion.span
        className={`${styles.line} ${styles.horizontal}`}
        style={{
          width: lineLength,
          height: 2,
          background: style.lineColor,
          opacity: style.opacity,
          boxShadow: style.glow,
        }}
        initial={{ width: 0 }}
        animate={{ width: lineLength }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      
      {/* Đường kẻ dọc */}
      <motion.span
        className={`${styles.line} ${styles.vertical}`}
        style={{
          height: lineLength,
          width: 2,
          background: style.lineColor,
          opacity: style.opacity,
          boxShadow: style.glow,
        }}
        initial={{ height: 0 }}
        animate={{ height: lineLength }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Chấm tròn ở góc */}
      <motion.span
        className={styles.dot}
        style={{
          background: color,
          boxShadow: `0 0 12px ${color}60, 0 0 24px ${color}30`,
          width: size === "sm" ? 3 : size === "md" ? 4 : 5,
          height: size === "sm" ? 3 : size === "md" ? 4 : 5,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />

      {/* Hiệu ứng pulse cho glow variant */}
      {variant === "glow" && animated && (
        <motion.span
          className={styles.pulseRing}
          style={{
            borderColor: color,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Gradient sparkle */}
      {variant === "gradient" && animated && (
        <motion.span
          className={styles.sparkle}
          style={{
            background: `radial-gradient(circle, ${color}, transparent)`,
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}