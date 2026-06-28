"use client";

import { motion } from "framer-motion";
import { Bug, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { employees } from "@/lib/mock-data";
import { Hero } from "./Hero";
import { KPI } from "./KPI";
import { Ranking } from "./Ranking";
import { Activity } from "./Activity";
import styles from "./styles.module.scss";

export default function Dashboard() {
  const totalMembers = employees.length;
  const totalTasks = employees.reduce((s, e) => s + e.tasksCompleted, 0);
  const totalBugs = employees.reduce((s, e) => s + e.bugsResolved, 0);

  const kpiData = [
    { 
      label: "Tổng Thành Viên", 
      value: totalMembers, 
      icon: Users, 
      trend: "+3 quý này",
      color: "from-primary/30 to-primary/0" 
    },
    { 
      label: "Tổng Task Hoàn Thành", 
      value: totalTasks, 
      icon: CheckCircle2, 
      trend: "+12.4% MoM",
      color: "from-accent/30 to-accent/0" 
    },
    { 
      label: "Tổng Bug Đã Xử Lý", 
      value: totalBugs, 
      icon: Bug, 
      trend: "+8.1% MoM",
      color: "from-secondary/30 to-secondary/0" 
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <Hero />

        <KPI data={kpiData} />

        <Ranking 
          title="Productivity Champions" 
          type="productivity" 
        />

        <Ranking 
          title="Bug Champions" 
          type="bug" 
        />

        <Activity />
      </div>
    </div>
  );
}