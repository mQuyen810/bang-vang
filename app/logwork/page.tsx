"use client";

import OverdueLogWork from "@/components/OverdueLogWork";
import MainLayout from "@/components/MainLayout";
import { useAuthStore } from "@/stores/auth.store";

export default function OverduePage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return <MainLayout>{<OverdueLogWork />}</MainLayout>;
}
