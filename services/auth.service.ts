import { loginApi } from "@/api/auth.api";

export const loginService = async (username: string, password: string) => {
  const data = await loginApi({
    username,
    password,
  });
  console.log("loginService", data);

  return data;
};
