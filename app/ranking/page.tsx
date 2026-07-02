"use client";

import RankingsPage from "@/components/Ranking";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/auth.store";

export default function RankingPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }
  return (
    <MainLayout>
      <RankingsPage />
    </MainLayout>
  );
}
