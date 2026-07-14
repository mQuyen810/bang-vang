"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";
import { useDashboardStore } from "@/stores/dashboard.store";

import type { OverdueIssue } from "@/types/dashboard";
import { AlertTriangle, Clock3 } from "lucide-react";

import { IssueTabs } from "../ui/Issue/IssueTabs";
import { OverdueTable } from "../ui/Issue/IssueTable/OverdueTable";

import styles from "./styles.module.scss";

type OverdueTab = "overdue" | "warning";

const DEFAULT_PAGE_SIZE = 10;

const columns = [
  "Mã",
  "Tóm tắt",
  "Người phụ trách",
  "Loại issue",
  "Ngày kết thúc",
  "Trạng thái",
  "Ngày thực tế",
  "Ghi chú",
];

export default function Overdue() {
  const { overdue, overduePeriod, fetchOverdue, setOverduePeriod } =
    useIssuePeriodStore();
  const { selectedProjects } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<OverdueTab>("overdue");
  const [search, setSearch] = useState("");

  const [issueType, setIssueType] = useState("all");

  const [page, setPage] = useState(1);

  const selectedMonth = dayjs(overduePeriod, "MM-YYYY").format("YYYY-MM");

  const tabs = [
    {
      key: "overdue",
      label: "Quá hạn",
      icon: Clock3,
    },
    {
      key: "warning",
      label: "Cảnh báo",
      icon: AlertTriangle,
    },
  ] as const;

  useEffect(() => {
    fetchOverdue({
      issuetype: issueType === "all" ? null : issueType,
      status: activeTab === "overdue" ? "Overdue" : "Warning",
      table_id: 1,
      userName: null,
      page: 1,
      perPage: 1000,
    });
  }, [activeTab, issueType, overduePeriod, selectedProjects]);

  // Reset page to 1 when search/issueType change (removed to satisfy eslint rule)

  const issues = useMemo(() => overdue?.issues.details.list ?? [], [overdue]);

  const filteredIssues = useMemo(() => {
    if (!search.trim()) return issues;
    const q = search.trim().toLowerCase();
    return issues.filter(
      (item) =>
        item.key?.toLowerCase().includes(q) ||
        item.assignee?.toLowerCase().includes(q) ||
        item.display_name?.toLowerCase().includes(q),
    );
  }, [issues, search]);

  const totalResults = filteredIssues.length;
  const totalPages = Math.ceil(totalResults / DEFAULT_PAGE_SIZE) || 1;

  const effectivePage = page > totalPages ? totalPages : page;
  const currentList = filteredIssues.slice(
    (effectivePage - 1) * DEFAULT_PAGE_SIZE,
    effectivePage * DEFAULT_PAGE_SIZE,
  );

  const handleReset = () => {
    setSearch("");
    setIssueType("all");
    setPage(1);
  };

  const handleMonthChange = (month: string) => {
    if (!month) return;

    setOverduePeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  return (
    <div className={styles.overdue}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Thống kê"
          title="Issue quá hạn"
          desc="Theo dõi các Sub Task, Story, Milestone đã quá hạn và cảnh báo"
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
            label: "Loại",
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
          title={
            activeTab === "overdue"
              ? "Các issue quá hạn"
              : "Các issue cần cảnh báo"
          }
          columns={columns}
          issues={currentList}
          startIndex={(effectivePage - 1) * DEFAULT_PAGE_SIZE}
        />
        {totalResults > 0 && (
          <PaginationBar
            page={effectivePage}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
