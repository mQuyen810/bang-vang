"use client";

import type { Role } from "@/types/role";
import styles from "./styles.module.scss";

import { SkeletonRow } from "@/components/Admin/SkeletonRow";
import { RoleRow } from "../RoleRow";

export function RoleTable({
  roles,
  loading,
  onEdit,
  onDelete,
}: {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}) {
  if (loading) {
    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>TÊN VAI TRÒ</th>
              <th className={`${styles.th} ${styles.actionsTh}`}>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonRow key={idx} cols={3} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className={styles.tableWrap}>
        <div className={styles.empty}>Không có dữ liệu vai trò</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>STT</th>
            <th className={styles.th}>TÊN VAI TRÒ</th>
            <th className={`${styles.th} ${styles.actionsTh}`}>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <RoleRow
              key={role.id}
              role={role}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
