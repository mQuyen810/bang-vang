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

const columns = ["STT", "Mã Phiếu", "Milestone", "Loại Issue"];

export default function Milestone() {
  const { milestones, milestonesPeriod, fetchMilestones, setMilestonesPeriod } =
    useIssuePeriodStore();

  // giữ để refetch khi thay đổi project filter
  const { selectedProjects } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<MilestoneTab>("missing");
  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [issueType, setIssueType] = useState("all");
  const [page, setPage] = useState(1);

  const selectedMonth = dayjs(milestonesPeriod, "MM-YYYY").format("YYYY-MM");

  const tabs = [
    {
      key: "missing" as const,
      label: "Thiếu Milestone",
      count:
        activeTab === "missing" ? (milestones?.issues.details.meta?.total ?? 0) : 0,
      icon: Clock3,
    },
    {
      key: "exception" as const,
      label: "Ngoại lệ",
      count:
        activeTab === "exception"
          ? (milestones?.issues.details.meta?.total ?? 0)
          : 0,
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
      ticketCode: userNameParam,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [
    activeTab,
    issueType,
    page,
    milestonesPeriod,
    selectedProjects,
    debouncedUsername,
    fetchMilestones,
  ]);

  const issues = useMemo(
    () => milestones?.issues.details.list ?? [],
    [milestones],
  );

  const meta = milestones?.issues.details.meta;
  const currentPage = meta?.current_page ?? page;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? issues.length;

  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab as MilestoneTab);
    setPage(1);
  };

  const handleIssueTypeChange = (value: string) => {
    setIssueType(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setIssueType("all");
    setPage(1);
  };

  const handleMonthChange = (month: string) => {
    if (!month) return;
    setPage(1);
    setMilestonesPeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  return (
    <div className={styles.overdue}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Thống kê"
          title="Milestone Missing"
          desc="Theo dõi các Milestone đang thiếu trong tháng"
          variant="bug"
        />
      </header>

      <FilterBarUsernameType
        username={search}
        onUsernameChange={handleSearchChange}
        usernamePlaceholder="Tìm theo mã phiếu"
        resultCount={totalResults}
        onReset={handleReset}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />

      <div className={styles.tabsSection}>
        <IssueTabs activeTab={activeTab} tabs={tabs} onChange={handleTabChange} />

        <MilestonesTable
          title={
            activeTab === "missing" ? "Missing Issues" : "Exception Issues"
          }
          columns={columns}
          issues={issues}
          startIndex={(currentPage - 1) * DEFAULT_PAGE_SIZE}
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
