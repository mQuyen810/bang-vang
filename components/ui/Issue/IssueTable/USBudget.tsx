import { PriorityBadge } from "../PriorityBadge";
import { TableWrapper } from "./TableWrapper";

import type { USBudget } from "@/types/dashboard";

import styles from "./styles.module.scss";

interface Props {
  title: string;
  columns: string[];
  issues: USBudget[];
}

export function USBudgetTable({ title, columns, issues }: Props) {
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
              <span className={styles.idCell}>{item.key}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.summaryCell}>{item.summary}</span>
            </td>
            <td className={styles.td}>
              <span className={styles.otherCell}>{item.assignee}</span>
            </td>
            <td className={styles.td}>
              <PriorityBadge priority={item.issuetype} />
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
