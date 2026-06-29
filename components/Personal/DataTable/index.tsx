'use client';

import React from 'react';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import styles from './styles.module.scss';

interface DataTableProps {
  title: string;
  columns: string[];
  rows: (string | number)[][];
  priorityIdx?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  rows,
  priorityIdx,
}) => {
  return (
    <div className={`${styles.dataTable} glass-card`}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>{title}</h3>
        <span className={styles.tableCount}>{rows.length} mục</span>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} className={styles.th}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={styles.tr}>
                {row.map((cell, j) => (
                  <td key={j} className={styles.td}>
                    {j === 0 ? (
                      <span className={styles.idCell}>{cell}</span>
                    ) : j === priorityIdx ? (
                      <PriorityBadge priority={String(cell)} />
                    ) : j === columns.length - 1 ? (
                      <StatusBadge status={String(cell)} />
                    ) : (
                      <span className={j === 1 ? styles.summaryCell : styles.otherCell}>
                        {cell}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};