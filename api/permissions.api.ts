import axiosClient from "./axios";

export const getPermissionsApi = async () => {
  const res = await axiosClient.get("/admin/permissons");
  return res.data as {
    success: boolean;
    message?: string;
    data: string[];
  };
};
