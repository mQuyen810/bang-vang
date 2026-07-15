import { getPermissionsApi } from "@/api/permissions.api";

let cache: string[] | null = null;

export async function getPermissions() {
  if (cache) return cache;
  const res = await getPermissionsApi();
  cache = res.data ?? [];
  return cache;
}
