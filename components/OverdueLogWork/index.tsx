"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBar } from "@/components/Ranking/FilterBar";
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

const normalizeSearch = (value: string) => value.trim().toLowerCase();

const filterIssues = (items: OverdueLogWorkIssue[], search: string) => {
  const q = normalizeSearch(search);

  if (!q) return items;

  return items.filter((item) =>
    [
      item.key,
      item.summary,
      item.assignee,
      item.issuetype,
      item.status,
      item.statusText,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
};

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
    fetchOverdueLogWork(
      issueType === "all" ? null : issueType,
      STATUS_MAP[activeTab],
      2,
      null,
      page,
      DEFAULT_PAGE_SIZE,
    );
  }, [activeTab, issueType, page, period, selectedProjects]);

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

  const filteredIssues = useMemo(
    () => filterIssues(issues, search),
    [issues, search],
  );

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
          desc="Tổng hợp các issue Overdue, Warning và Missing Log Work."
          variant="bug"
        />
      </header>

      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Tìm theo key, summary, assignee..."
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
