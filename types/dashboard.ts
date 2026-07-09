// import { ApiResponse } from "./api";

export interface DashboardFilter {
  period: string | null;
  project_names: string[] | null;
}

export interface LeaderboardFilter extends DashboardFilter {
  user_name: string | null;
  page?: number;
  per_page?: number;
}

export interface OverdueFilter extends LeaderboardFilter {
  issuetype: string | null;
  status: "Overdue" | "Warning" | null;
  table_id: number;
}

export interface OverdueLogWorkFilter extends LeaderboardFilter {
  issuetype: string | null;
  statusLogWork: "Overdue" | "Warning" | "Missing" | null;
  table_id: number;
}

export interface Overview {
  total_users: number;
  total_subtask: number;
  total_bug: number;
}

export interface Project {
  key: string;
  name: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

/* ===========================
        Issue Detail
=========================== */

export interface IssueDetail {
  id: number;

  key: string;

  project_name: string;

  summary: string;

  issuetype: string;

  assignee: string;

  causer: string | null;

  causer_category: string | null;

  ulnl: string | null;

  slsx: string | null;

  status: string;

  created_at_jira: string;

  is_processed?: number;

  created_at: string;

  updated_at: string;
}

/* ===========================
        Bug Ratio
=========================== */

export interface BugRatio {
  id: number;

  period: string;

  project_name: string;

  user_name: string;

  subtask_count: number;

  bug_count: number;

  bug_count_missing: number;

  bug_percent: string;

  created_at: string;

  updated_at: string;
}

/* ===========================
        SLSX Ratio
=========================== */

export interface SlsxRatio {
  id: number;

  period: string;

  project_name: string;

  user_name: string;

  ulnl_sum: string;

  slsx_sum: string;

  slsx_vs_ulnl_ratio: string;

  created_at: string;

  updated_at: string;
}
export interface OverdueIssue {
  id: number;
  key: string;
  summary: string;
  issuetype: string;
  assignee: string;
  status: string;
  statusText: string;
  enddate: string;
}

export interface OverdueLogWorkIssue {
  id: number;

  key: string;

  summary: string;

  issuetype: string;

  assignee: string;

  status: "Overdue" | "Warning" | "Missing";

  statusText: string;

  enddate: string;
}

export interface OverdueResponse<OverdueIssue> {
  user: string | null;
  project_names: string[];
  period: string;
  issues: {
    details: {
      list: OverdueIssue[];
      meta: Pagination;
    };
  };
}
export interface OverdueLogWorkResponse<OverdueLogWorkIssue> {
  user: string | null;
  project_names: string[];
  period: string;
  issues: {
    details: {
      list: OverdueLogWorkIssue[];
      meta: Pagination;
    };
  };
}

/* ===========================
      Milestone (Missing/Exception)
=========================== */

export interface MilestoneIssue {
  id: number;
  key: string;
  summary: string;
  issuetype: string;
  assignee: string;
  status: string;
  enddate: string;
  actual_date?: string;
}

export interface MilestonesResponseType {
  user: string | null;
  project_names: string[];
  period: string;
  issues: {
    details: {
      list: MilestoneIssue[];
      meta: Pagination;
    };
  };
}

export type MilestonesReportType = "MISSING" | "EXCEPTION";

export interface MilestonesFilter extends DashboardFilter {
  report_type: MilestonesReportType;
  issuetype: string | null;
  user_name: string | null;
  page?: number;
  per_page?: number;
}

export interface USBudget {
  id: number;
  key: string;
  summary: string;
  issuetype: string;
  assignee: string;
  status: string;
  slsx: number;
  sumSLSXSubTask: number;
  ratioSLSX: number;
}

/* ===========================
      Generic Responses
=========================== */

export interface RatioResponse<TRatio> {
  user: string | null;

  project_names: string[];

  period: string;

  issues: {
    ratio: TRatio[];

    details: {
      list: IssueDetail[];

      meta: Pagination;
    };
  };
}

export interface LeaderboardResponse<TItem> {
  user: string | null;

  project_names: string[];

  period: string;

  issues: {
    details: {
      list: TItem[];

      meta: Pagination;
    };
  };
}

export interface USBudgetResponse<USBudget> {
  user: string | null;
  project_names: string[];
  period: string;
  issues: {
    details: {
      list: USBudget[];
      meta: Pagination;
    };
  };
}

/* ===========================
      Export Response Types
=========================== */

export type MyBugRatioResponse = RatioResponse<BugRatio>;

export type LeaderboardBugResponse = LeaderboardResponse<BugRatio>;

export type MySlsxResponse = RatioResponse<SlsxRatio>;

export type LeaderboardSlsxResponse = LeaderboardResponse<SlsxRatio>;

export type OverdueResponseType = OverdueResponse<OverdueIssue>;

export type OverdueLogWorkResponseType =
  OverdueLogWorkResponse<OverdueLogWorkIssue>;

export type USBudgetResponseType = USBudgetResponse<USBudget>;
