"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy as TrophyIcon,
  ChevronLeft,
  ChevronRight,
  Circle,
  X,
} from "lucide-react";
import { SIDEBAR_MENU } from "@/constants/sidebar";

import { useEffect } from "react";
import { useSidebar } from "@/components/Sidebar/SidebarProvider";

import styles from "./styles.module.scss";
import { currentUser } from "@/lib/mock-data";

export default function Sidebar() {
  const {
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
  } = useSidebar();

  const pathname = usePathname() ?? "";
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`${styles.backdrop} ${
          mobileOpen ? styles.backdropOpen : ""
        }`}
      />

      <aside
        className={`
          ${styles.sidebar}
          ${collapsed ? styles.collapsed : ""}
          ${mobileOpen ? styles.mobileOpen : ""}
        `}
      >
        {/* Header */}
        <div className={styles.top}>
          <Link
            href="/"
            className={styles.logo}
            onClick={() => setMobileOpen(false)}
          >
            <div className={styles.logoIcon}>
              <TrophyIcon size={18} />
            </div>

            {!collapsed && (
              <div className={styles.logoContent}>
                <div className={styles.logoTitle}>
                  Bảng Vàng
                </div>

                <div className={styles.logoSub}>
                  Vinh danh đóng góp
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse */}
          <button
            className={styles.collapseBtn}
            onClick={() =>
              setCollapsed(!collapsed)
            }
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>

          {/* Mobile Close */}
          <button
            className={styles.closeBtn}
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <X size={16} />
          </button>
        </div>

        {/* Menu */}
        <nav className={styles.menu}>
        {SIDEBAR_MENU.map((group) => (
            <div
            key={group.title}
            className={styles.group}
            >
            {!collapsed && (
                <div className={styles.groupTitle}>
                {group.title}
                </div>
            )}

            {group.items.map(
                ({
                path,
                label,
                icon: Icon,
                }) => {
                const active =
                    path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(path);

                return (
                    <Link
                    key={path}
                    href={path}
                    title={
                        collapsed
                        ? label
                        : undefined
                    }
                    onClick={() =>
                        setMobileOpen(false)
                    }
                    className={`
                        ${styles.menuItem}
                        ${
                        active
                            ? styles.active
                            : ""
                        }
                    `}
                    >
                    <Icon
                        className={
                        styles.icon
                        }
                    />

                    {!collapsed && (
                        <span>{label}</span>
                    )}
                    </Link>
                );
                }
            )}
            </div>
        ))}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
        <div
        className={`
            ${styles.userCard}
            ${collapsed ? styles.userCardCollapsed : ""}
        `}
        >
        <div className={styles.avatarWrapper}>
            <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={styles.avatar}
            />

            <span className={styles.statusDot} />
        </div>

        {!collapsed && (
            <div className={styles.userInfo}>
            <p className={styles.userName}>
                {currentUser.name}
            </p>

            <div className={styles.roleWrapper}>
                <span className={styles.roleBadge}>
                {currentUser.department}
                </span>
            </div>
            </div>
        )}
        </div>
        </div>
      </aside>
    </>
  );
}