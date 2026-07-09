"use client";

import Dashboard from "@/components/Dashboard";
import MainLayout from "@/components/MainLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    period,
    selectedProjects,
    fetchOverview,
    fetchProjects,
    fetchLeaderboardBugRatio,
    fetchLeaderboardSlsxRatio,
  } = useDashboardStore();
  useEffect(() => {
    if (user) {
      fetchOverview();
      fetchProjects();
      fetchLeaderboardBugRatio();
      fetchLeaderboardSlsxRatio();
    }
  }, [
    user,
    fetchOverview,
    fetchProjects,
    fetchLeaderboardBugRatio,
    fetchLeaderboardSlsxRatio,
    period,
    selectedProjects,
  ]);

  if (!user) {
    return null;
  }

  return <MainLayout>{<Dashboard />}</MainLayout>;
}
