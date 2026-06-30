import axiosClient from "./axios";
import { LoginRequest, LoginResponse } from "@/types";

export const loginApi = async (data: LoginRequest) => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};
