"use client";

import { motion } from "framer-motion";
import { Bug, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { employees } from "@/lib/mock-data";
import { Hero } from "./Hero";
import { KPI } from "./KPI";
import { Ranking } from "./Ranking";
import { Activity } from "./Activity";
import styles from "./styles.module.scss";
import { useDashboardStore } from "@/stores/dashboard.store";

export default function Dashboard() {
  const { overview } = useDashboardStore();
  console.log("overview", overview);
  const kpiData = [
    {
      label: "Tổng Thành Viên",
      value: overview?.total_users ?? 0,
      icon: Users,
      trend: "+3 quý này",
      color: "from-primary/30 to-primary/0",
    },
    {
      label: "Tổng Task Hoàn Thành",
      value: overview?.total_subtask ?? 0,
      icon: CheckCircle2,
      trend: "+12.4% MoM",
      color: "from-accent/30 to-accent/0",
    },
    {
      label: "Tổng Bug Đã Xử Lý",
      value: overview?.total_bug ?? 0,
      icon: Bug,
      trend: "+8.1% MoM",
      color: "from-secondary/30 to-secondary/0",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <Hero />

        <KPI data={kpiData} />

        <Ranking title="Productivity Champions" type="productivity" />

        <Ranking title="Bug Champions" type="bug" />

        <Activity />
      </div>
    </div>
  );
}
