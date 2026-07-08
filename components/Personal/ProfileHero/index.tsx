'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap } from 'lucide-react';
import type { Employee } from '@/lib/mock-data';
import styles from './styles.module.scss';

interface ProfileHeroProps {
  user: Employee;
  rank: number;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user, rank }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.hero} glass-card`}
    >
      <div className={styles.heroBackground} />
      <div className={styles.heroContent}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarGlow} />
          <div className={styles.avatar}>
            {user.avatar}
          </div>
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.badge}>Hồ sơ</div>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.meta}>
            {user.department} · {user.id}
          </p>
          <div className={styles.badges}>
            {user.badges.map((b) => (
              <span key={b} className={styles.badgeItem}>
                <Zap className={styles.badgeIcon} />
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.rankWrapper}>
          <div className={styles.rankBadge}>
            <Crown className={styles.rankIcon} />
            Hạng #{rank}
          </div>
          <span className={styles.rankLabel}>Bảng xếp hạng năng suất</span>
        </div>
      </div>
    </motion.section>
  );
};