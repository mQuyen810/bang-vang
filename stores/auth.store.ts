import { create } from "zustand";
import { loginService } from "@/services/auth.service";

interface AuthUser {
  display_name: string;
  super_admin: number;
}

interface AuthState {
  loading: boolean;
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<AuthUser>;

  /**
   * Refresh token (tối thiểu để phù hợp axios interceptor).
   * Hiện tại backend chưa có refresh token riêng, nên thực hiện noop.
   */
  refreshToken: () => Promise<void>;

  logout: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  loading: false,
  user: null,
  token: null,
  isAuthenticated: false,

  refreshToken: async () => {
    // Backend hiện chưa hỗ trợ refreshToken riêng.
    // Hàm này chỉ tồn tại để thỏa mãn type cho axios interceptor.
    // Khi có refresh token thực tế, thay logic tại đây.
    return;
  },

  login: async (username, password) => {
    set({ loading: true });


    try {
      const res = await loginService(username, password);
      console.log("Login response:", res);

      localStorage.setItem("accessToken", res.token);

      const userData = {
        display_name: res.display_name,
        super_admin: res.super_admin || 0,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      document.cookie = `token=${res.token}; path=/; max-age=604800`;

      set({
        user: userData,
        token: res.token,
        isAuthenticated: true,
        loading: false,
      });

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      set({
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    document.cookie = "token=;path=/;max-age=0";

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

// Helper để kiểm tra super admin
export const isSuperAdmin = () => {
  if (typeof window === "undefined") return false;
  const userStr = localStorage.getItem("user");
  if (!userStr) return false;
  try {
    const user = JSON.parse(userStr);
    return user.super_admin === 1;
  } catch {
    return false;
  }
};

// Helper để lấy user từ localStorage
export const getUser = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};
