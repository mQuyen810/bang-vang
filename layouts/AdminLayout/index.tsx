"use client";

import React from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UserKey, Trophy, LogOut, Users } from "lucide-react";

import styles from "./styles.module.scss";
import { cn } from "@/lib/utils";
import { useAuthStore, isSuperAdmin } from "@/stores/auth.store";
import PageBreadcrumb from "@/components/Breadcrumb";
import { App } from "antd";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin", label: "Admin", icon: Users },
  { to: "/role", label: "Role", icon: UserKey },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const { user, logout, isAuthenticated } = useAuthStore();
  const { message } = App.useApp();

  const fullName = user?.display_name;
  const roleIsSuper = isAuthenticated ? isSuperAdmin() : false;

  const handleLogout = async () => {
    await logout();
    message.success("Đăng xuất thành công!");
    router.push("/login");
  };

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandIcon}>
            <Trophy className={styles.brandIconSvg} size={18} />
          </div>

          <div className={styles.brandText}>
            <div className={styles.brandTitle}>Jira Dashboard Admin</div>
            <div className={styles.brandSub}>Quản trị hệ thống</div>
          </div>
        </div>

        <nav className={styles.menu}>
          {nav.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to) && n.to !== "/";

            return (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  styles.menuItem,
                  active ? styles.menuItemActive : "",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav-pill"
                    className={styles.pill}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
                <n.icon
                  className={cn(
                    styles.menuIcon,
                    active && styles.menuIconActive,
                  )}
                />
                <span className={styles.menuLabel}>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {fullName?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{fullName || "User"}</div>
              {roleIsSuper && (
                <div className={styles.superBadge}>Super Admin</div>
              )}
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <main className={styles.content}>
          <PageBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
