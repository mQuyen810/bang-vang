"use client";

import React from "react";
import { Search, X, Calendar } from "lucide-react";
import { DatePicker, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import styles from "./styles.module.scss";

const { MonthPicker } = DatePicker;

export type SelectFilter = {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};

export type FilterBarUsernameTypeProps = {
  username: string;
  onUsernameChange: (v: string) => void;
  usernamePlaceholder?: string;

  selects?: SelectFilter[];

  resultCount?: number;
  onReset?: () => void;

  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
};

export const FilterBarUsernameType: React.FC<FilterBarUsernameTypeProps> = ({
  username,
  onUsernameChange,
  usernamePlaceholder = "Tìm theo username...",
  selects = [],
  resultCount,
  onReset,
  selectedMonth,
  onMonthChange,
}) => {
  const hasFilters =
    !!username ||
    selects.some((s) => s.value && s.value !== "all") ||
    !!selectedMonth;

  const handleMonthChange = (date: Dayjs | null) => {
    if (date && onMonthChange) {
      onMonthChange(date.format("YYYY-MM"));
      return;
    }
    onMonthChange?.("");
  };

  const monthValue = selectedMonth ? dayjs(selectedMonth) : null;

  return (
    <div className={`${styles.filterBar} glass-card`}>
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder={usernamePlaceholder}
            className={styles.searchInput}
          />
          {username && (
            <button
              onClick={() => onUsernameChange("")}
              className={styles.clearButton}
              aria-label="Xoá tìm kiếm"
            >
              <X />
            </button>
          )}
        </div>

        <div className={styles.filterControls}>
          {selects.map((select) => (
            <div key={select.key} className={styles.filterGroup}>
              <span className={styles.filterLabel}>{select.label}</span>
              <Select
                value={select.value}
                onChange={select.onChange}
                options={select.options}
                className={styles.filterSelect}
                classNames={{
                  popup: styles.filterSelectPopup
                }}
                size="middle"
              />
            </div>
          ))}

          {onMonthChange && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Tháng</span>
              <div className={styles.monthPickerWrapper}>
                <MonthPicker
                  value={monthValue}
                  onChange={handleMonthChange}
                  placeholder="Chọn tháng"
                  format="MM/YYYY"
                  className={styles.monthPicker}
                  classNames={{
                    popup: styles.monthPickerPopup
                  }}
                  suffixIcon={
                    <Calendar size={14} className={styles.calendarIcon} />
                  }
                  allowClear
                />
              </div>
            </div>
          )}

          {typeof resultCount === "number" && (
            <span className={styles.resultCount}>{resultCount} kết quả</span>
          )}

          {hasFilters && onReset && (
            <button onClick={onReset} className={styles.resetButton}>
              <X /> Xoá lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
