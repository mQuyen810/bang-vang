'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.scss';

interface RankingItemProps {
  rank: number;
  name: string;
  id: string;
  department: string;
  avatar: string;
  value: number;
  max: number;
  metric: string;
  tab: 'prod' | 'bug';
  index: number;
}

export const RankingItem: React.FC<RankingItemProps> = ({
  rank,
  name,
  id,
  department,
  avatar,
  value,
  max,
  metric,
  tab,
  index,
}) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ x: 2 }}
      className={`${styles.rankingItem} ${isTop3 ? styles.rankingItemTop : ''}`}
    >
      <div className={styles.rankColumn}>
        {medal ? (
          <div className={`${styles.medal} ${medal.className}`}>
            {rank}
          </div>
        ) : (
          <div className={styles.rankNumber}>{rank}</div>
        )}
      </div>

      <div className={styles.userColumn}>
        <div className={styles.avatar}>{avatar}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{name}</div>
          <div className={styles.userMeta}>
            {department} · {id}
          </div>
        </div>
      </div>

      <div className={styles.progressColumn}>
        <div className={styles.progressHeader}>
          <span>{metric}</span>
          <span className={styles.progressValue}>
            {value} / {max}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={`${styles.scoreColumn} ${medal ? medal.textColor : ''}`}>
        {value}{tab === 'prod' ? '%' : ''}
      </div>
    </motion.div>
  );
};