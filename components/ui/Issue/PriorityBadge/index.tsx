'use client';

import React from 'react';
import styles from './styles.module.scss';

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityClass = (priority: string) => {
    const map: Record<string, string> = {
      'Critical': styles.critical,
      'High': styles.high,
      'Medium': styles.medium,
      'Low': styles.low,
    };
    return map[priority] || styles.default;
  };

  return (
    <span className={`${styles.badge} ${getPriorityClass(priority)}`}>
      {priority}
    </span>
  );
};