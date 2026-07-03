"use client";

import Overdue from "@/components/Overdue";
import MainLayout from "@/components/MainLayout";
import { useAuthStore } from "@/stores/auth.store";

export default function OverduePage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return <MainLayout>{<Overdue />}</MainLayout>;
}
