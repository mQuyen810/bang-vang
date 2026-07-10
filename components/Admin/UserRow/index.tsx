"use client";

import type { ManagerItem } from "@/types/admin";
import { RoleBadge } from "../RoleBadge";
import { ActionMenu } from "../ActionMenu";
import { Shield, ShieldOff } from "lucide-react";
import styles from "./styles.module.scss";

interface UserRowProps {
  index: number;
  user: ManagerItem;
  onToggleAdmin?: (id: number, isAdmin: boolean) => void;
  onDelete?: (id: number) => void;
}

export function UserRow({
  index,
  user,
  onToggleAdmin,
  onDelete,
}: UserRowProps) {
  const isAdmin = Boolean(user.is_admin);

  const handleToggleAdmin = () => {
    if (onToggleAdmin) {
      onToggleAdmin(user.id, isAdmin);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <div className={styles.rankNumber}>{index}</div>
      </td>
      <td className={styles.cell}>
        <span className={styles.username}>{user.jira_username}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.displayName}>{user.jira_display_name}</span>
      </td>
      <td className={styles.cell}>
        <RoleBadge isAdmin={isAdmin} />
      </td>
      <td className={`${styles.cell} ${styles.actionsCell}`}>
        <div className={styles.actionWrapper}>
          <button
            className={`${styles.actionBtn} ${isAdmin ? styles.removeAdmin : styles.grantAdmin}`}
            onClick={handleToggleAdmin}
            title={isAdmin ? "Loại bỏ quyền Admin" : "Cấp quyền Admin"}
          >
            {isAdmin ? (
              <>
                <ShieldOff className={styles.btnIcon} />
                <span>Loại bỏ Admin</span>
              </>
            ) : (
              <>
                <Shield className={styles.btnIcon} />
                <span>Cấp Admin</span>
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
