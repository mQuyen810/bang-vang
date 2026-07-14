import axiosClient from "./axios";
import { ApiResponse } from "@/types/api";

export interface ToggleAdminRequest {
  user_name: string;
  super_admin: 0 | 1;
}

// POST /admin/manager/user
export const toggleAdminApi = async (data: ToggleAdminRequest) => {
  const res = await axiosClient.post<ApiResponse<number>>(
    "/admin/manager/user",
    data,
  );

  return res.data;
};
