"use client";
import Personal from "@/components/Personal";
import MainLayout from "@/components/MainLayout";

import { useAuthStore } from "@/stores/auth.store";

export default function PersonalPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }
  return (
    <MainLayout>
      <Personal />
    </MainLayout>
  );
}
