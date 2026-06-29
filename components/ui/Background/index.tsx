"use client";

import { motion } from "framer-motion";
import styles from "./styles.module.scss";

/**
 * Animated cyber hall-of-fame background.
 * Hexagon grid, light beams, trophy hologram, floating particles.
 */
export function Background() {
  // Use deterministic values instead of Math.random()
  const particles = Array.from({ length: 40 }, (_, i) => ({
    left: (i * 37 + 13) % 100, // Deterministic positions 0-99
    delay: ((i * 19 + 7) % 60) / 10, // 0-5.9 seconds
    dur: 8 + ((i * 13 + 5) % 30) / 3, // 8-17.9 seconds
    size: 2 + ((i * 7 + 3) % 30) / 10, // 2-4.9px
    purple: i % 3 === 0,
  }));

  const goldParticles = Array.from({ length: 18 }, (_, i) => ({
    left: 30 + ((i * 43 + 11) % 40), // 30-69%
    delay: ((i * 17 + 9) % 50) / 10, // 0-4.9 seconds
    dur: 6 + ((i * 11 + 3) % 60) / 10, // 6-11.9 seconds
    xOffset: ((i * 29 + 7) % 100) / 100 - 0.5, // -0.5 to 0.49
  }));

  const badges = Array.from({ length: 6 }, (_, i) => ({
    position: [
      { left: "8%", top: "15%" },
      { left: "85%", top: "22%" },
      { left: "12%", top: "70%" },
      { left: "78%", top: "65%" },
      { left: "22%", top: "45%" },
      { left: "70%", top: "40%" },
    ][i],
  }));

  return (
    <div className={styles.background}>
      {/* Base gradient */}
      <div className={styles.gradient} />

      {/* Hexagon grid */}
      <svg className={styles.hexGrid} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hex"
            width="56"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0 0)"
          >
            <path
              d="M14 0 L42 0 L56 24 L42 48 L14 48 L0 24 Z"
              fill="none"
              stroke="#4FC3F7"
              strokeWidth="0.6"
            />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="m">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" mask="url(#m)" />
      </svg>

      {/* Light beams */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`beam-${i}`}
          className={styles.lightBeam}
          style={{ left: `${20 + i * 25}%` }}
          animate={{ opacity: [0.4, 0.9, 0.4], x: [0, 30, 0] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Holographic trophy + podium */}
      <div className={styles.trophyContainer}>
        <motion.svg
          width="520"
          height="520"
          viewBox="0 0 520 520"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE89A" />
              <stop offset="50%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <radialGradient id="goldGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFD54F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="260" cy="220" r="200" fill="url(#goldGlow)" />
          {/* trophy */}
          <g transform="translate(180 110)" opacity="0.85">
            <path
              d="M30 20 H130 V70 C130 110 100 130 80 130 C60 130 30 110 30 70 Z"
              fill="url(#gold)"
              stroke="#FFD54F"
            />
            <path
              d="M30 30 C0 30 0 70 30 70"
              fill="none"
              stroke="#FFD54F"
              strokeWidth="6"
            />
            <path
              d="M130 30 C160 30 160 70 130 70"
              fill="none"
              stroke="#FFD54F"
              strokeWidth="6"
            />
            <rect x="70" y="130" width="20" height="30" fill="url(#gold)" />
            <rect
              x="50"
              y="160"
              width="60"
              height="14"
              rx="3"
              fill="url(#gold)"
            />
            <text
              x="80"
              y="95"
              textAnchor="middle"
              fontSize="48"
              fontWeight="900"
              fill="#7a4b00"
            >
              1
            </text>
          </g>
          {/* podium */}
          <g transform="translate(140 320)" opacity="0.5">
            <rect
              x="0"
              y="40"
              width="80"
              height="80"
              fill="#1b2a55"
              stroke="#4FC3F7"
            />
            <rect
              x="80"
              y="0"
              width="80"
              height="120"
              fill="#2a1a55"
              stroke="#8B5CF6"
            />
            <rect
              x="160"
              y="60"
              width="80"
              height="60"
              fill="#1b2a55"
              stroke="#4FC3F7"
            />
          </g>
        </motion.svg>
      </div>

      {/* Floating hologram panels */}
      {badges.map((badge, i) => (
        <motion.div
          key={`badge-${i}`}
          className={styles.hologramPanel}
          style={{
            left: badge.position.left,
            top: badge.position.top,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <div className={styles.hologramLine1} />
          <div className={styles.hologramLine2} />
          <div className={styles.hologramLine3} />
        </motion.div>
      ))}

      {/* Cyan / purple particles */}
      {particles.map((p) => (
        <motion.span
          key={`p-${p.left}-${p.size}`}
          className={`${styles.particle} ${p.purple ? styles.particlePurple : styles.particleCyan}`}
          style={{
            left: `${p.left}%`,
            bottom: -10,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: ["0%", "-110vh"], opacity: [0, 1, 0] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Gold particles */}
      {goldParticles.map((p) => (
        <motion.span
          key={`g-${p.left}-${p.delay}`}
          className={styles.goldParticle}
          style={{
            left: `${p.left}%`,
            top: "55%",
          }}
          animate={{
            y: [0, -180],
            x: [0, p.xOffset * 80],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Moving glowing line */}
      <motion.div
        className={styles.glowLine}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
