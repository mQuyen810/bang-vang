import { create } from "zustand";
import axios from "axios";

import { adminService } from "@/services/admin.service";
import { ManagerItem } from "@/types/admin";

interface AdminState {
  loadingManager: boolean;
  managerList: ManagerItem[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  errorManager: string | null;

  fetchManagerList: (page?: number, pageSize?: number, role?: string, userName?: string) => Promise<void>;

}

export const useAdminStore = create<AdminState>((set) => ({
  loadingManager: false,
  managerList: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  errorManager: null,

  fetchManagerList: async (page = 1, pageSize = 10, role = "all", userName = "") => {
    set({
      loadingManager: true,
      errorManager: null,
    });

    try {
      const data = await adminService.getManager(page, pageSize, role, userName);
      
      set({
        managerList: data.details.list,
        pagination: {
            current: data.details.meta.current_page,
            pageSize: data.details.meta.per_page,
            total: data.details.meta.total,
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        set({
          errorManager: message ?? "Failed to load manager list",
        });

        if (status === 401 || status === 403) {
          throw error;
        }
      } else {
        set({
          errorManager: "Failed to load manager list",
        });
      }
    } finally {
      set({
        loadingManager: false,
      });
    }
  },
}));
