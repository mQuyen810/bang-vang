"use client";

import Dashboard from "@/components/Dashboard";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/auth.store";

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return <MainLayout>{<Dashboard />}</MainLayout>;
}
