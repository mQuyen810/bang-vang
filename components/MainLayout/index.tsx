"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

import styles from "./styles.module.scss";
import { useSidebar } from "./Sidebar/SidebarProvider";
import PageBreadcrumb from "@/components/PageBreadcrumb";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div
        className={`${styles.main} ${collapsed ? styles.mainCollapsed : ""}`}
      >
        <Header />
        <main className={styles.content}>
          <PageBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
