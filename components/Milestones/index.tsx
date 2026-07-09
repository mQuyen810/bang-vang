"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { IssueTabs } from "@/components/ui/Issue/IssueTabs";
import { MilestonesTable } from "@/components/ui/Issue/IssueTable/MilestonesTable";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";

import type { OverdueLogWorkIssue as MilestoneIssue } from "@/types/dashboard";

import { AlertTriangle, CircleAlert } from "lucide-react";

import styles from "./styles.module.scss";

type MilestoneTab = "missing" | "exception";

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

export default function Milestones() {
  const { milestones, period, fetchMilestones, setPeriod } =
    useIssuePeriodStore();
  const { selectedProjects } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<MilestoneTab>("missing");
  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [issueType, setIssueType] = useState("all");
  const [page, setPage] = useState(1);

  const selectedMonth = dayjs(period, "MM-YYYY").format("YYYY-MM");

  const tabs = useMemo(
    () =>
      [
        {
          key: "missing" as const,
          label: "Missing",
          count: milestones?.issues.details.meta.total ?? 0,
          icon: CircleAlert,
        },
        {
          key: "exception" as const,
          label: "Exception",
          count: milestones?.issues.details.meta.total ?? 0,
          icon: AlertTriangle,
        },
      ] as const,
    [milestones],
  );

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

    const status = activeTab === "missing" ? "Missing" : "Exception";

    fetchMilestones({
      issuetype: issueType === "all" ? null : issueType,
      status,
      table_id: 3,
      userName: userNameParam,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [
    activeTab,
    issueType,
    page,
    period,
    selectedProjects,
    debouncedUsername,
    fetchMilestones,
  ]);

  const issues = useMemo(() => milestones?.issues.details.list ?? [], [
    milestones,
  ]);

  const meta = milestones?.issues.details.meta;

  const currentPage = meta?.current_page ?? page;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? issues.length;

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
    <div className={styles.milestones}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Vinh danh"
          title="Các issue milestone"
          desc="Theo dõi milestone có trạng thái Missing/Exception"
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

        <MilestonesTable
          title={activeTab === "missing" ? "Milestones Missing" : "Milestones Exception"}
          columns={columns}
          issues={issues as MilestoneIssue[]}
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

