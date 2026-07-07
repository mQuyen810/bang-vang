import axiosClient from "./axios";
import { ApiResponse } from "@/types/api";
import { ManagerItem } from "@/types/admin";

export const getManagerApi = async () => {
  const res =
    await axiosClient.get<ApiResponse<ManagerItem[]>>("/admin/manager");

  return res.data;
};
