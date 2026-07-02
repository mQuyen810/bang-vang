"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./styles.module.scss";

type PageToken = number | "...";

const getPages = (
  current: number,
  total: number,
  siblings = 1,
): PageToken[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: PageToken[] = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  pages.push(1);

  if (left > 2) {
    pages.push("...");
  }

  for (let i = left; i <= right; i += 1) {
    pages.push(i);
  }

  if (right < total - 1) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
};

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav aria-label="pagination" className={styles.pagination}>
      <button
        type="button"
        onClick={() => canPrev && onChange(page - 1)}
        className={`${styles.button} ${styles.idle} ${!canPrev ? styles.disabled : ""}`}
        aria-label="Previous page"
      >
        <ChevronLeft className={styles.icon} />
        <span className={styles.buttonLabel}>Trước</span>
      </button>

      <div className={styles.mobileSummary}>
        <span className={styles.current}>{page}</span>
        <span className={styles.separator}>/</span>
        <span>{totalPages}</span>
      </div>

      <div className={styles.pages}>
        {getPages(page, totalPages, 1).map((token, index) =>
          token === "..." ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={token}
              type="button"
              onClick={() => onChange(token)}
              aria-current={token === page ? "page" : undefined}
              className={`${styles.button} ${token === page ? styles.active : styles.idle}`}
            >
              {token}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => canNext && onChange(page + 1)}
        className={`${styles.button} ${styles.idle} ${!canNext ? styles.disabled : ""}`}
        aria-label="Next page"
      >
        <span className={styles.buttonLabel}>Sau</span>
        <ChevronRight className={styles.icon} />
      </button>
    </nav>
  );
};
