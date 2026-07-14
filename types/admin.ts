export interface ManagerItem {
  id: number;
  jira_username: string;
  jira_display_name: string;
  super_admin: 0 | 1 | number;
  role_id?: number | null;
  role_name?: string | null;
}
