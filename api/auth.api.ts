import axios from "./axios";
import axiosClient from "./axios";
import { LoginRequest, LoginResponse } from "@/types";

export const loginApi = async (data: LoginRequest) => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const refreshTokenApi = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await axios.post<LoginResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
