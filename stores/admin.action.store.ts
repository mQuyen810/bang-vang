import { create } from "zustand";
import axios from "axios";

import {
  adminActionService,
  type ToggleAdminRequest,
  isAxiosLikeError,
} from "@/services/admin.action.service";

interface AdminActionState {
  loadingAction: boolean;
  errorAction: string | null;

  toggleAdmin: (data: ToggleAdminRequest) => Promise<void>;
}

export const useAdminActionStore = create<AdminActionState>((set) => ({
  loadingAction: false,
  errorAction: null,

  toggleAdmin: async (data) => {
    set({ loadingAction: true, errorAction: null });
    try {
      await adminActionService.toggleAdmin(data);
    } catch (err) {
      if (isAxiosLikeError(err)) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const message = axiosErr.response?.data?.message;
        set({ errorAction: message ?? "Failed to update admin" });
      } else {
        set({ errorAction: "Failed to update admin" });
      }
      throw err;
    } finally {
      set({ loadingAction: false });
    }
  },
}));
