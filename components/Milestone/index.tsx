"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";

import { AlertTriangle, Clock3 } from "lucide-react";

import { IssueTabs } from "../ui/Issue/IssueTabs";
import { MilestonesTable } from "../ui/Issue/IssueTable/MilestonesTable";

import styles from "./styles.module.scss";

type MilestoneTab = "missing" | "exception";

const DEFAULT_PAGE_SIZE = 10;

const columns = ["ID", "Ticket Code", "Milestone", "Report Type"];

export default function Milestone() {
  const { milestones, period, fetchMilestones, setPeriod } =
    useIssuePeriodStore();

  // giữ để refetch khi thay đổi project filter
  const { selectedProjects } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<MilestoneTab>("missing");
  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [issueType, setIssueType] = useState("all");
  const [page, setPage] = useState(1);

  const [countsByReportType, setCountsByReportType] = useState<{
    MISSING: number;
    EXCEPTION: number;
  }>({
    MISSING: 0,
    EXCEPTION: 0,
  });

  const selectedMonth = dayjs(period, "MM-YYYY").format("YYYY-MM");

  const tabs = [
    {
      key: "missing" as const,
      label: "Thiếu cập nhật",
      count: countsByReportType.MISSING,
      icon: Clock3,
    },
    {
      key: "exception" as const,
      label: "Ngoại lệ",
      count: countsByReportType.EXCEPTION,
      icon: AlertTriangle,
    },
  ];

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedUsername(search.trim() ? search.trim() : "");
    }, 500);

    return () => window.clearTimeout(t);
  }, [search]);

  const pageToFetch = 1;

  useEffect(() => {
    const userNameParam = debouncedUsername ? debouncedUsername : null;

    fetchMilestones({
      report_type: activeTab === "missing" ? "MISSING" : "EXCEPTION",
      issuetype: issueType === "all" ? null : issueType,
      userName: userNameParam,
      page: pageToFetch,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [
    activeTab,
    issueType,
    period,
    selectedProjects,
    debouncedUsername,
    fetchMilestones,
  ]);

  useEffect(() => {
    if (!milestones?.issues?.details?.meta) return;

    const total = milestones.issues.details.meta.total;
    const reportType: "MISSING" | "EXCEPTION" =
      activeTab === "missing" ? "MISSING" : "EXCEPTION";

    setCountsByReportType((prev) => ({
      ...prev,
      [reportType]: total,
    }));
  }, [milestones, activeTab]);

  const issues = useMemo(
    () => milestones?.issues.details.list ?? [],
    [milestones],
  );

  const meta = milestones?.issues.details.meta;
  const currentPage = meta?.current_page ?? page;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? issues.length;

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
          title="Thiếu milestone"
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
      />

      <div className={styles.tabsSection}>
        <IssueTabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />

        <MilestonesTable
          title={
            activeTab === "missing" ? "Missing Issues" : "Exception Issues"
          }
          columns={columns}
          issues={issues}
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
