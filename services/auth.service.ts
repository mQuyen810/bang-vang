import { loginApi, refreshTokenApi } from "@/api/auth.api";

export const loginService = async (username: string, password: string) => {
  const data = await loginApi({
    username,
    password,
  });

  return data;
};

export const refreshTokenService = async () => {
  return refreshTokenApi();
};
