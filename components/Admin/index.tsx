"use client";

import { useEffect, useState, useCallback } from "react";
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
    // Kiểm tra đã đăng nhập chưa
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Kiểm tra có phải super admin không
    const isSuper = isSuperAdmin();
    setIsSuperAdminUser(isSuper);

    // Nếu không phải super admin, chuyển về dashboard
    if (!isSuper) {
      message.warning("Bạn không có quyền truy cập trang này!");
      router.replace("/dashboard");
      return;
    }

    // Load danh sách user
    const load = async () => {
      try {
        await fetchManagerList();
      } catch (error) {
        console.error("Failed to load manager list:", error);
      }
    };

    load();
  }, [isAuthenticated, fetchManagerList, router]);

  // Debounce search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;
      return (params: any) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          fetchManagerList(params);
          setLoading(false);
        }, 500);
      };
    })(),
    [fetchManagerList],
  );

  const handleSearch = () => {
    setLoading(true);

    const params: any = {};

    if (filters.q) {
      params.search = filters.q;
    }
    if (filters.username) {
      params.username = filters.username;
    }
    if (filters.fullName) {
      params.display_name = filters.fullName;
    }
    if (filters.email) {
      params.email = filters.email;
    }
    if (filters.role !== "all") {
      params.is_admin = filters.role === "admin" ? 1 : 0;
    }

    debouncedSearch(params);
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setLoading(true);
    fetchManagerList();
    setTimeout(() => setLoading(false), 400);
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

  const exportCsv = () => {
    if (!managerList?.length) {
      message.warning("Không có dữ liệu để export");
      return;
    }

    const rows = [
      ["ID", "Jira Username", "Jira Display Name", "Jira Email", "Is Admin"],
      ...managerList.map((u) => [
        u.id,
        u.jira_username,
        u.jira_display_name,
        u.jira_email,
        u.is_admin ? "Admin" : "Member",
      ]),
    ];

    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `managers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    URL.revokeObjectURL(url);
    message.success("Export thành công!");
  };

  const handleToggleAdmin = (id: number, isAdmin: boolean) => {
    const selectedUser = managerList?.find((u) => u.id === id);
    if (!selectedUser) return;

    setConfirmDialog({
      isOpen: true,
      userId: id,
      isAdmin,
      userName: selectedUser.jira_display_name || selectedUser.jira_username,
    });
  };

  const handleConfirmToggleAdmin = async () => {
    try {
      // TODO: call API toggle admin
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

  // Hiển thị loading khi đang kiểm tra quyền
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
          <div className={styles.breadcrumb}>
            <Home className={styles.breadcrumbIcon} />
            <span>Dashboard</span>
            <ChevronRight className={styles.breadcrumbSeparator} />
            <span>Administration</span>
            <ChevronRight className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbActive}>Admin</span>
          </div>
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

          <button onClick={exportCsv} className={styles.btnGhost}>
            <Download className={styles.icon} />
            Export
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

      {/* Filters */}
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
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Username</label>
              <div className={styles.filterInput}>
                <input
                  value={filters.username}
                  onChange={(e) =>
                    setFilters({ ...filters, username: e.target.value })
                  }
                  placeholder="Nhập username"
                  className={styles.inputField}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Họ và tên</label>
              <div className={styles.filterInput}>
                <input
                  value={filters.fullName}
                  onChange={(e) =>
                    setFilters({ ...filters, fullName: e.target.value })
                  }
                  placeholder="Nhập họ và tên"
                  className={styles.inputField}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Email</label>
              <div className={styles.filterInput}>
                <input
                  value={filters.email}
                  onChange={(e) =>
                    setFilters({ ...filters, email: e.target.value })
                  }
                  placeholder="Nhập email"
                  className={styles.inputField}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

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

          <div className={styles.filterActions}>
            <button onClick={handleSearch} className={styles.btnPrimary}>
              <Search className={styles.icon} />
              Tìm kiếm
            </button>
            <button onClick={resetFilters} className={styles.btnGhost}>
              <X className={styles.icon} />
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <UserTable
          users={managerList}
          loading={loadingManager || loading}
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
