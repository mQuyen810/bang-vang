"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, Badge, Dropdown, MenuProps, message } from "antd";
import { PROJECTS } from "@/lib/mock-data";
import { useSidebar } from "@/components/Sidebar/SidebarProvider";
import { useAuthStore } from "@/stores/auth.store";
import styles from "./styles.module.scss";

export default function Header() {
  const { setMobileOpen } = useSidebar();
  const { user, logout } = useAuthStore();
  console.log("user", user);
  const router = useRouter();

  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(PROJECTS[0]);

  const handleLogout = async () => {
    await logout();
    message.success("Đăng xuất thành công!");
    router.push("/login");
  };

  const userItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <User size={14} />,
      label: "Thông tin cá nhân",
      onClick: () => router.push("/profile"),
    },
    {
      key: "settings",
      icon: <Settings size={14} />,
      label: "Cài đặt",
      onClick: () => router.push("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={14} />,
      danger: true,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const notificationItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Nguyễn Văn A vượt KPI tháng này",
    },
    {
      key: "2",
      label: "Dữ liệu Jira vừa được đồng bộ",
    },
    {
      key: "3",
      label: "Top Bug Rate đã cập nhật",
    },
  ];

  const projectItems: MenuProps["items"] = PROJECTS.map((p) => ({
    key: p.id,
    label: (
      <div onClick={() => setProject(p)}>
        <div>{p.name}</div>
        <small>{p.code}</small>
      </div>
    ),
  }));

  const handleSync = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Đồng bộ dữ liệu thành công!");
    }, 1500);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.mobileBtn}
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <Dropdown menu={{ items: projectItems }} trigger={["click"]}>
          <button className={styles.projectSelector}>
            <div className={styles.projectAvatar}>{project.code}</div>
            <div className={styles.projectInfo}>
              <span>Project</span>
              <strong>{project.name}</strong>
            </div>
            <ChevronDown size={14} />
          </button>
        </Dropdown>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={handleSync}>
          <RefreshCw size={18} className={loading ? styles.spinning : ""} />
        </button>

        <button className={styles.iconBtn} onClick={() => setDark(!dark)}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Dropdown menu={{ items: notificationItems }} trigger={["click"]}>
          <Badge count={3}>
            <button className={styles.iconBtn}>
              <Bell size={18} />
            </button>
          </Badge>
        </Dropdown>

        <div className={styles.divider} />

        <Dropdown
          menu={{ items: userItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className={styles.userBtn}>
            <Avatar size={32} src="/avatar.png">
              {user?.display_name?.charAt(0).toUpperCase()}
            </Avatar>
            <span className={styles.userName}>
              {user?.display_name || "User"}
            </span>
            <ChevronDown size={14} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
