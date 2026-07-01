"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Star } from "lucide-react";
import { FilterBar } from "./FilterBar";
import { RankingItem } from "./RankingItem";
import { Podium } from "./Podium";
import { useSearchParams, useRouter } from "next/navigation";
import { productivityRanking, bugRanking, employees } from "@/lib/mock-data";
import styles from "./styles.module.scss";

type TabType = "prod" | "bug";

const RankingsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab: TabType = searchParams.get("tab") === "bug" ? "bug" : "prod";
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department))).sort(),
    [],
  );

  const base = tab === "prod" ? productivityRanking : bugRanking;
  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return base.filter((e) => {
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      const matchDept = dept === "all" || e.department === dept;
      return matchSearch && matchDept;
    });
  }, [base, search, dept]);

  const metric = tab === "prod" ? "Production Output" : "Bugs Resolved";
  const max = tab === "prod" ? 140 : 100;

  const top3 = list.slice(0, 3).map((emp) => ({
    id: emp.id,
    name: emp.name,
    avatar: emp.avatar,
    value: tab === "prod" ? emp.output : emp.bugsResolved,
  }));

  const handleReset = () => {
    setSearch("");
    setDept("all");
    setSelectedMonth("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badge}>
            <Trophy className={styles.badgeIcon} />
            Hall of Fame
          </div>
          <h1 className={styles.title}>
            Bảng Xếp Hạng
            <span className="text-gradient"> ✦</span>
          </h1>
          <p className={styles.subtitle}>
            Tôn vinh những thành viên xuất sắc nhất theo từng tiêu chí.
          </p>
        </div>

        <div className={styles.tabGroup}>
          {[
            { key: "prod", label: "Sản lượng", icon: <Sparkles size={16} /> },
            { key: "bug", label: "Bug Resolution", icon: <Star size={16} /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => router.push(`/ranking?tab=${t.key}`)}
              className={`${styles.tabButton} ${tab === t.key ? styles.tabActive : ""}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <Podium top3={top3} metric={metric} tab={tab} />

      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Tìm theo tên, mã NV, phòng ban..."
        resultCount={list.length}
        onReset={handleReset}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selects={[
          {
            key: "dept",
            label: "Phòng ban",
            value: dept,
            onChange: setDept,
            options: [
              { value: "all", label: "Tất cả" },
              ...departments.map((d) => ({ value: d, label: d })),
            ],
          },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`${styles.rankingList} glass-card`}
      >
        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.emptyState}
            >
              Không tìm thấy thành viên phù hợp.
            </motion.div>
          )}

          {list.map((emp, i) => {
            const value = tab === "prod" ? emp.output : emp.bugsResolved;
            return (
              <RankingItem
                key={emp.id}
                rank={i + 1}
                name={emp.name}
                id={emp.id}
                department={emp.department}
                avatar={emp.avatar}
                value={value}
                max={max}
                metric={metric}
                tab={tab}
                index={i}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RankingsPage;
