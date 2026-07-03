"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBar } from "@/components/Ranking/FilterBar";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useDashboardStore } from "@/stores/dashboard.store";
import type { OverdueIssue } from "@/types/dashboard";
import { AlertTriangle, Clock3 } from "lucide-react";

import { IssueTabs } from "../ui/Issue/IssueTabs";
import { OverdueTable } from "../ui/Issue/IssueTable/OverdueTable";

import styles from "./styles.module.scss";

type OverdueTab = "overdue" | "warning";

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

const filterIssues = (items: OverdueIssue[], search: string) => {
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

export default function Overdue() {
  const { overdue, period, selectedProjects, setPeriod, fetchOverdue } =
    useDashboardStore();

  const [activeTab, setActiveTab] = useState<OverdueTab>("overdue");
  const [search, setSearch] = useState("");
  const [issueType, setIssueType] = useState("all");

  const [page, setPage] = useState(1);

  const [overdueCount, setOverdueCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);

  const selectedMonth = dayjs(period, "MM-YYYY").format("YYYY-MM");
  const tabs = [
    {
      key: "overdue",
      label: "Overdue",
      count: overdueCount,
      icon: Clock3,
    },
    {
      key: "warning",
      label: "Warning",
      count: warningCount,
      icon: AlertTriangle,
    },
  ] as const;

  useEffect(() => {
    fetchOverdue(
      issueType === "all" ? null : issueType,
      activeTab === "overdue" ? "Overdue" : "Warning",
      1,
      null,
      page,
      DEFAULT_PAGE_SIZE,
    );
  }, [activeTab, issueType, period, page, selectedProjects]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, issueType, period]);

  useEffect(() => {
    if (!overdue) return;

    if (activeTab === "overdue") {
      setOverdueCount(overdue.issues.details.meta.total);
    } else {
      setWarningCount(overdue.issues.details.meta.total);
    }
  }, [overdue, activeTab]);

  const issues = useMemo(() => overdue?.issues.details.list ?? [], [overdue]);

  const filteredIssues = useMemo(
    () => filterIssues(issues, search),
    [issues, search],
  );

  const meta = overdue?.issues.details.meta;

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
          title="Overdue Issues"
          desc="Tổng hợp các issue quá hạn và cảnh báo theo tháng, project, trạng thái và loại issue."
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
        selects={[
          {
            key: "issueType",
            label: "Type",
            value: issueType,
            onChange: setIssueType,
            options: [
              { value: "all", label: "Tất cả" },
              { value: "Sub-task", label: "Sub-task" },
              { value: "Story", label: "Story" },
              { value: "Milestone", label: "Milestone" },
            ],
          },
        ]}
      />

      <div className={styles.tabsSection}>
        <IssueTabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />
        <OverdueTable
          title={activeTab === "overdue" ? "Overdue Issues" : "Warning Issues"}
          columns={columns}
          issues={filteredIssues}
        />
        {totalResults > 0 && (
          <PaginationBar
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
