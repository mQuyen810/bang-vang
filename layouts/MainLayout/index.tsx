"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import styles from "./styles.module.scss";
import { useSidebar } from "@/components/Sidebar/SidebarProvider";
import PageBreadcrumb from "@/components/Breadcrumb";

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
        className={`${styles.main} ${
          collapsed ? styles.mainCollapsed : ""
        }`}
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