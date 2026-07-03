import type { OverdueLogWorkIssue } from "@/types/dashboard";

import { AlertBadge } from "../IssueTypeBadge";
import { PriorityBadge } from "../PriorityBadge";
import { StatusBadge } from "../StatusBadge";
import { TableWrapper } from "./TableWrapper";
import styles from "./styles.module.scss";

interface Props {
  title: string;
  columns: string[];
  issues: OverdueLogWorkIssue[];
}

export function OverdueLogWorkTable({ title, columns, issues }: Props) {
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
            <td className={styles.td}>{item.key}</td>
            <td className={styles.td}>{item.summary}</td>
            <td className={styles.td}>{item.assignee}</td>
            <td className={styles.td}>
              <PriorityBadge priority={item.issuetype} />
            </td>
            <td className={styles.td}>{item.enddate}</td>
            <td className={styles.td}>
              <StatusBadge status={item.status} />
            </td>
            <td className={styles.td}>
              <AlertBadge text={item.statusText} />
            </td>
          </tr>
        ))
      )}
    </TableWrapper>
  );
}
