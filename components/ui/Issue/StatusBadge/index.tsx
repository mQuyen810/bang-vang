"use client";

import React from "react";
import styles from "./styles.module.scss";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      Done: styles.done,
      Resolved: styles.resolved,
      "In Review": styles.inReview,
      "In Progress": styles.inProgress,
      Open: styles.open,
      Closed: styles.closed,
      Pending: styles.pending,
      Overdue: styles.overdue,
      Warning: styles.warning,
    };
    return map[status] || styles.default;
  };

  return (
    <span className={`${styles.badge} ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};
