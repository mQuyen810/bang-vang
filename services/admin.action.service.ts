import axios from "axios";
import {
  toggleAdminApi,
  type ToggleAdminRequest,
} from "@/api/admin.action.api";

export const adminActionService = {
  async toggleAdmin(data: ToggleAdminRequest): Promise<void> {
    await toggleAdminApi(data);
  },
};

export type { ToggleAdminRequest };

export const isAxiosLikeError = (
  err: unknown,
): err is { response?: { status?: number; data?: unknown } } => {
  return axios.isAxiosError(err);
};

