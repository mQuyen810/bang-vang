"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuesStore } from "@/stores/sync.store";

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
  "Mã",
  "Tóm tắt",
  "Người phụ trách",
  "Loại issue",
  "Ngày kết thúc",
  "Trạng thái",
  "Ngày thực tế",
];

export default function OverdueLogWork() {
  const {
    overdueLogWork,
    overdueLogWorkPeriod,
    fetchOverdueLogWork,
    setOverdueLogWorkPeriod,
  } = useIssuePeriodStore();
  const { selectedProjects } = useDashboardStore();
  const { syncTimestamp } = useIssuesStore();

  const [activeTab, setActiveTab] = useState<OverdueTab>("missing");

  const [search, setSearch] = useState("");

  const [issueType, setIssueType] = useState("all");

  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const meta = overdueLogWork?.issues.details.meta;
    const total = meta?.total ?? 0;
    // Chỉ dùng để hiển thị số tab; nếu meta chưa sẵn sàng thì giữ 0.
    // Vì dữ liệu list phụ thuộc activeTab, tổng cũng được lấy từ meta hiện tại.
    return {
      overdue: activeTab === "overdue" ? total : 0,
      warning: activeTab === "warning" ? total : 0,
      missing: activeTab === "missing" ? total : 0,
    };
  }, [overdueLogWork, activeTab]);

  const selectedMonth = dayjs(overdueLogWorkPeriod, "MM-YYYY").format(
    "YYYY-MM",
  );
  const tabs = [
    {
      key: "missing",
      label: "Thiếu Log Work",
      count: counts.missing,
      icon: CircleAlert,
    },
    {
      key: "warning",
      label: "Cảnh báo",
      count: counts.warning,
      icon: AlertTriangle,
    },
    // {
    //   key: "overdue",
    //   label: "Quá hạn",
    //   count: counts.overdue,
    //   icon: Clock3,
    // },
  ] as const;

  useEffect(() => {
    fetchOverdueLogWork({
      issuetype: issueType === "all" ? null : issueType,
      statusLogWork: STATUS_MAP[activeTab],
      table_id: 2,
      userName: null,
      page: 1,
      perPage: 1000,
    });
  }, [
    activeTab,
    issueType,
    overdueLogWorkPeriod,
    selectedProjects,
    syncTimestamp,
  ]);

  // When search or issueType changes, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [search, issueType]);

  const issues = useMemo(
    () => overdueLogWork?.issues.details.list ?? [],
    [overdueLogWork],
  );

  const filteredIssues = useMemo(() => {
    if (!search.trim()) return issues;
    const q = search.trim().toLowerCase();
    return issues.filter((item) => 
      item.key?.toLowerCase().includes(q) || 
      item.assignee?.toLowerCase().includes(q) ||
      (item as any).display_name?.toLowerCase().includes(q)
    );
  }, [issues, search]);

  const totalResults = filteredIssues.length;
  const totalPages = Math.ceil(totalResults / DEFAULT_PAGE_SIZE) || 1;

  const effectivePage = page > totalPages ? totalPages : page;
  const currentList = filteredIssues.slice((effectivePage - 1) * DEFAULT_PAGE_SIZE, effectivePage * DEFAULT_PAGE_SIZE);

  const handleReset = () => {
    setSearch("");
    setIssueType("all");
    setPage(1);
  };

  const handleMonthChange = (month: string) => {
    if (!month) return;

    setOverdueLogWorkPeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  return (
    <div className={styles.overdue}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Thống kê"
          title="Log Work"
          desc="Theo dõi các Log Work đã quá hạn và cần được cập nhật"
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
          title={
            activeTab === "overdue"
              ? "Quá hạn"
              : activeTab === "warning"
                ? "Cảnh báo"
                : "Thiếu Log Work"
          }
          columns={columns}
          issues={currentList}
          startIndex={(effectivePage - 1) * DEFAULT_PAGE_SIZE}
        />

        <PaginationBar
          page={effectivePage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
