"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Star } from "lucide-react";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";

import { RankingItem } from "./RankingItem";
import { PaginationBar } from "./PaginationBar";
import { useSearchParams, useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useRankingStore } from "@/stores/ranking.store";
import { getCurrentPeriod } from "@/utils/date";

import { mapBugRanking } from "@/utils/rankingBug";
import { mapProductivityRanking } from "@/utils/rankingProductivity";
import type { RankingBug, RankingProductivity } from "@/types/rankingItem";

import styles from "./styles.module.scss";
import dayjs from "dayjs";

type TabType = "prod" | "bug";
const DEFAULT_PAGE_SIZE = 10;

const rankingTabs: ReadonlyArray<{
  key: TabType;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "prod", label: "Sản lượng", icon: <Sparkles size={16} /> },
  { key: "bug", label: "Xử lý lỗi", icon: <Star size={16} /> },
];

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

  const tab: TabType = searchParams?.get("tab") === "bug" ? "bug" : "prod";
  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [page, setPage] = useState(1);
  const { selectedProjects } = useDashboardStore();

  const {
    leaderboardBugRatio,
    leaderboardSlsxRatio,
    fetchLeaderboardBugRatio,
    fetchLeaderboardSlsxRatio,
  } = useRankingStore();
  const [rankingPeriod, setRankingPeriod] = useState(getCurrentPeriod());
  const selectedMonth = dayjs(rankingPeriod, "MM-YYYY").format("YYYY-MM");

  const handleTabChange = (nextTab: TabType) => {
    if (nextTab === tab) return;

    setPage(1);
    router.replace(`/ranking?tab=${nextTab}`);
  };

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
  };

  const handleMonthChange = (month: string) => {
    if (!month) return;

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

  // Note: We intentionally avoid resetting page via useEffect to satisfy ESLint rule
  // `react-hooks/set-state-in-effect`.
  const effectivePage = page > totalPages ? totalPages : page;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badge}>
            <Trophy className={styles.badgeIcon} />
            Vinh danh
          </div>
          <h1 className={styles.title}>
            {tab === "prod"
              ? "Bảng xếp hạng Sản lượng"
              : "Bảng xếp hạng xử lý lỗi"}
            <span className="text-gradient"> ✦</span>
          </h1>

          <p className={styles.subtitle}>
            Tôn vinh những thành viên xuất sắc nhất theo từng tiêu chí
          </p>
        </div>

        <div className={styles.tabGroup}>
          {rankingTabs.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => handleTabChange(t.key)}
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
                  bugMissing={emp.bugCountMissing}
                  bugCount={emp.bugCount}
                  subtaskCount={emp.subtaskCount}
                />
              ))}
        </AnimatePresence>
      </motion.div>

      <PaginationBar
        page={effectivePage}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
};

export default RankingsPage;
