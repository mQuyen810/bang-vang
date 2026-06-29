'use client';

import React from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import styles from './styles.module.scss';

const { MonthPicker } = DatePicker;

export type SelectFilter = {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder?: string;
  selects?: SelectFilter[];
  resultCount?: number;
  onReset?: () => void;
  // Thêm props cho month picker
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearch,
  searchPlaceholder = "Tìm kiếm...",
  selects = [],
  resultCount,
  onReset,
  selectedMonth,
  onMonthChange,
}) => {
  const hasFilters = !!search || selects.some((s) => s.value && s.value !== "all") || !!selectedMonth;

  // Xử lý change month
  const handleMonthChange = (date: Dayjs | null) => {
    if (date && onMonthChange) {
      onMonthChange(date.format('YYYY-MM'));
    } else if (onMonthChange) {
      onMonthChange('');
    }
  };

  // Parse selected month to Dayjs
  const monthValue = selectedMonth ? dayjs(selectedMonth) : null;

  return (
    <div className={`${styles.filterBar} glass-card`}>
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className={styles.clearButton}
              aria-label="Xoá tìm kiếm"
            >
              <X />
            </button>
          )}
        </div>

        <div className={styles.filterControls}>
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
                  popupClassName={styles.monthPickerPopup}
                  suffixIcon={<Calendar size={14} className={styles.calendarIcon} />}
                  allowClear
                />
              </div>
            </div>
          )}

          {/* Result Count */}
          {typeof resultCount === "number" && (
            <span className={styles.resultCount}>
              {resultCount} kết quả
            </span>
          )}

          {/* Reset Button */}
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