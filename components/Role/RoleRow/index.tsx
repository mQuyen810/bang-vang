"use client";

import type { Role } from "@/types/role";
import { Pencil, Trash2 } from "lucide-react";

import styles from "./styles.module.scss";

interface RoleRowProps {
  role: Role;
  index: number;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleRow({ role, index, onEdit, onDelete }: RoleRowProps) {
  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <span className={styles.index}>{index + 1}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.name}>{role.name}</span>
      </td>
      <td className={`${styles.cell} ${styles.actionsCell}`}>
        <div className={styles.actionWrapper}>
          <button
            className={styles.iconBtn}
            onClick={() => onEdit(role)}
            title="Sửa"
            aria-label="Sửa role"
          >
            <Pencil className={styles.icon} />
          </button>

          <button
            className={`${styles.iconBtn} ${styles.danger}`}
            onClick={() => onDelete(role)}
            title="Xóa"
            aria-label="Xóa role"
          >
            <Trash2 className={styles.icon} />
          </button>
        </div>
      </td>
    </tr>
  );
}
