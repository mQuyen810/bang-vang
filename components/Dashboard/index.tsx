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
  const kpiData = [
    {
      label: "Tổng Thành Viên",
      value: overview?.total_users ?? 0,
      icon: Users,
      trend: "",
      color: "from-primary/30 to-primary/0",
    },
    {
      label: "Tổng Sub Task Hoàn Thành",
      value: overview?.total_subtask ?? 0,
      icon: CheckCircle2,
      trend: "",
      color: "from-accent/30 to-accent/0",
    },
    {
      label: "Tổng Bug Xử Lý",
      value: overview?.total_bug ?? 0,
      icon: Bug,
      trend: "",
      color: "from-secondary/30 to-secondary/0",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <Hero />

        <KPI data={kpiData} />

        <Ranking title="Bảng xếp hạng Sản lượng" type="prod" />

        <Ranking title="Bảng xếp hạng Bug" type="bug" />

        {/* <Activity /> */}
      </div>
    </div>
  );
}
