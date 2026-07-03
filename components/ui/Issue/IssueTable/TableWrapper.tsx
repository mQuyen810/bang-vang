import { motion } from "framer-motion";
import styles from "./styles.module.scss";

interface TableWrapperProps {
  title: string;
  columns: string[];
  count: number;
  children: React.ReactNode;
}

export function TableWrapper({
  title,
  columns,
  count,
  children,
}: TableWrapperProps) {
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
          <span className={styles.tableCount}>{count} mục</span>
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

            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
