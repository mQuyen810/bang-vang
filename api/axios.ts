import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://172.16.103.65:2003/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Xử lý lỗi và refresh token
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi refresh token
        const { refreshToken } = useAuthStore.getState();
        await refreshToken();

        // Retry request với token mới
        const token = localStorage.getItem("accessToken");
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, logout
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
