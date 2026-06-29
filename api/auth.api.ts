import axiosClient from "./axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  display_name: string;
}

export const loginApi = async (data: LoginRequest) => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", data);
  console.log(JSON.stringify(response.data, null, 2));
  return response.data;
};
