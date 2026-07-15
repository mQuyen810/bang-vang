"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import dayjs from "dayjs";

interface RankingItemProps {
  rank: number;
  name: string;
  userName: string;
  id: string;
  avatar: string;
  period: string;
  project: string[];

  tab: "prod" | "bug";

  index: number;

  output?: number;
  capacity?: number;

  bugCount?: number;
  subtaskCount?: number;
  bugMissing?: number;

  ratio?: number;
}

export const RankingItem: React.FC<RankingItemProps> = ({
  rank,
  name,
  userName,
  id,
  avatar,
  output,
  capacity,
  bugCount,
  subtaskCount,
  bugMissing,
  ratio,
  tab,
  index,
  period,
  project,
}) => {
  const gradientClass =
    tab === "bug" ? styles.bugGradient : styles.defaultGradient;

  const pct =
    tab === "prod"
      ? ratio
      : Math.round(((bugCount ?? 0) / (subtaskCount || 1)) * 100);
  const isTop3 = rank <= 3;

  const getMedal = (rank: number) => {
    if (rank === 1) {
      return {
        className: styles.medalGold,
        textColor: styles.textGold,
      };
    }
    if (rank === 2) {
      return {
        className: styles.medalSilver,
        textColor: styles.textSilver,
      };
    }
    if (rank === 3) {
      return {
        className: styles.medalBronze,
        textColor: styles.textBronze,
      };
    }
    return null;
  };

  const medal = getMedal(rank);
  const match = name.match(/^(.*?)\s*\((.*?)\)$/);

  const fullName = match?.[1] ?? name;
  const userId = match?.[2] ?? id;

  const [month, year] = period.split("-");

  const startDate = dayjs(`${year}-${month}-01`).format("YYYY-MM-DD");
  const endDate = dayjs(`${year}-${month}-01`)
    .endOf("month")
    .format("YYYY-MM-DD");

  const jql =
    project.length >= 1
      ? tab === "bug"
        ? `project in (${project}) AND issuetype = Bug AND created >= ${startDate} AND created <= ${endDate} AND "Người gây lỗi" in (${userName})`
        : `project in (${project}) AND issuetype = Sub-task AND status = Done AND "Start date" >= ${startDate} AND "Start date" <= ${endDate} AND assignee in (${userName})`
      : tab === "bug"
        ? `issuetype = Bug AND created >= ${startDate} AND created <= ${endDate} AND "Người gây lỗi" in (${userName})`
        : `issuetype = Sub-task AND status = Done AND "Start date" >= ${startDate} AND "Start date" <= ${endDate} AND assignee in (${userName})`;

  const jiraUrl = `https://jira.viettelsoftware.com/issues/?jql=${encodeURIComponent(jql)}`;

  const handleNameClick = () => {
    window.open(jiraUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ x: 2 }}
      className={`${styles.rankingItem} ${isTop3 ? styles.rankingItemTop : ""}`}
    >
      <button
        type="button"
        className={styles.userButton}
        onClick={handleNameClick}
      >
        <div className={styles.rankColumn}>
          {medal ? (
            <div className={`${styles.medal} ${medal.className}`}>{rank}</div>
          ) : (
            <div className={styles.rankNumber}>{rank}</div>
          )}
        </div>

        <div className={styles.userColumn}>
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{fullName}</div>
            <div className={styles.userMeta}>{userId}</div>
          </div>
        </div>

        <div className={styles.bugMissingColumn}>
          <div className={styles.bugMissingHeader}></div>
          <div className={styles.bugMissingValue}>
            {tab === "bug" ? (bugMissing ?? "—") : ""}
          </div>
        </div>

        <div className={styles.progressColumn}>
          <div className={styles.progressHeader}>
            <span className={styles.progressValue}>
              {tab === "prod" ? "" : `${bugCount}/${subtaskCount}`}
            </span>

            <span className={styles.progressValue}>
              {tab === "prod" ? `${output}/${capacity}` : `${pct}%`}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${gradientClass}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div
          className={`${styles.scoreColumn} ${medal ? medal.textColor : ""}`}
        >
          {tab === "prod" ? `${ratio}%` : bugCount}
        </div>
      </button>
    </motion.div>
  );
};
