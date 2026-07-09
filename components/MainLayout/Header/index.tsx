"use client";

import { useEffect, useRef, useState } from "react";
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
  Check,
} from "lucide-react";
import { Avatar, Badge, Dropdown, MenuProps, message } from "antd";
import { useSidebar } from "@/components/MainLayout/Sidebar/SidebarProvider";
import { useAuthStore } from "@/stores/auth.store";
import styles from "./styles.module.scss";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuesStore } from "@/stores/sync.store";

export default function Header() {
  const { setMobileOpen } = useSidebar();
  const { user, logout } = useAuthStore();
  const { syncFromLastIssues, syncFullIssues, cancelSync } = useIssuesStore();
  const match = user?.display_name?.match(/^(.*?)\s*\((.*?)\)$/);
  const fullName = match?.[1] ?? user?.display_name;
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const { projects, selectedProjects, setSelectedProjects, fetchProjects } =
    useDashboardStore();
  const [projectOpen, setProjectOpen] = useState(false);

  const handleLogout = async () => {
    cancelSync();
    await logout();
    message.success("Đăng xuất thành công!");
    router.push("/login");
  };

  const userItems: MenuProps["items"] = [
    ...((user?.is_admin === 1 || user?.super_admin === 1)
      ? [
          {
            key: "settings",
            icon: (
              <Settings
                size={14}
                className={loadingAll ? styles.spinning : ""}
              />
            ),
            label: loadingAll ? "Đang đồng bộ dữ liệu" : "Đồng bộ dữ liệu",
            onClick: () => handleSyncAll(),
            disabled: loadingAll,
          },
          {
            type: "divider" as const,
          },
        ]
      : []),
    {
      key: "logout",
      icon: <LogOut size={14} />,
      danger: true,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const toggleProject = (name: string) => {
    if (selectedProjects.includes(name)) {
      setSelectedProjects(selectedProjects.filter((x) => x !== name));
    } else {
      setSelectedProjects([...selectedProjects, name]);
    }
  };

  const projectLabel =
    selectedProjects.length === 0
      ? "Tất cả"
      : selectedProjects.length === 1
        ? selectedProjects[0]
        : `${selectedProjects.length} dự án`;
  const projectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        projectRef.current &&
        !projectRef.current.contains(e.target as Node)
      ) {
        setProjectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user || projects.length > 0) return;

    fetchProjects();
  }, [user, projects.length, fetchProjects]);

  const handleSync = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await syncFromLastIssues();

      message.success(res.message);
    } catch {
      message.error("Đồng bộ thất bại!");
    } finally {
      setLoading(false);
    }
  };
  const handleSyncAll = async () => {
    if (loadingAll) return;
    try {
      setLoadingAll(true);
      const res = await syncFullIssues();

      message.success(res.message);
    } catch {
      message.error("Đồng bộ thất bại!");
    } finally {
      setLoadingAll(false);
    }
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

        <div className={styles.projectDropdown} ref={projectRef}>
          <button
            className={styles.projectSelector}
            onClick={() => setProjectOpen(!projectOpen)}
          >
            <span className={styles.projectDot} />

            <div className={styles.projectInfo}>
              <span>Dự án</span>
              <strong>{projectLabel}</strong>
            </div>

            {selectedProjects.length > 1 && (
              <span className={styles.projectCount}>
                {selectedProjects.length}
              </span>
            )}

            <ChevronDown
              size={14}
              className={projectOpen ? styles.rotate : ""}
            />
          </button>

          {projectOpen && (
            <div className={styles.projectMenu}>
              <div className={styles.projectMenuHeader}>
                <span>Dự án</span>
              </div>
              <button
                className={`${styles.projectItem} ${
                  selectedProjects.length === 0 ? styles.active : ""
                }`}
                onClick={() => setSelectedProjects([])}
              >
                <span
                  className={`${styles.dot} ${
                    selectedProjects.length === 0 ? styles.dotActive : ""
                  }`}
                />

                <div className={styles.projectContent}>
                  <strong>Tất cả</strong>
                </div>

                {selectedProjects.length === 0 && (
                  <span className={styles.check}>
                    <Check size={12} />
                  </span>
                )}
              </button>

              {projects.map((p) => {
                const active = selectedProjects.includes(p.name);

                return (
                  <button
                    key={p.key}
                    className={`${styles.projectItem} ${
                      active ? styles.active : ""
                    }`}
                    onClick={() => toggleProject(p.name)}
                  >
                    <span
                      className={`${styles.dot} ${
                        active ? styles.dotActive : ""
                      }`}
                    />

                    <div className={styles.projectContent}>
                      <strong>{p.name}</strong>
                    </div>

                    {active && (
                      <span className={styles.check}>
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {(user?.is_admin === 1 || user?.super_admin === 1) && (
          <button
            className={styles.iconBtn}
            onClick={handleSync}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? styles.spinning : ""} />
          </button>
        )}

        <button className={styles.iconBtn} onClick={() => setDark(!dark)}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* <Dropdown menu={{ items: notificationItems }} trigger={["click"]}>
          <Badge count={3}>
            <button className={styles.iconBtn}>
              <Bell size={18} />
            </button>
          </Badge>
        </Dropdown> */}

        <div className={styles.divider} />

        <Dropdown
          menu={{ items: userItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className={styles.userBtn}>
            <Avatar size={32}>
              {user?.display_name?.charAt(0).toUpperCase()}
            </Avatar>
            <span className={styles.userName}>{fullName || "User"}</span>
            <ChevronDown size={14} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
