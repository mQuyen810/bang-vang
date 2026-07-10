import { getManagerApi } from "@/api/admin.api";
import { ManagerItem } from "@/types/admin";

export const adminService = {
  async getManager(page = 1, pageSize = 10, role = "all", userName = "") {
    // Đảm bảo role là undefined nếu là "all" để api bỏ qua param đó
    const roleParam = role === "all" ? undefined : role;
    const res = await getManagerApi(page, pageSize, roleParam, userName);
    return res.data;
  },
};
