import { create } from "zustand";
import { loginService } from "@/services/auth.service";

interface AuthUser {
  display_name: string;
}

interface AuthState {
  loading: boolean;
  user: AuthUser | null;

  login: (username: string, password: string) => Promise<void>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loading: false,

  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,

  login: async (username, password) => {
    set({ loading: true });

    try {
      const res = await loginService(username, password);

      localStorage.setItem("accessToken", res.token);

      document.cookie = `token=${res.token}; path=/; max-age=604800`;

      localStorage.setItem(
        "user",
        JSON.stringify({
          display_name: res.display_name,
        }),
      );

      set({
        user: {
          display_name: res.display_name,
        },
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    document.cookie = "token=;path=/;max-age=0";

    set({
      user: null,
    });
  },
}));
