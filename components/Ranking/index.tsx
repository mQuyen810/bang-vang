"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Star } from "lucide-react";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";

import { RankingItem } from "./RankingItem";
import { PaginationBar } from "./PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard.store";
import { mapBugRanking } from "@/utils/rankingBug";
import { mapProductivityRanking } from "@/utils/rankingProductivity";
import type { RankingBug, RankingProductivity } from "@/types/rankingItem";
import styles from "./styles.module.scss";
import dayjs from "dayjs";

type TabType = "prod" | "bug";
const DEFAULT_PAGE_SIZE = 10;

type CommonRankingItem = Pick<
  RankingProductivity,
  "id" | "name" | "username" | "avatar"
>;

const filterRankingItems = <T extends CommonRankingItem>(
  items: T[],
  search: string,
) => {
  const q = search.trim().toLowerCase();

  return items.filter((item) => {
    const matchSearch =
      !q ||
      item.username.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q);

    return matchSearch;
  });
};

const RankingsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab: TabType = searchParams.get("tab") === "bug" ? "bug" : "prod";
  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [page, setPage] = useState(1);
  const {
    period,
    selectedProjects,
    leaderboardBugRatio,
    leaderboardSlsxRatio,
    fetchLeaderboardBugRatio,
    fetchLeaderboardSlsxRatio,
  } = useDashboardStore();
  const apiPeriod =
    leaderboardSlsxRatio?.period ?? leaderboardBugRatio?.period ?? period;
  const [rankingPeriod, setRankingPeriod] = useState(period);
  const [defaultMonth, setDefaultMonth] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const productivityData = useMemo(
    () =>
      mapProductivityRanking(leaderboardSlsxRatio?.issues.details.list ?? []),
    [leaderboardSlsxRatio],
  );

  const bugData = useMemo(
    () => mapBugRanking(leaderboardBugRatio?.issues.details.list ?? []),
    [leaderboardBugRatio],
  );

  const filteredProductivityData = useMemo(
    () => filterRankingItems(productivityData, search),
    [productivityData, search],
  );

  const filteredBugData = useMemo(
    () => filterRankingItems(bugData, search),
    [bugData, search],
  );

  const base = tab === "prod" ? filteredProductivityData : filteredBugData;
  const activeMeta =
    tab === "prod"
      ? leaderboardSlsxRatio?.issues.details.meta
      : leaderboardBugRatio?.issues.details.meta;

  const list = base;
  const totalPages = activeMeta?.last_page ?? 1;
  const currentPage = activeMeta?.current_page ?? page;
  const rankStart = activeMeta?.from ?? 1;
  const pageSize = activeMeta?.per_page ?? DEFAULT_PAGE_SIZE;
  const totalResults = activeMeta?.total ?? list.length;

  const productivityRankById = useMemo(
    () =>
      new Map(
        productivityData.map((item, index) => [item.id, rankStart + index]),
      ),
    [productivityData, rankStart],
  );

  const bugRankById = useMemo(
    () => new Map(bugData.map((item, index) => [item.id, rankStart + index])),
    [bugData, rankStart],
  );

  const handleReset = () => {
    setSearch("");

    if (defaultMonth) {
      setSelectedMonth(dayjs(defaultMonth, "MM-YYYY").format("YYYY-MM"));
      setRankingPeriod(defaultMonth);
    }
  };

  const handleMonthChange = (month: string) => {
    if (!month) {
      if (defaultMonth) {
        setPage(1);
        setSelectedMonth(dayjs(defaultMonth, "MM-YYYY").format("YYYY-MM"));
        setRankingPeriod(defaultMonth);
      }

      return;
    }

    setSelectedMonth(month);
    setRankingPeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedUsername(search.trim() ? search.trim() : "");
    }, 500);

    return () => {
      window.clearTimeout(t);
    };
  }, [search]);

  useEffect(() => {
    const userNameParam = debouncedUsername ? debouncedUsername : null;

    if (tab === "prod") {
      fetchLeaderboardSlsxRatio(userNameParam, page, pageSize, rankingPeriod);
      return;
    }

    fetchLeaderboardBugRatio(userNameParam, page, pageSize, rankingPeriod);
  }, [
    tab,
    page,
    rankingPeriod,
    pageSize,
    debouncedUsername,
    selectedProjects,
    fetchLeaderboardBugRatio,
    fetchLeaderboardSlsxRatio,
  ]);

  useEffect(() => {
    if (!apiPeriod) return;

    if (!defaultMonth) {
      setDefaultMonth(apiPeriod);
      setRankingPeriod(apiPeriod);
    }

    if (!selectedMonth) {
      setSelectedMonth(dayjs(apiPeriod, "MM-YYYY").format("YYYY-MM"));
    }
  }, [apiPeriod, defaultMonth, selectedMonth]);

  useEffect(() => {
    setPage(1);
  }, [tab, selectedMonth]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badge}>
            <Trophy className={styles.badgeIcon} />
            Hall of Fame
          </div>
          <h1 className={styles.title}>
            {tab === "prod"
              ? "Bảng xếp hạng Sản Lượng"
              : "Bảng Xếp Hạng Bug Resolution"}
            <span className="text-gradient"> ✦</span>
          </h1>
          <p className={styles.subtitle}>
            Tôn vinh những thành viên xuất sắc nhất theo từng tiêu chí
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

      {/* <Podium top3={top3} metric={metric} tab={tab} /> */}

      <FilterBarUsernameType
        username={search}
        onUsernameChange={setSearch}
        usernamePlaceholder="Tìm theo tên nhân viên"
        resultCount={totalResults}
        onReset={handleReset}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
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

          {tab === "prod"
            ? (list as RankingProductivity[]).map((emp, i) => (
                <RankingItem
                  key={emp.id}
                  rank={productivityRankById.get(emp.id) ?? rankStart}
                  name={emp.name}
                  id={emp.id}
                  avatar={emp.avatar}
                  tab={tab}
                  index={i}
                  output={emp.slsx}
                  capacity={emp.ulnl}
                  ratio={emp.ratio}
                />
              ))
            : (list as RankingBug[]).map((emp, i) => (
                <RankingItem
                  key={emp.id}
                  rank={bugRankById.get(emp.id) ?? rankStart}
                  name={emp.name}
                  id={emp.id}
                  avatar={emp.avatar}
                  tab={tab}
                  index={i}
                  bugCount={emp.bugCount}
                  subtaskCount={emp.subtaskCount}
                />
              ))}
        </AnimatePresence>
      </motion.div>

      <PaginationBar
        page={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
};

export default RankingsPage;
