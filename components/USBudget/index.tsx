"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { SectionHeader } from "@/components/Dashboard/Ranking/SectionHeader";
import { FilterBar } from "@/components/Ranking/FilterBar";
import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { IssueTable } from "../ui/Issue/IssueTable";

import { useDashboardStore } from "@/stores/dashboard.store";
import type { USBudget } from "@/types/dashboard";

import styles from "./styles.module.scss";
import { USBudgetTable } from "../ui/Issue/IssueTable/USBudget";

const DEFAULT_PAGE_SIZE = 10;

const columns = [
  "Key",
  "Summary",
  "Assignee",
  "Issue Type",
  "SLSX",
  "sumSLSXSubTask",
  "ratioSLSX",
];

const normalizeSearch = (value: string) => value.trim().toLowerCase();

const filterIssues = (items: USBudget[], search: string) => {
  const q = normalizeSearch(search);

  if (!q) return items;

  return items.filter((item) =>
    [
      item.key,
      item.summary,
      item.assignee,
      item.issuetype,
      item.slsx,
      item.sumSLSXSubTask,
      item.ratioSLSX,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
};

export default function USBudgetPage() {
  const { usBudget, period, selectedProjects, setPeriod, fetchUSBudget } =
    useDashboardStore();

  const [search, setSearch] = useState("");
  const [issueType, setIssueType] = useState("all");
  const [page, setPage] = useState(1);

  const selectedMonth = dayjs(period, "MM-YYYY").format("YYYY-MM");

  useEffect(() => {
    fetchUSBudget(null, page, DEFAULT_PAGE_SIZE);
  }, [page, period, selectedProjects]);

  useEffect(() => {
    setPage(1);
  }, [period, selectedProjects]);

  const issues = useMemo(() => {
    const list = usBudget?.issues.details.list ?? [];

    if (issueType === "all") return list;

    return list.filter((item) => item.issuetype === issueType);
  }, [usBudget, issueType]);

  const filteredIssues = useMemo(
    () => filterIssues(issues, search),
    [issues, search],
  );

  const meta = usBudget?.issues.details.meta;

  const currentPage = meta?.current_page ?? page;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? filteredIssues.length;

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
          title="US Budget"
          desc="Danh sách các issue vượt ngân sách."
          variant="bug"
        />
      </header>

      <FilterBar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Tìm theo key, summary, assignee..."
        resultCount={totalResults}
        onReset={handleReset}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        selects={[
          {
            key: "issueType",
            label: "Type",
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

      <USBudgetTable
        title="Budget Issues"
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
  );
}
