"use client";

import { useEffect, useMemo, useState } from "react";
import { App } from "antd";
import { Plus, RefreshCw, Search, X } from "lucide-react";

import { PaginationBar } from "@/components/Ranking/PaginationBar";
import { ConfirmDialog } from "@/components/Admin/CofirmDialog";
import { useAuthStore, isSuperAdmin } from "@/stores/auth.store";
import { useRoleStore } from "@/stores/role.store";
import type { Role } from "@/types/role";

import { RoleTable } from "./RoleTable";
import { RoleFormModal } from "./RoleFormModal";

import styles from "./styles.module.scss";

export default function Role() {
  const { message } = App.useApp();
  const { isAuthenticated } = useAuthStore();

  const { loading, roles, error, fetchRoles, deleteRole } = useRoleStore();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    queueMicrotask(() => setPage(1));
    void fetchRoles(debouncedSearch);
  }, [debouncedSearch, fetchRoles]);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const isSuperAdminUser = isAuthenticated ? isSuperAdmin() : false;

  const refresh = () => {
    void fetchRoles(debouncedSearch);
  };

  const pagedRoles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return roles.slice(start, start + pageSize);
  }, [roles, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(roles.length / pageSize) || 1;
  }, [roles.length]);

  const totalResults = roles.length;

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    roleId: 0,
    roleName: "",
  });

  const [modal, setModal] = useState<{ isOpen: boolean; role: Role | null }>({
    isOpen: false,
    role: null,
  });

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, roleId: 0, roleName: "" });
  };

  const handleDelete = (role: Role) => {
    setConfirmDialog({ isOpen: true, roleId: role.id, roleName: role.name });
  };

  const handleConfirmDelete = async () => {
    try {
      if (!confirmDialog.roleId || !confirmDialog.roleName) {
        message.error("Thiếu dữ liệu để xóa role");
        return;
      }

      await deleteRole(confirmDialog.roleId);
      message.success("Xóa role thành công!");
      await fetchRoles(debouncedSearch);
    } catch {
      message.error("Xóa role thất bại!");
    } finally {
      handleCloseDialog();
    }
  };

  const handleEdit = (role: Role) => {
    setModal({
      isOpen: true,
      role: {
        id: role.id,
        name: role.name,
        permissions: role.permissions || [],
      },
    });
  };

  const handleAdd = () => {
    setModal({ isOpen: true, role: null });
  };

  if (!isSuperAdminUser && isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.title}>Role</h1>
          <p className={styles.subtitle}>Quản lý danh sách vai trò hệ thống</p>
        </div>

        <div className={styles.headerActions}>
          <button onClick={refresh} className={styles.btnGhost}>
            <RefreshCw
              className={`${styles.icon} ${loading ? styles.spin : ""}`}
            />
            Refresh
          </button>

          <button
            className={styles.addBtn}
            onClick={handleAdd}
            aria-label="Thêm role"
            title="Thêm role"
          >
            <Plus size={16} className={styles.addIcon} />
            Thêm
          </button>
        </div>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.filterBody}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>TÌM KIẾM</label>
              <div className={styles.filterInput}>
                <Search className={styles.inputIcon} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm role"
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.resultCount}>{totalResults} kết quả</div>

            {search.trim() && (
              <button
                onClick={() => setSearch("")}
                className={styles.clearFilters}
              >
                <X className={styles.icon} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableArea}>
        <RoleTable
          roles={pagedRoles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {roles.length > 0 && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Xóa role"
        message={`Bạn có chắc chắn muốn xóa role "${confirmDialog.roleName}"?`}
        confirmLabel="Xóa"
        isDanger
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDialog}
      />

      {modal.isOpen && (
        <RoleFormModal
          role={modal.role}
          onClose={() => setModal({ isOpen: false, role: null })}
        />
      )}
    </div>
  );
}
