"use client";

import { motion } from "framer-motion";
import { Activity as ActivityIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./styles.module.scss";

export function Activity() {
  const activities = [
    { 
      user: "Nguyễn Văn A", 
      action: "đã hoàn thành task", 
      task: "UI-234", 
      time: "2 phút trước",
      type: "completed" 
    },
    { 
      user: "Trần Thị B", 
      action: "đã fix bug", 
      task: "BUG-89", 
      time: "15 phút trước",
      type: "fixed" 
    },
    { 
      user: "Lê Văn C", 
      action: "đã tạo pull request", 
      task: "PR-567", 
      time: "1 giờ trước",
      type: "created" 
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "completed": return CheckCircle;
      case "fixed": return AlertCircle;
      default: return ActivityIcon;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "completed": return styles.success;
      case "fixed": return styles.destructive;
      default: return styles.primary;
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Hoạt Động Gần Đây</h2>
        <span className={styles.badge}>
          <Clock className={styles.badgeIcon} />
          Cập nhật trực tiếp
        </span>
      </div>

      <div className={styles.card}>
        {activities.map((activity, i) => {
          const Icon = getIcon(activity.type);
          const colorClass = getColor(activity.type);
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={styles.activityItem}
            >
              <div className={styles.activityIcon}>
                <Icon className={`${styles.icon} ${colorClass}`} />
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  <span className={styles.userName}>{activity.user}</span>
                  {" "}{activity.action}{" "}
                  <span className={styles.taskName}>{activity.task}</span>
                </p>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}