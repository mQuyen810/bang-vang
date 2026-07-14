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

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Removed duplicate fetchManagerList on filter change

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedUsername, filters.role]);

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
        await fetchManagerList(1, 1000);
      } catch (error) {
        console.error("Failed to load manager list:", error);
      }
    };

    load();
  }, [isAuthenticated, fetchManagerList, router]);

  const filteredUsers = useMemo(() => {
    let list = managerList;

    // Ẩn tài khoản "admin"
    list = list.filter((item) => item.jira_username?.toLowerCase() !== "admin");

    if (filters.role !== "all") {
      const isSuper = filters.role === "1" ? 1 : 0;
      list = list.filter((item) => item.super_admin === isSuper);
    }

    if (debouncedUsername.trim()) {
      const q = debouncedUsername.trim().toLowerCase();
      list = list.filter((item) => 
        item.jira_username?.toLowerCase().includes(q) || 
        item.jira_display_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [managerList, debouncedUsername, filters.role]);

  const totalResults = filteredUsers.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;
  const effectivePage = page > totalPages ? totalPages : page;
  const currentList = filteredUsers.slice((effectivePage - 1) * pageSize, effectivePage * pageSize);

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
    fetchManagerList(1, 1000).finally(() => setLoading(false));
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
        super_admin: confirmDialog.isAdmin ? 0 : 1,
      });

      message.success("Cập nhật quyền thành công!");
      await fetchManagerList(1, 1000);
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
                  { value: "1", label: "Super Admin" },
                  { value: "0", label: "User" },
                ]}
                className={styles.filterSelect}
                classNames={{ popup: { root: styles.filterSelectPopup } }}
                size="large"
              />
            </div>
            
            <div className={styles.resultCount}>
               {totalResults} kết quả
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
          users={currentList}
          loading={loadingManager}
          onToggleAdmin={handleToggleAdmin}
          startIndex={(effectivePage - 1) * pageSize}
        />
        {totalResults > 0 && (
          <PaginationBar
            page={effectivePage}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}
      </div>


        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={
            confirmDialog.isAdmin ? "Loại bỏ quyền cao nhất" : "Cấp quyền cao nhất"
          }
          message={
            confirmDialog.isAdmin
              ? `Bạn có chắc chắn muốn loại bỏ quyền cao nhất của "${confirmDialog.userName}"?`
              : `Bạn có chắc chắn muốn cấp quyền cao nhất cho "${confirmDialog.userName}"?`
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
