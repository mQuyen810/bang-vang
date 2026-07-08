'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Award, CheckCircle2, Bug 
} from 'lucide-react';
import { AnimatedCounter } from '../../ui/animated-counter';
import type { Employee } from '@/lib/mock-data';
import styles from './styles.module.scss';

interface MetricCardsProps {
  user: Employee;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ user }) => {
  const metrics = [
    { 
      label: 'Sản lượng đầu ra', 
      value: user.output, 
      icon: TrendingUp,
      color: 'var(--primary)'
    },
    { 
      label: 'Năng lực dự kiến',
      value: user.capacity, 
      suffix: '%', 
      icon: Award,
      color: 'var(--accent)'
    },
    { 
      label: 'Tỷ lệ hoàn thành',
      value: user.completionRate, 
      suffix: '%', 
      icon: CheckCircle2,
      color: '#22c55e'
    },
    { 
      label: 'Lỗi đã xử lý',
      value: user.bugsResolved, 
      icon: Bug,
      color: '#ef4444'
    },
  ];

  return (
    <section className={styles.grid}>
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className={`${styles.card} glass-card`}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>{m.label}</span>
            <m.icon className={styles.cardIcon} style={{ color: m.color }} />
          </div>
          <div className={styles.cardValue}>
            <AnimatedCounter value={m.value} />
            {m.suffix}
          </div>
        </motion.div>
      ))}
    </section>
  );
};