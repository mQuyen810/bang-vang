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

const columns = ["Mã Phiếu", "Milestone", "Loại Issue"];

export default function Milestone() {
  const { milestones, milestonesPeriod, fetchMilestones, setMilestonesPeriod } =
    useIssuePeriodStore();

  // giữ để refetch khi thay đổi project filter
  const { selectedProjects } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<MilestoneTab>("missing");
  const [search, setSearch] = useState("");

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
    fetchMilestones({
      report_type: activeTab === "missing" ? "MISSING" : "EXCEPTION",
      issuetype: issueType === "all" ? null : issueType,
      ticketCode: null,
      page: 1,
      perPage: 1000,
    });
  }, [
    activeTab,
    issueType,
    milestonesPeriod,
    selectedProjects,
    fetchMilestones,
  ]);

  const issues = useMemo(() => {
    const list = milestones?.issues.details.list ?? [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((item) => 
      item.ticket_code?.toLowerCase().includes(q) || 
      item.milestone_name?.toLowerCase().includes(q)
    );
  }, [milestones, search]);

  const totalResults = issues.length;
  const totalPages = Math.ceil(totalResults / DEFAULT_PAGE_SIZE) || 1;
  const effectivePage = page > totalPages ? totalPages : page;
  const currentList = issues.slice((effectivePage - 1) * DEFAULT_PAGE_SIZE, effectivePage * DEFAULT_PAGE_SIZE);

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
