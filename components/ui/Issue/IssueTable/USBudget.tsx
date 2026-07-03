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
            <td className={styles.td}>{item.key}</td>
            <td className={styles.td}>{item.summary}</td>
            <td className={styles.td}>{item.assignee}</td>
            <td className={styles.td}>
              <PriorityBadge priority={item.issuetype} />
            </td>
            <td className={styles.td}>{item.slsx}</td>
            <td className={styles.td}>{item.sumSLSXSubTask}</td>
            <td className={styles.td}>{item.ratioSLSX}</td>
          </tr>
        ))
      )}
    </TableWrapper>
  );
}
