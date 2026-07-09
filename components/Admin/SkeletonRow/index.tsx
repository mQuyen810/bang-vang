"use client";

import styles from "./styles.module.scss";

interface SkeletonRowProps {
  cols?: number;
}

export function SkeletonRow({ cols = 5 }: SkeletonRowProps) {
  return (
    <tr className={styles.row}>
      {Array.from({ length: cols }).map((_, index) => (
        <td key={index} className={styles.cell}>
          <div className={styles.skeleton} />
        </td>
      ))}
    </tr>
  );
}
