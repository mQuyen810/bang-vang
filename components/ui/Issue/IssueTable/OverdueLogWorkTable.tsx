import type { OverdueLogWorkIssue } from "@/types/dashboard";
import { AlertBadge } from "../IssueTypeBadge";
import { PriorityBadge } from "../PriorityBadge";
import { StatusBadge } from "../StatusBadge";
import { TableWrapper } from "./TableWrapper";
import styles from "./styles.module.scss";
import dayjs from "dayjs";

interface Props {
  title: string;
  columns: string[];
  issues: OverdueLogWorkIssue[];
  startIndex?: number;
}

export function OverdueLogWorkTable({
  title,
  columns,
  issues,
  startIndex = 0,
}: Props) {
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
              <span className={styles.otherCell}>
                {item.display_name || item.assignee}
              </span>
            </td>
            <td className={styles.td}>
              <PriorityBadge priority={item.issuetype} />
            </td>
            <td className={styles.td}>
              <span className={styles.otherCell}>
                {dayjs(item.enddate).format("DD/MM/YYYY")}
              </span>
            </td>
            <td className={styles.td}>
              <StatusBadge status={item.status} />
            </td>
            <td className={styles.td}>
              {/* @ts-expect-error item might not have statusText */}
              <AlertBadge text={item.statusText ?? ""} />
            </td>
          </tr>
        ))
      )}
    </TableWrapper>
  );
}
