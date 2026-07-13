"use client";

import { issuesService } from "@/services/sync.service";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  RefreshCw,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
  Check,
} from "lucide-react";
import { Avatar, Badge, Dropdown, MenuProps, App } from "antd";
import { useSidebar } from "@/components/MainLayout/Sidebar/SidebarProvider";
import { useAuthStore } from "@/stores/auth.store";
import styles from "./styles.module.scss";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuesStore } from "@/stores/sync.store";
import SyncModal from "@/components/SyncModal";

const pollSync = async (mode: "last" | "full") => {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const res = await issuesService.getSyncStatus(mode);
        if (res.status !== "running") {
          clearInterval(interval);
          resolve();
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 3000);
  });
};

export default function Header() {
  const { message } = App.useApp();
  const { setMobileOpen } = useSidebar();
  const { user, logout } = useAuthStore();
  const { 
    syncFromLastIssues, 
    syncFullIssues, 
    cancelSync,
    loadingLast,
    loadingFull,
    setLoadingLast,
    setLoadingFull
  } = useIssuesStore();
  const match = user?.display_name?.match(/^(.*?)\s*\((.*?)\)$/);
  const fullName = match?.[1] ?? user?.display_name;
  const router = useRouter();

  const { projects, selectedProjects, setSelectedProjects, fetchProjects } =
    useDashboardStore();
  const [projectOpen, setProjectOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  const handleLogout = async () => {
    cancelSync();
    await logout();
    message.success("Đăng xuất thành công!");
    router.push("/login");
  };

  const userItems: MenuProps["items"] = [
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

  useEffect(() => {
    const checkActiveSync = async () => {
      try {
        const [lastRes, fullRes] = await Promise.all([
          issuesService.getSyncStatus("last"),
          issuesService.getSyncStatus("full"),
        ]);

        if (lastRes.status === "running") {
          setLoadingLast(true);
          await pollSync("last");
          message.success("Đã đồng bộ xong dữ liệu mới nhất!");
          setLoadingLast(false);
        } else if (fullRes.status === "running") {
          setLoadingFull(true);
          await pollSync("full");
          message.success("Đã đồng bộ xong toàn bộ dữ liệu!");
          setLoadingFull(false);
        }
      } catch (e) {
        // Ignore error if check fails
      }
    };

    if (user?.is_admin === 1 || user?.super_admin === 1) {
      checkActiveSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSync = async () => {
    setSyncModalOpen(true);
  };
  const handleSyncAll = async () => {
    if (loadingLast || loadingFull) return;
    try {
      setLoadingFull(true);
      const res = await syncFullIssues();

      message.info(res.message || "Đã nhận yêu cầu đồng bộ, đang xử lý nền...");
      await pollSync("full");
      message.success("Đã đồng bộ xong toàn bộ dữ liệu!");
    } catch {
      message.error("Có lỗi xảy ra khi đồng bộ!");
    } finally {
      setLoadingFull(false);
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
            disabled={loadingLast || loadingFull}
          >
            <RefreshCw size={18} className={loadingLast || loadingFull ? styles.spinning : ""} />
          </button>
        )}

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

      <SyncModal
        open={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
      />
    </header>
  );
}
