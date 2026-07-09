import type { MilestoneIssue } from "@/types/dashboard";

import { AlertBadge } from "../IssueTypeBadge";
import { PriorityBadge } from "../PriorityBadge";
import { StatusBadge } from "../StatusBadge";
import { TableWrapper } from "./TableWrapper";
import styles from "./styles.module.scss";

interface Props {
  title: string;
  columns: string[];
  issues: MilestoneIssue[];
}

export function MilestonesTable({ title, columns, issues }: Props) {
  return (
    <TableWrapper title={title} columns={columns} count={issues.length}>
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
              <span className={styles.idCell}>{item.id}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.idCell}>{item.ticket_code}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.summaryCell}>{item.milestone_name}</span>
            </td>
            <td className={styles.td}>
              <PriorityBadge priority={item.report_type} />
            </td>
          </tr>
        ))
      )}
    </TableWrapper>
  );
}
