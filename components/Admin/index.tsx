"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Download,
  LogOut,
  Search,
  Plus,
  ChevronRight,
  Home,
  X,
} from "lucide-react";
import { message } from "antd";

import { useAuthStore, isSuperAdmin } from "@/stores/auth.store";
import { useAdminStore } from "@/stores/admin.store";
import { useAdminActionStore } from "@/stores/admin.action.store";

import { UserTable } from "./UserTable";
import { ConfirmDialog } from "./CofirmDialog";

import styles from "./styles.module.scss";

type Role = "admin" | "operator";

interface Filters {
  q: string;
  username: string;
  fullName: string;
  email: string;
  role: "all" | Role;
}

const EMPTY_FILTERS: Filters = {
  q: "",
  username: "",
  fullName: "",
  email: "",
  role: "all",
};

export default function Admin() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const { loadingManager, managerList, errorManager, fetchManagerList } =
    useAdminStore();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: 0,
    isAdmin: false,
    userName: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    const isSuper = isSuperAdmin();
    setIsSuperAdminUser(isSuper);

    if (!isSuper) {
      message.warning("Bạn không có quyền truy cập trang này!");
      router.replace("/dashboard");
      return;
    }
    const load = async () => {
      try {
        await fetchManagerList();
      } catch (error) {
        console.error("Failed to load manager list:", error);
      }
    };

    load();
  }, [isAuthenticated, fetchManagerList, router]);

  const filteredUsers = useMemo(() => {
    const keyword = filters.q.trim().toLowerCase();

    return managerList.filter((u) => {
      const matchKeyword =
        !keyword ||
        u.jira_username?.toLowerCase().includes(keyword) ||
        u.jira_display_name?.toLowerCase().includes(keyword);

      const matchUsername =
        !filters.username ||
        u.jira_username?.toLowerCase().includes(filters.username.toLowerCase());

      const matchFullName =
        !filters.fullName ||
        u.jira_display_name
          ?.toLowerCase()
          .includes(filters.fullName.toLowerCase());

      const matchRole =
        filters.role === "all" ||
        (filters.role === "admin" && u.is_admin) ||
        (filters.role === "operator" && !u.is_admin);

      return matchKeyword && matchUsername && matchFullName && matchRole;
    });
  }, [managerList, filters]);
  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  const handleLogout = async () => {
    await logout();
    message.success("Đăng xuất thành công!");
    router.push("/login");
  };

  const refresh = () => {
    setLoading(true);
    fetchManagerList();
    setTimeout(() => setLoading(false), 500);
  };

  const handleToggleAdmin = (id: number, isAdmin: boolean) => {
    const selectedUser = managerList?.find((u) => u.id === id);
    if (!selectedUser) return;

    setConfirmDialog({
      isOpen: true,
      userId: id,
      isAdmin,
      userName: selectedUser.jira_username,
    });
  };

  const { loadingAction, toggleAdmin } = useAdminActionStore();

  const handleConfirmToggleAdmin = async () => {
    try {
      if (!confirmDialog.userName) {
        message.error("Thiếu user_name để cập nhật quyền");
        return;
      }

      await toggleAdmin({
        user_name: confirmDialog.userName,
        is_admin: confirmDialog.isAdmin ? 0 : 1,
      });

      message.success("Cập nhật quyền thành công!");
      await fetchManagerList();
    } catch (error) {
      message.error("Cập nhật quyền thất bại!");
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      userId: 0,
      isAdmin: false,
      userName: "",
    });
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.subtitle}>
            Danh sách người dùng quản trị hệ thống
          </p>
        </div>

        <div className={styles.headerActions}>
          <button onClick={refresh} className={styles.btnGhost}>
            <RefreshCw
              className={`${styles.icon} ${loading ? styles.spin : ""}`}
            />
            Refresh
          </button>

          <button onClick={handleLogout} className={styles.btnGhost}>
            <LogOut className={styles.icon} />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className={styles.welcome}>
        <strong>Xin chào:</strong> {user?.display_name || "User"}
        {isSuperAdminUser && (
          <span className={styles.superAdminBadge}>Super Admin</span>
        )}
      </div>

      {errorManager && <div className={styles.error}>{errorManager}</div>}

      <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div className={styles.filterTitle}>
            <Search className={styles.filterIcon} />
            <span>Tìm kiếm người dùng</span>
          </div>
          {(filters.q ||
            filters.username ||
            filters.fullName ||
            filters.email ||
            filters.role !== "all") && (
            <button onClick={resetFilters} className={styles.clearFilters}>
              <X className={styles.icon} />
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className={styles.filterBody}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Tìm kiếm</label>
              <div className={styles.filterInput}>
                <Search className={styles.inputIcon} />
                <input
                  value={filters.q}
                  onChange={(e) =>
                    setFilters({ ...filters, q: e.target.value })
                  }
                  placeholder="Tìm kiếm theo username, tên hoặc email..."
                  className={styles.inputField}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Vai trò</label>
              <div className={styles.filterInput}>
                <select
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      role: e.target.value as Filters["role"],
                    })
                  }
                  className={styles.selectField}
                >
                  <option value="all">Tất cả</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Member</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <UserTable
          users={filteredUsers}
          loading={loadingManager}
          onToggleAdmin={handleToggleAdmin}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.isAdmin ? "Loại bỏ quyền Admin" : "Cấp quyền Admin"
        }
        message={
          confirmDialog.isAdmin
            ? `Bạn có chắc chắn muốn loại bỏ quyền Admin của "${confirmDialog.userName}"?`
            : `Bạn có chắc chắn muốn cấp quyền Admin cho "${confirmDialog.userName}"?`
        }
        confirmLabel={confirmDialog.isAdmin ? "Loại bỏ" : "Cấp quyền"}
        isDanger={confirmDialog.isAdmin}
        onConfirm={handleConfirmToggleAdmin}
        onCancel={handleCloseDialog}
      />
    </div>
  );
}
