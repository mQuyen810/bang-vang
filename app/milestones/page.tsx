"use client";

import Milestones from "@/components/Milestones";
import MainLayout from "@/components/MainLayout";
import { useAuthStore } from "@/stores/auth.store";

export default function MilestonesPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return <MainLayout>{<Milestones />}</MainLayout>;
}


