"use client";

import { LucideIcon } from "lucide-react";
import { KPICard } from "./KpiCard";
import styles from "./styles.module.scss";

interface KPIItem {
  label: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  color: string;
}

interface KPIProps {
  data: KPIItem[];
}

export function KPI({ data }: KPIProps) {
  return (
    <section className={styles.section}>
      {data.map((item, i) => (
        <KPICard key={item.label} {...item} index={i} />
      ))}
    </section>
  );
}