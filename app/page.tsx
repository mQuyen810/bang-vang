"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, isSuperAdmin } from "@/stores/auth.store";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (isSuperAdmin()) {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return null;
}
