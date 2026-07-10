import axiosClient from "./axios";
import { ApiResponse } from "@/types/api";
import { ManagerItem } from "@/types/admin";

export const getManagerApi = async (page: number, pageSize: number, role?: string, userName?: string) => {
  const res =
    await axiosClient.get("/admin/manager", {
        params: { 
            page, 
            per_page: pageSize, 
            is_admin: role,
            user_name: userName || undefined
        }
    });

  return res.data;
};
