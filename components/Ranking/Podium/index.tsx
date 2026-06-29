'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import styles from './styles.module.scss';

interface PodiumProps {
  top3: Array<{
    id: string;
    name: string;
    avatar: string;
    value: number;
  }>;
  metric: string;
  tab: 'prod' | 'bug';
}

export const Podium: React.FC<PodiumProps> = ({ top3, metric, tab }) => {
  if (top3.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.podiumSection}
    >
      <div className={`${styles.podiumContainer} glass-card`}>
        <div className={styles.podiumGrid}>
          {/* Second Place */}
          {top3[1] && (
            <div className={styles.podiumPlace}>
              <div className={`${styles.podiumBadge} ${styles.silver}`}>2</div>
              <div className={styles.podiumAvatar}>
                {top3[1].avatar}
              </div>
              <div className={styles.podiumName}>{top3[1].name}</div>
              <div className={styles.podiumScore}>
                {top3[1].value}
                {tab === 'prod' ? '%' : ''}
              </div>
              <div className={`${styles.podiumStand} ${styles.standSilver}`}>
                <span>{metric}</span>
              </div>
            </div>
          )}

          {/* First Place */}
          {top3[0] && (
            <div className={`${styles.podiumPlace} ${styles.podiumFirst}`}>
              <div className={`${styles.podiumBadge} ${styles.gold}`}>
                <Trophy size={20} />
                1
              </div>
              <div className={`${styles.podiumAvatar} ${styles.avatarGold}`}>
                {top3[0].avatar}
                <div className={styles.crown}>👑</div>
              </div>
              <div className={styles.podiumName}>{top3[0].name}</div>
              <div className={styles.podiumScore}>
                {top3[0].value}
                {tab === 'prod' ? '%' : ''}
              </div>
              <div className={`${styles.podiumStand} ${styles.standGold}`}>
                <span>{metric}</span>
              </div>
            </div>
          )}

          {/* Third Place */}
          {top3[2] && (
            <div className={styles.podiumPlace}>
              <div className={`${styles.podiumBadge} ${styles.bronze}`}>3</div>
              <div className={styles.podiumAvatar}>
                {top3[2].avatar}
              </div>
              <div className={styles.podiumName}>{top3[2].name}</div>
              <div className={styles.podiumScore}>
                {top3[2].value}
                {tab === 'prod' ? '%' : ''}
              </div>
              <div className={`${styles.podiumStand} ${styles.standBronze}`}>
                <span>{metric}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};