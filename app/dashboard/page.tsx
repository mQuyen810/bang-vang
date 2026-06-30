"use client";

import Dashboard from "@/components/Dashboard";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchDashboard } = useDashboardStore();
  useEffect(() => {
    if (user) {
      fetchDashboard("06-2026", null, null);
    }
  }, [user, fetchDashboard]);

  if (!user) {
    return null;
  }

  return <MainLayout>{<Dashboard />}</MainLayout>;
}
