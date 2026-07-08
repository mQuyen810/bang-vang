"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useDashboardStore } from "@/stores/dashboard.store";
import type { OverdueLogWorkIssue } from "@/types/dashboard";
import { AlertTriangle, Clock3, CircleAlert } from "lucide-react";

import { IssueTabs } from "../ui/Issue/IssueTabs";

import styles from "./styles.module.scss";
import { OverdueLogWorkTable } from "../ui/Issue/IssueTable/OverdueLogWorkTable";

type OverdueTab = "overdue" | "warning" | "missing";

const STATUS_MAP = {
  overdue: "Overdue",
  warning: "Warning",
  missing: "Missing",
} as const;

const DEFAULT_PAGE_SIZE = 10;

const columns = [
  "Key",
  "Summary",
  "Assignee",
  "Issue Type",
  "End Date",
  "Status",
  "Actual Date",
];

export default function OverdueLogWork() {
  const {
    overdueLogWork,
    period,
    setPeriod,
    selectedProjects,
    fetchOverdueLogWork,
  } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<OverdueTab>("overdue");

  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [issueType, setIssueType] = useState("all");

  const [page, setPage] = useState(1);

  const [counts, setCounts] = useState({
    overdue: 0,
    warning: 0,
    missing: 0,
  });

  const selectedMonth = dayjs(period, "MM-YYYY").format("YYYY-MM");
  const tabs = [
    {
      key: "overdue",
      label: "Overdue",
      count: counts.overdue,
      icon: Clock3,
    },
    {
      key: "warning",
      label: "Warning",
      count: counts.warning,
      icon: AlertTriangle,
    },
    {
      key: "missing",
      label: "Missing",
      count: counts.missing,
      icon: CircleAlert,
    },
  ] as const;
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

    fetchOverdueLogWork(
      issueType === "all" ? null : issueType,
      STATUS_MAP[activeTab],
      2,
      userNameParam,
      page,
      DEFAULT_PAGE_SIZE,
    );
  }, [activeTab, issueType, page, period, selectedProjects, debouncedUsername]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, issueType, period]);

  useEffect(() => {
    if (!overdueLogWork) return;

    setCounts((prev) => ({
      ...prev,
      [activeTab]: overdueLogWork.issues.details.meta.total,
    }));
  }, [overdueLogWork, activeTab]);

  const issues = useMemo(
    () => overdueLogWork?.issues.details.list ?? [],
    [overdueLogWork],
  );

  const filteredIssues = useMemo(() => issues, [issues]);

  const meta = overdueLogWork?.issues.details.meta;

  const currentPage = meta?.current_page ?? page;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? filteredIssues.length;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleReset = () => {
    setSearch("");
    setIssueType("all");
    setPage(1);
  };

  const handleMonthChange = (month: string) => {
    if (!month) return;

    setPeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  return (
    <div className={styles.overdue}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Hall of Fame"
          title="Overdue Log Work"
          desc="Theo dõi các log work đã quá hạn và cần được cập nhật"
          variant="bug"
        />
      </header>

      <FilterBarUsernameType
        username={search}
        onUsernameChange={setSearch}
        usernamePlaceholder="Tìm theo tên nhân viên"
        resultCount={totalResults}
        onReset={handleReset}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />

      <div className={styles.tabsSection}>
        <IssueTabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />
        <OverdueLogWorkTable
          title={`${STATUS_MAP[activeTab]} Issues`}
          columns={columns}
          issues={filteredIssues}
        />
        <PaginationBar
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
