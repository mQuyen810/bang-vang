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
import { OverdueTable } from "../ui/Issue/IssueTable/OverdueTable";

import styles from "./styles.module.scss";

type MilestoneTab = "missing" | "exception";

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

  const [missingCount, setMissingCount] = useState(0);
  const [exceptionCount, setExceptionCount] = useState(0);

  const selectedMonth = dayjs(period, "MM-YYYY").format("YYYY-MM");

  const tabs = [
    {
      key: "missing" as const,
      label: "Missing",
      count: missingCount,
      icon: Clock3,
    },
    {
      key: "exception" as const,
      label: "Exception",
      count: exceptionCount,
      icon: AlertTriangle,
    },
  ];

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedUsername(search.trim() ? search.trim() : "");
    }, 500);

    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const userNameParam = debouncedUsername ? debouncedUsername : null;

    fetchMilestones({
      report_type: activeTab === "missing" ? "MISSING" : "EXCEPTION",
      issuetype: issueType === "all" ? null : issueType,
      userName: userNameParam,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [
    activeTab,
    issueType,
    period,
    page,
    selectedProjects,
    debouncedUsername,
    fetchMilestones,
  ]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, issueType, period]);

  useEffect(() => {
    if (!milestones) return;

    if (activeTab === "missing") {
      setMissingCount(milestones.issues.details.meta.total);
    } else {
      setExceptionCount(milestones.issues.details.meta.total);
    }
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
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const filteredIssues = useMemo(() => issues, [issues]);

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

        <OverdueTable
          title={
            activeTab === "missing" ? "Missing Issues" : "Exception Issues"
          }
          columns={columns}
          issues={filteredIssues as any}
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
