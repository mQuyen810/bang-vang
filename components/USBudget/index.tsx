"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBarUsernameType } from "@/components/ui/Leaderboard/FilterBarUsernameType";
import { FilterBar } from "@/components/Ranking/FilterBar";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { useIssuePeriodStore } from "@/stores/issuePeriod.store";
import { useDashboardStore } from "@/stores/dashboard.store";

import styles from "./styles.module.scss";
import { USBudgetTable } from "../ui/Issue/IssueTable/USBudget";

const DEFAULT_PAGE_SIZE = 10;

const columns = [
  "STT",
  "Mã",
  "Tóm tắt",
  "Người phụ trách",
  "Loại issue",
  "Trạng thái",
  "Ngân sách Story",
  "Ngân sách Sub-task",
  "Vượt ngân sách",
];

const normalizeSearch = (value: string) => value.trim().toLowerCase();

export default function USBudgetPage() {
  const { selectedProjects } = useDashboardStore();
  const { usBudget, usBudgetPeriod, fetchUSBudget, setUsBudgetPeriod } =
    useIssuePeriodStore();

  const [search, setSearch] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [issueType, setIssueType] = useState("all");
  const [page, setPage] = useState(1);

  const selectedMonth = dayjs(usBudgetPeriod, "MM-YYYY").format("YYYY-MM");

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

    fetchUSBudget({
      userName: userNameParam,
      page,
      perPage: DEFAULT_PAGE_SIZE,
    });
  }, [page, usBudgetPeriod, selectedProjects, debouncedUsername]);

  const issues = useMemo(() => {
    const list = usBudget?.issues.details.list ?? [];

    if (issueType === "all") return list;

    return list.filter((item) => item.issuetype === issueType);
  }, [usBudget, issueType]);

  const filteredIssues = useMemo(() => issues, [issues]);

  const meta = usBudget?.issues.details.meta;

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
        issues={filteredIssues}
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
  );
}
