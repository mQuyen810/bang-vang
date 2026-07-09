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
];


const normalizeSearch = (value: string) => value.trim().toLowerCase();

export default function Overdue() {
  const { overdue, period, fetchOverdue, setPeriod } = useIssuePeriodStore();
  const { selectedProjects } = useDashboardStore();

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
      label: "Quá hạn",
      count: overdueCount,
      icon: Clock3,
    },
    {
      key: "warning",
      label: "Cần cảnh báo",
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

    fetchOverdue({
      issuetype: issueType === "all" ? null : issueType,
      status: activeTab === "overdue" ? "Overdue" : "Warning",


      table_id: 1,
      userName: userNameParam,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [activeTab, issueType, period, page, selectedProjects, debouncedUsername]);

  // Note: Avoid page/count resets inside useEffect to satisfy ESLint
  // `react-hooks/set-state-in-effect`.

  const issues = useMemo(() => overdue?.issues.details.list ?? [], [overdue]);



  const filteredIssues = useMemo(() => issues, [issues]);

  const meta = overdue?.issues.details.meta;

  const currentPage = meta?.current_page ?? page;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? filteredIssues.length;



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
          eyebrow="Vinh danh"
          title="Các issue quá hạn"

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
          title={activeTab === "overdue" ? "Các issue quá hạn" : "Các issue cần cảnh báo"}

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
