export interface ManagerItem {
  id: number;
  jira_username: string;
  jira_display_name: string;
  // jira_email: string;
  is_admin: 0 | 1 | number;
}
