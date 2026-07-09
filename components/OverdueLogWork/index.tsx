"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";
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

  const [activeTab, setActiveTab] = useState<OverdueTab>("overdue");

  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

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
      key: "overdue",
      label: "Quá hạn",
      count: counts.overdue,
      icon: Clock3,
    },
    {
      key: "warning",
      label: "Cần cảnh báo",
      count: counts.warning,
      icon: AlertTriangle,
    },
    {
      key: "missing",
      label: "Thiếu cập nhật",
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

    fetchOverdueLogWork({
      issuetype: issueType === "all" ? null : issueType,
      statusLogWork: STATUS_MAP[activeTab],
      table_id: 2,
      userName: userNameParam,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [
    activeTab,
    issueType,
    page,
    overdueLogWorkPeriod,
    selectedProjects,
    debouncedUsername,
  ]);

  const issues = useMemo(
    () => overdueLogWork?.issues.details.list ?? [],
    [overdueLogWork],
  );

  const filteredIssues = useMemo(() => issues, [issues]);

  const meta = overdueLogWork?.issues.details.meta;

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

    setOverdueLogWorkPeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  return (
    <div className={styles.overdue}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Vinh danh"
          title="Quá hạn log work"
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
          title={
            activeTab === "overdue"
              ? "Quá hạn"
              : activeTab === "warning"
                ? "Cần cảnh báo"
                : "Thiếu cập nhật"
          }
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
