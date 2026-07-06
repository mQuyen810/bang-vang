import { motion } from "framer-motion";

import { StatusBadge } from "../StatusBadge";
import { PriorityBadge } from "../PriorityBadge";
import { AlertBadge } from "../IssueTypeBadge";

import type { OverdueIssue } from "@/types/dashboard";
import type { OverdueLogWorkIssue } from "@/types/dashboard";

import styles from "./styles.module.scss";

type Issue = OverdueIssue | OverdueLogWorkIssue;

interface IssueTableProps {
  title: string;
  columns: string[];
  issues: Issue[];
}

export function IssueTable({ title, columns, issues }: IssueTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.tabContent}
    >
      <div className={`${styles.dataTable} glass-card`}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>{title}</h3>
          <span className={styles.tableCount}>{issues.length} mục</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c} className={styles.th}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.emptyCell}>
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.idCell}>{item.key}</span>
                    </td>

                    <td className={styles.td}>
                      <span className={styles.summaryCell}>{item.summary}</span>
                    </td>

                    <td className={styles.td}>
                      <span className={styles.otherCell}>{item.assignee}</span>
                    </td>

                    <td className={styles.td}>
                      {/* Badge Issue Type */}
                      <PriorityBadge priority={item.issuetype} />
                    </td>

                    <td className={styles.td}>
                      <span className={styles.otherCell}>{item.enddate}</span>
                    </td>

                    <td className={styles.td}>
                      {/* Badge Status */}
                      <StatusBadge status={item.status} />
                    </td>

                    <td className={styles.td}>
                      <AlertBadge text={item.statusText} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
