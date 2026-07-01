"use client";
import Personal from "@/components/Personal";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useEffect } from "react";

export default function PersonalPage() {
  const { user } = useAuthStore();
  const { period, selectedProjects, fetchDashboard } = useDashboardStore();
  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user, fetchDashboard, period, selectedProjects]);

  if (!user) {
    return null;
  }
  return (
    <MainLayout>
      <Personal />
    </MainLayout>
  );
}
