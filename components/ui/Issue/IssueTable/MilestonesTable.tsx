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
  startIndex?: number;
}

export function MilestonesTable({ title, columns, issues, startIndex = 0 }: Props) {
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
              <a 
                href={`https://jira.viettelsoftware.com/issues/?jql=issuetype%20%3D%20Milestone%20AND%20text%20~%20%22${item.ticket_code}%22%20ORDER%20BY%20updated%20DESC`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.idCell}
              >
                {item.ticket_code}
              </a>
            </td>
            <td className={styles.td}>
              <span className={styles.summaryCell}>{item.milestone_name}</span>
            </td>
            <td className={styles.td}>
              <PriorityBadge priority="Milestone" />
            </td>
          </tr>
        ))
      )}
    </TableWrapper>
  );
}
