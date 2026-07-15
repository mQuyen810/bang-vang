import axiosClient from "./axios";
import type { Role } from "@/types/role";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getRolesApi = async (search?: string): Promise<ApiResponse<Role[]>> => {
  const params = search ? { q: search } : undefined;
  const res = await axiosClient.get("/admin/roles", { params });
  return res.data;
};

export const createRoleApi = async (payload: {
  name: string;
  permissions: string[];
}): Promise<ApiResponse<Role>> => {
  const res = await axiosClient.post("/admin/roles", payload);
  return res.data;
};

export const updateRoleApi = async (
  id: number,
  payload: {
    name: string;
    permissions: string[];
  },
): Promise<ApiResponse<Role>> => {
  const res = await axiosClient.put(`/admin/roles/${id}`, payload);
  return res.data;
};

export const deleteRoleApi = async (id: number): Promise<ApiResponse<null>> => {
  const res = await axiosClient.delete(`/admin/roles/${id}`);
  return res.data;
};
