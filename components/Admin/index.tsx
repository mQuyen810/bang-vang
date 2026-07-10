"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { App, Select } from "antd";
import {
  RefreshCw,
  LogOut,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PaginationBar } from "@/components/Ranking/PaginationBar";

// import { message } from "antd"; // Removed


import { useAuthStore, isSuperAdmin } from "@/stores/auth.store";
import { useAdminStore } from "@/stores/admin.store";
import { useAdminActionStore } from "@/stores/admin.action.store";

import { UserTable } from "./UserTable";
import { ConfirmDialog } from "./CofirmDialog";

import styles from "./styles.module.scss";

type Role = "admin" | "operator";

interface Filters {
  q: string;
  role: "all" | "1" | "0";
}

const EMPTY_FILTERS: Filters = {
  q: "",
  role: "all",
};

export default function Admin() {
  const { message } = App.useApp();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const { loadingManager, managerList, errorManager, fetchManagerList, pagination } =
    useAdminStore();

  const isSuperAdminUser = isAuthenticated ? isSuperAdmin() : false;

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Thêm useEffect để debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(filters.q);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.q]);

  // Load lại khi search hoặc role thay đổi
  useEffect(() => {
    // Luôn gửi cả role và username hiện tại khi call API
    // Kiểm tra và xử lý role = 'all' -> truyền undefined
    const roleParam = filters.role === 'all' ? undefined : filters.role;
    fetchManagerList(1, 10, roleParam, debouncedUsername);
  }, [filters.role, debouncedUsername, fetchManagerList]);


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

    if (!isSuper) {

      message.warning("Bạn không có quyền truy cập trang này!");
      router.replace("/dashboard");
      return;
    }
    const load = async () => {
      try {
        await fetchManagerList(1, 10, filters.role);
      } catch (error) {
        console.error("Failed to load manager list:", error);
      }
    };

    load();
  }, [isAuthenticated, fetchManagerList, router, filters.role]);

  const filteredUsers = useMemo(() => {
    return managerList;
  }, [managerList]);

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
    fetchManagerList(pagination.current, pagination.pageSize, filters.role).finally(() => setLoading(false));
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
      await fetchManagerList(pagination.current, pagination.pageSize, filters.role, debouncedUsername);
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
    <App>
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
        <div className={styles.filterBody}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>TÌM KIẾM</label>
              <div className={styles.filterInput}>
                <Search className={styles.inputIcon} />
                <input
                  value={filters.q}
                  onChange={(e) =>
                    setFilters({ ...filters, q: e.target.value })
                  }
                  placeholder="Tìm theo tên nhân viên"
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.filterGroupRole}>
              <label className={styles.filterLabel}>VAI TRÒ</label>
              <Select
                value={filters.role}
                onChange={(val) =>
                  setFilters({
                    ...filters,
                    role: val,
                  })
                }
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "1", label: "Admin" },
                  { value: "0", label: "Member" },
                ]}
                className={styles.filterSelect}
                popupClassName={styles.filterSelectPopup}
                size="middle"
              />
            </div>
            
            <div className={styles.resultCount}>
               {pagination.total} kết quả
            </div>

            {(filters.q || filters.role !== "all") && (
              <button onClick={resetFilters} className={styles.clearFilters}>
                <X className={styles.icon} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
        </div>


      <div className={styles.tableWrapper}>
        <UserTable
          users={managerList}
          loading={loadingManager}
          onToggleAdmin={handleToggleAdmin}
          startIndex={(pagination.current - 1) * pagination.pageSize}
        />
        <PaginationBar
            page={pagination.current}
            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
            onChange={(page) => fetchManagerList(page, pagination.pageSize, filters.role, debouncedUsername)}
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
    </App>
  );
}
