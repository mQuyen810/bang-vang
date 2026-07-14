"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { FilterBar } from "@/components/Ranking/FilterBar";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuesStore } from "@/stores/sync.store";

import styles from "./styles.module.scss";
import { USBudgetTable } from "../ui/Issue/IssueTable/USBudget";

const DEFAULT_PAGE_SIZE = 10;

const columns = [
  "Mã",
  "Tóm tắt",
  "Người phụ trách",
  "Loại issue",
  "Trạng thái",
  "Budget Story",
  "Budget Sub-task",
  "Vượt Budget",
];

const normalizeSearch = (value: string) => value.trim().toLowerCase();

export default function USBudgetPage() {
  const { selectedProjects } = useDashboardStore();
  const { usBudget, usBudgetPeriod, fetchUSBudget, setUsBudgetPeriod } =
    useIssuePeriodStore();
  const { syncTimestamp } = useIssuesStore();

  const [search, setSearch] = useState("");

  const [issueType, setIssueType] = useState("all");
  const [page, setPage] = useState(1);

  const selectedMonth = dayjs(usBudgetPeriod, "MM-YYYY").format("YYYY-MM");

  useEffect(() => {
    fetchUSBudget({
      userName: null,
      page: 1,
      perPage: 1000,
    });
  }, [usBudgetPeriod, selectedProjects, syncTimestamp]);

  // When search changes, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  const issues = useMemo(() => {
    const list = usBudget?.issues.details.list ?? [];

    if (issueType === "all") return list;

    return list.filter((item) => item.issuetype === issueType);
  }, [usBudget, issueType]);

  const filteredIssues = useMemo(() => {
    if (!search.trim()) return issues;
    const q = search.trim().toLowerCase();
    return issues.filter((item: any) => 
      item.key?.toLowerCase().includes(q) || 
      item.assignee?.toLowerCase().includes(q) ||
      item.display_name?.toLowerCase().includes(q)
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

    setUsBudgetPeriod(dayjs(month, "YYYY-MM").format("MM-YYYY"));
  };

  return (
    <div className={styles.overdue}>
      <header className={styles.header}>
        <SectionHeader
          eyebrow="Thống kê"
          title="US Budget"
          desc="Theo dõi các Story vượt ngân sách"
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

      <USBudgetTable
        title="Các issue vượt ngân sách"
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
  );
}
