import { PriorityBadge } from "../PriorityBadge";
import { TableWrapper } from "./TableWrapper";
import { StatusBadge } from "../StatusBadge";

import type { USBudget } from "@/types/dashboard";

import styles from "./styles.module.scss";

interface Props {
  title: string;
  columns: string[];
  issues: USBudget[];
  startIndex?: number;
}

export function USBudgetTable({ title, columns, issues, startIndex = 0 }: Props) {
  return (
    <TableWrapper title={title} columns={columns} count={issues.length}>
      {issues.length === 0 ? (
        <tr>
          <td colSpan={columns.length} className={styles.emptyCell}>
            Không có dữ liệu.
          </td>
        </tr>
      ) : (
        issues.map((item, index) => (
          <tr key={item.id} className={styles.tr}>
            <td className={styles.td}>
              <div className={styles.rankNumber}>{startIndex + index + 1}</div>
            </td>
            <td className={styles.td}>
              <a 
                href={`https://jira.viettelsoftware.com/browse/${item.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.idCell}
              >
                {item.key}
              </a>
            </td>
            <td className={styles.td}>
              <span className={styles.summaryCell}>{item.summary}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.otherCell}>{item.display_name || item.assignee}</span>
            </td>
            <td className={styles.td}>
              <PriorityBadge priority={item.issuetype} />
            </td>
            <td className={styles.td}>
              <StatusBadge status={item.status} />
            </td>
            <td className={styles.td}>
              <span className={styles.numberCell}>{item.slsx}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.numberCell}>{item.sumSLSXSubTask}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.numberCell}>{item.ratioSLSX}</span>
            </td>
          </tr>
        ))
      )}
    </TableWrapper>
  );
}
