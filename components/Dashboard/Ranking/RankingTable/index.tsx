"use client";

import { RankRow } from "../RankRow";
import styles from "./styles.module.scss";

interface RankingTableProps {
  ranking: Array<{
    id: string;
    name: string;
    avatar: string;
    department: string;
    output: number;
    capacity: number;
    bugsResolved?: number;
  }>;
  startRank: number;
  metricLabel: string;
  variant?: "default" | "bug";
}

export function RankingTable({ 
  ranking, 
  startRank, 
  metricLabel, 
  variant = "default" 
}: RankingTableProps) {
  if (!ranking || ranking.length === 0) {
    return null;
  }

  return (
    <div className={styles.rankingTable}>
      <div className={styles.rankingTableHeader}>
        <h3 className={styles.rankingTableTitle}>
          Bảng xếp hạng {variant === "bug" ? "bug" : "sản lượng"}
        </h3>
        <span className={styles.rankingTableBadge}>
          Top {startRank} — Top {startRank + ranking.length - 1}
        </span>
      </div>
      
      <div className={styles.rankingTableBody}>
        {ranking.map((emp, i) => (
          <RankRow
            key={emp.id}
            rank={startRank + i}
            emp={emp}
            metricLabel={metricLabel}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}