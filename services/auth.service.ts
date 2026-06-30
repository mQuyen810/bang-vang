import { loginApi } from "@/api/auth.api";

export const loginService = async (username: string, password: string) => {
  const data = await loginApi({
    username,
    password,
  });

  return data;
};
