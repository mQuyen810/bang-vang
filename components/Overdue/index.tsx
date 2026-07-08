"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
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

export default function Overdue() {
  const { overdue, period, selectedProjects, setPeriod, fetchOverdue } =
    useDashboardStore();

  const [activeTab, setActiveTab] = useState<OverdueTab>("overdue");
  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

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
    const t = window.setTimeout(() => {
      setDebouncedUsername(search.trim() ? search.trim() : "");
    }, 500);

    return () => {
      window.clearTimeout(t);
    };
  }, [search]);

  useEffect(() => {
    const userNameParam = debouncedUsername ? debouncedUsername : null;

    fetchOverdue(
      issueType === "all" ? null : issueType,
      activeTab === "overdue" ? "Overdue" : "Warning",
      1,
      userNameParam,
      page,
      DEFAULT_PAGE_SIZE,
    );
  }, [activeTab, issueType, period, page, selectedProjects, debouncedUsername]);

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

  const filteredIssues = useMemo(() => issues, [issues]);

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
          desc="Theo dõi các issue đã quá hạn và cần xử lý"
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
