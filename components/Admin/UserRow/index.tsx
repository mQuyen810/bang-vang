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
  currentUserDisplayName?: string | null;
}

export function UserRow({
  index,
  user,
  onToggleAdmin,
  onDelete,
  currentUserDisplayName,
}: UserRowProps) {
  const isAdmin = Boolean(user.super_admin);
  const isSelf = Boolean(
    currentUserDisplayName && user.jira_display_name === currentUserDisplayName,
  );

  const handleToggleAdmin = () => {
    if (isSelf) return;
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
        <RoleBadge isAdmin={isAdmin} roleName={user.role_name} />
      </td>
      {!isSelf && (
        <td className={`${styles.cell} ${styles.actionsCell}`}>
          <div className={styles.actionWrapper}>
            <button
              className={`${styles.actionBtn} ${isAdmin ? styles.removeAdmin : styles.grantAdmin}`}
              onClick={handleToggleAdmin}
              title={isAdmin ? "Loại bỏ quyền cao nhất" : "Cấp quyền cao nhất"}
              disabled={!onToggleAdmin}
              style={{ opacity: !onToggleAdmin ? 0.6 : 1 }}
            >
              {isAdmin ? (
                <>
                  <ShieldOff className={styles.btnIcon} />
                  <span>Loại bỏ quyền cao nhất</span>
                </>
              ) : (
                <>
                  <Shield className={styles.btnIcon} />
                  <span>Cấp quyền cao nhất</span>
                </>
              )}
            </button>
          </div>
        </td>
      )}
      {isSelf && <td className={`${styles.cell} ${styles.actionsCell}`} />}
    </tr>
  );
}
