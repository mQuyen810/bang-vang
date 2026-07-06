"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { CornerBracket } from "../CornerBracket";
import { ROLE_MAP } from "@/constants/ranking";
import styles from "./styles.module.scss";
import { RankingBug, RankingProductivity } from "@/types/rankingItem";

type PodiumVariant = "default" | "bug";

interface PodiumCardProps {
  place: 1 | 2 | 3;
  emp: RankingProductivity | RankingBug;
  className?: string;
  variant?: PodiumVariant;
}

export function PodiumCard({
  place,
  emp,
  className = "",
  variant = "default",
}: PodiumCardProps) {
  console.log("PodiumCard", emp);
  const isFirst = place === 1;

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

  const match = emp.name.match(/^(.*?)\s*\((.*?)\)$/);
  const fullName = match?.[1] ?? emp.name;

  const theme = isFirst
    ? {
        hex: "#F6C453",
        soft: "rgba(246,196,83,",
        label: "Gold",
        badgeGrad:
          "linear-gradient(180deg,#FBE07A 0%,#F6C453 45%,#A87420 100%)",
      }
    : place === 2
      ? {
          hex: "#A9C6FF",
          soft: "rgba(169,198,255,",
          label: "Silver",
          badgeGrad:
            "linear-gradient(180deg,#E6EFFF 0%,#A9C6FF 45%,#5A77BA 100%)",
        }
      : {
          hex: "#D88955",
          soft: "rgba(216,137,85,",
          label: "Bronze",
          badgeGrad:
            "linear-gradient(180deg,#F2B68A 0%,#D88955 45%,#7E4622 100%)",
        };

  const glow1 = `${theme.soft}0.55)`;
  const glow2 = `${theme.soft}0.18)`;

  const placeText = isFirst ? "1st" : place === 2 ? "2nd" : "3rd";
  const placeColor = isFirst ? "#F6C453" : place === 2 ? "#A9C6FF" : "#D88955";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: place * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hover"
      className={`${styles.podiumCardWrapper} ${isFirst ? styles.firstPlace : ""} ${className}`}
    >
      {/* ===== VƯƠNG MIỆN TRÊN ĐỈNH CARD ===== */}
      {isFirst && (
        <div className={styles.crownContainer}>
          <div className={styles.crownGlow} />
          <Crown className={styles.crownIcon} />
          <div className={styles.crownSparkles}>
            <span
              className={styles.sparkleDot}
              style={{ animationDelay: "0s" }}
            />
            <span
              className={styles.sparkleDot}
              style={{ animationDelay: "0.4s" }}
            />
            <span
              className={styles.sparkleDot}
              style={{ animationDelay: "0.8s" }}
            />
            <span
              className={styles.sparkleDot}
              style={{ animationDelay: "1.2s" }}
            />
            <span
              className={styles.sparkleDot}
              style={{ animationDelay: "1.6s" }}
            />
          </div>
        </div>
      )}

      {/* Outer animated border */}
      <div aria-hidden className={styles.podiumCardBorder}>
        <div
          className={`${styles.podiumCardBorderInner} ${isFirst ? styles.spinSlow : ""}`}
          style={{
            background: isFirst
              ? `conic-gradient(from 0deg, transparent 0deg, ${theme.hex} 30deg, transparent 80deg, transparent 180deg, ${theme.hex} 210deg, transparent 260deg)`
              : `linear-gradient(135deg, ${glow2}, transparent 40%, ${glow2} 80%)`,
            opacity: isFirst ? 0.9 : 0.7,
          }}
        />
      </div>

      {/* Card body */}
      <div
        className={`${styles.podiumCard} ${isFirst ? styles.tall : ""}`}
        style={{
          background:
            "linear-gradient(180deg, rgba(20,28,52,0.92) 0%, rgba(11,17,34,0.94) 60%, rgba(8,14,28,0.96) 100%)",
          boxShadow: `0 30px 80px -30px ${glow1}, inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px ${glow2}`,
        }}
      >
        {/* Continuous pulse for #1 */}
        {isFirst && (
          <div
            aria-hidden
            className={styles.pulseGold}
            style={{
              background: `radial-gradient(100% 60% at 50% 0%, ${glow2}, transparent 70%)`,
            }}
          />
        )}

        {/* Top inner glow */}
        <div
          aria-hidden
          className={styles.topGlow}
          style={{
            background: `radial-gradient(70% 100% at 50% 0%, ${theme.soft}0.22, transparent 70%)`,
          }}
        />

        {/* Corner brackets */}
        <CornerBracket
          color={theme.hex}
          variant="glow"
          size="md"
          className={styles.cornerTopLeft}
          animated={isFirst}
        />
        <CornerBracket
          color={theme.hex}
          variant="glow"
          size="md"
          className={styles.cornerTopRight}
          animated={isFirst}
        />
        <CornerBracket
          color={theme.hex}
          variant="glow"
          size="md"
          className={styles.cornerBottomRight}
          animated={isFirst}
        />
        <CornerBracket
          color={theme.hex}
          variant="glow"
          size="md"
          className={styles.cornerBottomLeft}
          animated={isFirst}
        />

        {/* Edge shimmer on hover */}
        <div
          aria-hidden
          className={styles.edgeShimmer}
          style={{
            background: `linear-gradient(120deg, transparent 30%, ${theme.soft}0.18, transparent 70%)`,
            backgroundSize: "200% 100%",
          }}
        />

        <div className={styles.podiumCardContent}>
          {/* Số thứ tự */}
          <div className={styles.placeBadge}>
            <span className={styles.placeNumber} style={{ color: placeColor }}>
              {placeText}
            </span>
          </div>

          {/* Avatar with double ring */}
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlow} style={{ background: glow1 }} />
            <div
              className={styles.avatarRing}
              style={{
                background: `conic-gradient(from 0deg, ${theme.hex}, transparent 50%, ${theme.hex})`,
              }}
            >
              <div className={styles.avatarInnerRing}>
                <div
                  className={`${styles.avatar} ${isFirst ? styles.avatarLarge : ""}`}
                  style={{
                    background:
                      "linear-gradient(135deg, #3a4a78 0%, #1f2a47 100%)",
                    boxShadow: `inset 0 0 0 2px ${theme.hex}55, inset 0 0 24px ${glow2}`,
                  }}
                >
                  {emp.avatar}
                </div>
              </div>
            </div>
          </div>

          {/* Name + role */}
          <h3 className={styles.podiumName}>{fullName}</h3>
          {/* <span className={styles.podiumRole}>{baseRole}</span> */}

          {/* Divider */}
          <div
            className={styles.podiumDivider}
            style={{
              background: `linear-gradient(to right, transparent, ${theme.soft}0.5, transparent)`,
            }}
          />

          {/* Metric */}
          <div className={styles.podiumMetric}>
            <div
              className={styles.podiumMetricLabel}
              style={{ color: `${theme.soft}0.85` }}
            >
              {variant === "bug" ? "Bug Resolved" : "Productivity"}
            </div>
            <div
              className={styles.podiumMetricValue}
              style={{
                color: theme.hex,
                fontSize: isFirst ? "3.6rem" : "3rem",
              }}
            >
              {variant === "bug" ? `${current}` : `${metricVal}%`}
            </div>
          </div>

          {/* Spacer */}
          <div className={styles.podiumSpacer} />

          {/* Progress bar */}
          <div className={styles.podiumProgress}>
            <div className={styles.podiumProgressHeader}>
              <span className={styles.podiumProgressLabel}>
                {variant === "bug" ? "Bug percent" : "Productivity percent"}
              </span>
              <span
                className={styles.podiumProgressValue}
                style={{ color: theme.hex }}
              >
                {variant === "bug"
                  ? `${metricVal.toFixed(2)}%`
                  : `${metricVal.toFixed(2)}%`}
              </span>
            </div>
            <div
              className={styles.podiumProgressBar}
              style={{
                background: "rgba(0,0,0,0.5)",
                boxShadow: `inset 0 0 0 1px ${glow2}`,
              }}
            >
              <div
                className={styles.podiumProgressFill}
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${theme.hex}99, ${theme.hex}, ${theme.hex}cc)`,
                  boxShadow: `0 0 14px ${glow1}`,
                }}
              />
              <div
                className={styles.podiumProgressLight}
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.soft}0.7, transparent)`,
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom edge ribbon */}
        <div
          aria-hidden
          className={styles.podiumRibbon}
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.hex}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
