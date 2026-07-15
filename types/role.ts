export type Role = {
  id: number;
  name: string;
  permission_json?: string | string[];
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
};
