"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Bell,
  RefreshCw,
  Moon,
  Sun,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Dropdown,
  MenuProps,
} from "antd";

import { PROJECTS } from "@/lib/mock-data";

import { useSidebar } from "@/components/Sidebar/SidebarProvider";

import styles from "./styles.module.scss";

const notificationItems: MenuProps["items"] =
  [
    {
      key: "1",
      label:
        "Nguyễn Văn A vượt KPI tháng này",
    },
    {
      key: "2",
      label:
        "Dữ liệu Jira vừa được đồng bộ",
    },
    {
      key: "3",
      label:
        "Top Bug Rate đã cập nhật",
    },
  ];

const userItems: MenuProps["items"] =
  [
    {
      key: "profile",
      icon: <User size={14} />,
      label: "Thông tin cá nhân",
    },
    {
      key: "settings",
      icon: <Settings size={14} />,
      label: "Cài đặt",
    },
    {
      key: "logout",
      icon: <LogOut size={14} />,
      danger: true,
      label: "Đăng xuất",
    },
  ];

export default function Header() {
    const {
    setMobileOpen,
    } = useSidebar();

    const [dark, setDark] =
    useState(true);

    const [loading, setLoading] =
    useState(false);

    const [project, setProject] =
    useState(PROJECTS[0]);

    const projectItems: MenuProps["items"] =
    PROJECTS.map((p) => ({
        key: p.id,
        label: (
        <div
            onClick={() => setProject(p)}
        >
            <div>{p.name}</div>
            <small>{p.code}</small>
        </div>
        ),
    }));

  const handleSync = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  const syncJira = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);
    };

return (
  <header className={styles.header}>
    <div className={styles.left}>
            {/* Mobile */}

        <button
        className={styles.mobileBtn}
        onClick={() =>
            setMobileOpen(true)
        }
        >
        <Menu size={20} />
        </button>

        {/* Project */}

        <Dropdown
        menu={{
            items: projectItems,
        }}
        trigger={["click"]}
        >
        <button
            className={
            styles.projectSelector
            }
        >
            <div
            className={
                styles.projectAvatar
            }
            >
            {project.code}
            </div>

            <div
            className={
                styles.projectInfo
            }
            >
            <span>
                Project
            </span>

            <strong>
                {project.name}
            </strong>
            </div>

            <ChevronDown size={14} />
        </button>
        </Dropdown>
    </div>

    {/* Actions */}

    <div className={styles.actions}>
      {/* Sync */}

      <button
        className={styles.iconBtn}
        onClick={syncJira}
      >
        <RefreshCw
          size={18}
          className={
            loading
              ? styles.spinning
              : ""
          }
        />
      </button>

      {/* Theme */}

      <button
        className={styles.iconBtn}
        onClick={() =>
          setDark(!dark)
        }
      >
        {dark ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </button>

      {/* Notifications */}

      <Dropdown
        menu={{
          items:
            notificationItems,
        }}
        trigger={["click"]}
      >
        <Badge count={3}>
          <button
            className={
              styles.iconBtn
            }
          >
            <Bell size={18} />
          </button>
        </Badge>
      </Dropdown>

      <div className={styles.divider} />

      {/* User */}

      <Dropdown
        menu={{
          items: userItems,
        }}
      >
        <button
          className={styles.userBtn}
        >
          <Avatar
            size={32}
            src="/avatar.png"
          />

          <ChevronDown
            size={14}
          />
        </button>
      </Dropdown>
    </div>
  </header>
);
}