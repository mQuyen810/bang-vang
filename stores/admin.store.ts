import { create } from "zustand";
import axios from "axios";

import { adminService } from "@/services/admin.service";
import { ManagerItem } from "@/types/admin";

interface AdminState {
  loadingManager: boolean;
  managerList: ManagerItem[];
  errorManager: string | null;

  fetchManagerList: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  loadingManager: false,
  managerList: [],
  errorManager: null,

  fetchManagerList: async () => {
    set({
      loadingManager: true,
      errorManager: null,
    });

    try {
      const managerList = await adminService.getManager();

      set({
        managerList,
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
