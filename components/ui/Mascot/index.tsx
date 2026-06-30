"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import styles from "./styles.module.scss";

type Mode = "idle" | "username" | "password" | "surprised";

interface MascotProps {
  mode: Mode;
  eyeTarget: { x: number; y: number };
}

export function Mascot({ mode, eyeTarget }: MascotProps) {
  const leftHandControls = useAnimation();
  const rightHandControls = useAnimation();
  const eyeLidsControls = useAnimation();

  const px = Math.max(-1, Math.min(1, eyeTarget.x)) * 2.6;
  const py = Math.max(-1, Math.min(1, eyeTarget.y)) * 2.2;

  useEffect(() => {
    if (mode === "password") {
      leftHandControls.start({
        x: 20,
        y: -60,
        rotate: 0,
        transition: { type: "spring", stiffness: 200, damping: 18 },
      });
      rightHandControls.start({
        x: -20,
        y: -60,
        rotate: 0,
        transition: { type: "spring", stiffness: 200, damping: 18 },
      });
    } else {
      leftHandControls.start({
        x: -10,
        y: 70,
        rotate: 0,
        transition: { type: "spring", stiffness: 180, damping: 22 },
      });
      rightHandControls.start({
        x: 0,
        y: 70,
        rotate: 0,
        transition: { type: "spring", stiffness: 180, damping: 22 },
      });
    }
  }, [mode, leftHandControls, rightHandControls]);

  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 2400 + Math.random() * 2200));
        if (cancelled) return;
        await eyeLidsControls.start({
          scaleY: 1,
          transition: { duration: 0.08 },
        });
        await eyeLidsControls.start({
          scaleY: 0,
          transition: { duration: 0.12 },
        });
      }
    };
    loop();
    return () => {
      cancelled = true;
    };
  }, [eyeLidsControls]);

  const headTilt = eyeTarget.x * 4;

  return (
    <motion.div
      className={styles.mascotContainer}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 320 280"
        width="320"
        height="280"
        className={styles.svg}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="bgGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#9ad8ff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#4FC3F7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe6cf" />
            <stop offset="100%" stopColor="#f1b48d" />
          </linearGradient>
          <linearGradient id="skinDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1b48d" />
            <stop offset="100%" stopColor="#d4926b" />
          </linearGradient>
          <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1140" />
            <stop offset="60%" stopColor="#3a1f78" />
            <stop offset="100%" stopColor="#6b3fc9" />
          </linearGradient>
          <linearGradient id="hairShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#c4a8ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="jacket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0e1a44" />
            <stop offset="60%" stopColor="#1d1a55" />
            <stop offset="100%" stopColor="#3a1e6e" />
          </linearGradient>
          <linearGradient id="jacketTrim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4FC3F7" />
            <stop offset="50%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="iris" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fe1ff" />
            <stop offset="60%" stopColor="#2a7fd6" />
            <stop offset="100%" stopColor="#16225a" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="160" cy="150" rx="150" ry="70" fill="url(#bgGlow)" />

        {/* ===== BODY ===== */}
        <g>
          {/* Body / Shoulders */}
          <path
            d="M30 260 C55 195 110 175 160 175 C210 175 265 195 290 260 Z"
            fill="url(#jacket)"
            stroke="#4FC3F7"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />
          {/* Lapel + Trim */}
          <path
            d="M120 195 L160 215 L200 195 L195 250 L125 250 Z"
            fill="#11163a"
            opacity="0.7"
          />
          <path
            d="M120 195 L160 215 L200 195"
            stroke="url(#jacketTrim)"
            strokeWidth="2"
            fill="none"
          />
          {/* Tie */}
          <path
            d="M155 215 L165 215 L168 240 L160 250 L152 240 Z"
            fill="#FFD54F"
            stroke="#b8860b"
            strokeWidth="0.8"
          />
          {/* Shoulder Pins */}
          <circle
            cx="78"
            cy="210"
            r="3"
            fill="#FFD54F"
            filter="url(#softGlow)"
          />
          <circle
            cx="242"
            cy="210"
            r="3"
            fill="#4FC3F7"
            filter="url(#softGlow)"
          />
        </g>

        {/* ===== HEAD ===== */}
        <motion.g
          animate={{ rotate: headTilt }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
          style={{ originX: "160px", originY: "190px" }}
        >
          {/* Neck */}
          <path
            d="M146 150 L174 150 L178 178 L142 178 Z"
            fill="url(#skinDark)"
          />

          <motion.g
            animate={{ y: [0, -1.4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Hair Back */}
            <path
              d="M96 110 C92 55 130 38 160 38 C190 38 228 55 224 112 C220 95 210 88 200 88 C198 70 178 64 160 64 C142 64 122 70 120 88 C110 88 100 95 96 110 Z"
              fill="url(#hair)"
            />

            {/* Ear Right */}
            <g transform="translate(200, 95)">
              <ellipse cx="15" cy="22" rx="10" ry="14" fill="url(#skin)" />
              <ellipse
                cx="15"
                cy="24"
                rx="4"
                ry="7"
                fill="#d4926b"
                opacity="0.6"
              />
              {/* Hair Ear Right */}
              <path
                d="M5 10 Q15 5 25 10 Q20 15 10 15 Z"
                fill="url(#hair)"
                opacity="0.8"
              />
            </g>

            {/* Ear Left */}
            <g transform="translate(95, 95)">
              <ellipse cx="15" cy="22" rx="10" ry="14" fill="url(#skin)" />
              <ellipse
                cx="15"
                cy="24"
                rx="4"
                ry="7"
                fill="#d4926b"
                opacity="0.6"
              />
              {/* Hair Ear Left */}
              <path
                d="M5 10 Q15 5 25 10 Q20 15 10 15 Z"
                fill="url(#hair)"
                opacity="0.8"
              />
            </g>

            {/* Face */}
            <ellipse cx="160" cy="115" rx="50" ry="56" fill="url(#skin)" />

            {/* Jaw Shading */}
            <path
              d="M114 130 Q160 175 206 130 Q200 160 160 168 Q120 160 114 130 Z"
              fill="url(#skinDark)"
              opacity="0.35"
            />

            {/* ===== HAIR TOP (từ cấu trúc bạn gửi) ===== */}
            <path
              d="M100 60 Q160 20 220 60 Q230 80 225 100 Q200 70 160 70 Q120 70 95 100 Q90 80 100 60 Z"
              fill="url(#hair)"
              opacity="0.95"
            />

            {/* Hair Fringe */}
            <path
              d="M108 100 C124 70 158 66 170 88 C176 72 196 76 206 96 C198 84 184 82 176 92 C168 80 152 80 144 92 C134 80 118 84 108 100 Z"
              fill="url(#hair)"
            />
            <path
              d="M120 88 Q150 70 200 92"
              stroke="url(#hairShine)"
              strokeWidth="2"
              fill="none"
            />

            {/* ===== HAIR EYEBROWS (từ cấu trúc bạn gửi) ===== */}
            <motion.g
              animate={
                mode === "surprised"
                  ? { y: -5 }
                  : mode === "username"
                    ? { y: -1 }
                    : { y: 0 }
              }
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
            >
              <path
                d="M118 98 Q132 92 144 98"
                stroke="#1a1140"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M176 98 Q188 92 200 98"
                stroke="#1a1140"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Headset Band */}
            <path
              d="M102 86 Q160 40 218 86"
              stroke="#1a1a2e"
              strokeWidth="3"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M102 86 Q160 40 218 86"
              stroke="#4FC3F7"
              strokeWidth="1"
              fill="none"
              opacity="0.7"
            />
            <g filter="url(#softGlow)">
              <circle
                cx="102"
                cy="86"
                r="6"
                fill="#1a1a2e"
                stroke="#4FC3F7"
                strokeWidth="1.2"
              />
              <circle cx="102" cy="86" r="2" fill="#4FC3F7" />
              <circle
                cx="218"
                cy="86"
                r="6"
                fill="#1a1a2e"
                stroke="#8B5CF6"
                strokeWidth="1.2"
              />
              <circle cx="218" cy="86" r="2" fill="#8B5CF6" />
            </g>

            {/* Cheeks */}
            <ellipse
              cx="122"
              cy="132"
              rx="9"
              ry="5"
              fill="#ff9bb3"
              opacity="0.55"
            />
            <ellipse
              cx="198"
              cy="132"
              rx="9"
              ry="5"
              fill="#ff9bb3"
              opacity="0.55"
            />

            {/* ===== HAIR BEARD (từ cấu trúc bạn gửi) ===== */}
            <path
              d="M128 148 Q160 185 192 148 Q182 165 160 170 Q138 165 128 148 Z"
              fill="url(#hair)"
              opacity="0.75"
            />

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <ellipse cx="135" cy="120" rx="10" ry="12" fill="#fff" />
              <ellipse
                cx="135"
                cy="121"
                rx="9.5"
                ry="11.5"
                fill="none"
                stroke="#16225a"
                strokeOpacity="0.25"
                strokeWidth="0.8"
              />
              <motion.g
                animate={{ x: px, y: py }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <ellipse cx="135" cy="121" rx="6" ry="8" fill="url(#iris)" />
                <circle cx="135" cy="121" r="3" fill="#0a0f2c" />
                <circle cx="137" cy="118" r="1.6" fill="#fff" />
                <circle cx="133" cy="124" r="0.8" fill="#fff" opacity="0.7" />
              </motion.g>
              {/* Eye Lid */}
              <motion.rect
                x="124"
                y="108"
                width="22"
                height="14"
                fill="url(#skin)"
                animate={eyeLidsControls}
                initial={{ scaleY: 0 }}
                style={{ originY: "108px" }}
              />

              {/* Right Eye */}
              <ellipse cx="185" cy="120" rx="10" ry="12" fill="#fff" />
              <ellipse
                cx="185"
                cy="121"
                rx="9.5"
                ry="11.5"
                fill="none"
                stroke="#16225a"
                strokeOpacity="0.25"
                strokeWidth="0.8"
              />
              <motion.g
                animate={{ x: px, y: py }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <ellipse cx="185" cy="121" rx="6" ry="8" fill="url(#iris)" />
                <circle cx="185" cy="121" r="3" fill="#0a0f2c" />
                <circle cx="187" cy="118" r="1.6" fill="#fff" />
                <circle cx="183" cy="124" r="0.8" fill="#fff" opacity="0.7" />
              </motion.g>
              {/* Eye Lid */}
              <motion.rect
                x="174"
                y="108"
                width="22"
                height="14"
                fill="url(#skin)"
                animate={eyeLidsControls}
                initial={{ scaleY: 0 }}
                style={{ originY: "108px" }}
              />
            </g>

            {/* Nose */}
            <path
              d="M160 128 Q163 138 160 144 Q158 146 156 144"
              stroke="#c98a6b"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Mouth */}
            <motion.g
              animate={mode === "surprised" ? { scale: 1.1 } : { scale: 1 }}
              style={{ originX: "160px", originY: "156px" }}
            >
              {mode === "surprised" ? (
                <ellipse cx="160" cy="156" rx="7" ry="9" fill="#5a1828" />
              ) : (
                <>
                  <path
                    d="M146 154 Q160 166 174 154"
                    stroke="#5a1828"
                    strokeWidth="2.2"
                    fill="#7a2030"
                    strokeLinecap="round"
                  />
                  <path
                    d="M148 154 Q160 160 172 154"
                    stroke="#fff"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                    fill="none"
                  />
                </>
              )}
            </motion.g>
          </motion.g>
        </motion.g>

        {/* ===== ARMS (từ cấu trúc bạn gửi) ===== */}
        <g>
          {/* Left Arm */}
          <motion.g
            animate={leftHandControls}
            initial={{ x: 0, y: 0, rotate: 0 }}
            style={{ originX: "108px", originY: "180px" }}
          >
            <path
              d="M75 200 Q55 170 65 140 Q70 130 80 135 Q85 145 90 160 Q95 180 105 200"
              fill="url(#jacket)"
              stroke="url(#jacketTrim)"
              strokeWidth="1"
            />
            <Hand x={108} y={180} side="left" />
          </motion.g>

          {/* Right Arm */}
          <motion.g
            animate={rightHandControls}
            initial={{ x: 0, y: 0, rotate: 0 }}
            style={{ originX: "212px", originY: "180px" }}
          >
            <path
              d="M245 200 Q265 170 255 140 Q250 130 240 135 Q235 145 230 160 Q225 180 215 200"
              fill="url(#jacket)"
              stroke="url(#jacketTrim)"
              strokeWidth="1"
            />
            <Hand x={212} y={180} side="right" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}

// ===== HAND COMPONENT =====
function Hand({
  x,
  y,
  side,
}: {
  x: number;
  y: number;
  side: "left" | "right";
}) {
  const dir = side === "left" ? 1 : -1;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Wrist / Sleeve Cuff */}
      <path
        d={`M ${-22 * dir} 18 L ${22 * dir} 18 L ${18 * dir} 34 L ${-18 * dir} 34 Z`}
        fill="url(#jacket)"
        stroke="url(#jacketTrim)"
        strokeWidth="1"
      />
      {/* Palm */}
      <path
        d="M -22 -2 Q -24 12 -16 20 L 16 20 Q 24 12 22 -2 Q 18 -10 0 -10 Q -18 -10 -22 -2 Z"
        fill="url(#skin)"
        stroke="#c98a6b"
        strokeWidth="0.8"
      />
      {/* Thumb */}
      <path
        d={`M ${-20 * dir} -2 Q ${-28 * dir} -6 ${-26 * dir} -14 Q ${-22 * dir} -20 ${-14 * dir} -16 Q ${-12 * dir} -8 ${-14 * dir} -4 Z`}
        fill="url(#skin)"
        stroke="#c98a6b"
        strokeWidth="0.8"
      />
      {/* Four Fingers */}
      {[
        { cx: -12, h: 18, w: 6 },
        { cx: -3, h: 22, w: 6.5 },
        { cx: 7, h: 21, w: 6.5 },
        { cx: 16, h: 16, w: 6 },
      ].map((f, i) => (
        <g key={i}>
          <path
            d={`M ${f.cx - f.w / 2} -2 Q ${f.cx - f.w / 2} ${-f.h} ${f.cx} ${-f.h - 2} Q ${f.cx + f.w / 2} ${-f.h} ${f.cx + f.w / 2} -2 Z`}
            fill="url(#skin)"
            stroke="#c98a6b"
            strokeWidth="0.8"
          />
          <path
            d={`M ${f.cx - f.w / 2 + 1} ${-f.h + 4} Q ${f.cx} ${-f.h + 1} ${f.cx + f.w / 2 - 1} ${-f.h + 4}`}
            stroke="#d4926b"
            strokeOpacity="0.6"
            strokeWidth="0.8"
            fill="none"
          />
          <ellipse
            cx={f.cx}
            cy={-f.h - 0.5}
            rx={f.w / 2 - 1.2}
            ry="2"
            fill="#ffe6cf"
            opacity="0.9"
          />
        </g>
      ))}
      {/* Palm Shading */}
      <path
        d="M -16 6 Q 0 14 16 6"
        stroke="#d4926b"
        strokeOpacity="0.5"
        strokeWidth="0.9"
        fill="none"
      />
    </g>
  );
}
