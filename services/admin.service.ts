import { getManagerApi } from "@/api/admin.api";
import { ManagerItem } from "@/types/admin";

export const adminService = {
  async getManager(): Promise<ManagerItem[]> {
    const res = await getManagerApi();
    console.log("service", res.data);

    return res.data;
  },
};
