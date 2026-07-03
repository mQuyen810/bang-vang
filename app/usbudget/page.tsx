"use client";

import MainLayout from "@/components/MainLayout";
import USBudget from "@/components/USBudget";
import { useAuthStore } from "@/stores/auth.store";

export default function OverbudgetPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return <MainLayout>{<USBudget />}</MainLayout>;
}
