"use client";

import type { ManagerItem } from "@/types/admin";
import { UserRow } from "../UserRow";
import { SkeletonRow } from "../SkeletonRow";
import { EmptyState } from "../EmptyState";
import styles from "./styles.module.scss";

interface UserTableProps {
  users: ManagerItem[] | undefined;
  loading: boolean;
  onToggleAdmin?: (id: number, isAdmin: boolean) => void;
  startIndex?: number;
}

export function UserTable({ users, loading, onToggleAdmin, startIndex = 0 }: UserTableProps) {
  const hasUsers = users && Array.isArray(users) && users.length > 0;

  if (loading) {
    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>STT</th>
              <th className={styles.th}>USERNAME</th>
              <th className={styles.th}>TÊN NHÂN VIÊN</th>
              <th className={styles.th}>VAI TRÒ</th>
              <th className={`${styles.th} ${styles.actionsTh}`}>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index} cols={6} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!hasUsers) {
    return (
      <div className={styles.tableWrap}>
        <EmptyState message="Không có dữ liệu người dùng" />
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>STT</th>
              <th className={styles.th}>USERNAME</th>
              <th className={styles.th}>TÊN NHÂN VIÊN</th>
              <th className={styles.th}>VAI TRÒ</th>
              <th className={`${styles.th} ${styles.actionsTh}`}>HÀNH ĐỘNG</th>
            </tr>

        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              index={startIndex + index + 1}
              user={user}
              onToggleAdmin={onToggleAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
