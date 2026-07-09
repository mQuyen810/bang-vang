"use client";

import Milestone from "@/components/Milestone";

import MainLayout from "@/components/MainLayout";
import { useAuthStore } from "@/stores/auth.store";

export default function MilestonePage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <Milestone />
    </MainLayout>
  );
}
