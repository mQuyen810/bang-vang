import * as dashboardApi from "@/api/dashboard.api";
import * as milestonesApi from "@/api/milestones.api";
import {
  DashboardFilter,
  LeaderboardFilter,
  OverdueFilter,
  OverdueLogWorkFilter,
  MilestonesFilter,
} from "@/types/dashboard";

export const dashboardService = {
  async getOverview(filter: DashboardFilter) {
    const res = await dashboardApi.getOverviewApi(filter);

    return res.data.data;
  },

  async getProjects(filter: DashboardFilter) {
    const res = await dashboardApi.getProjectsApi(filter);

    return res.data.data;
  },

  async getMyBugRatio(filter: DashboardFilter) {
    const res = await dashboardApi.getMyBugRatioApi(filter);

    return res.data.data;
  },

  async getLeaderboardBugRatio(filter: LeaderboardFilter) {
    const res = await dashboardApi.getLeaderboardBugRatioApi(filter);

    return res.data.data;
  },

  async getMySlsxRatio(filter: DashboardFilter) {
    const res = await dashboardApi.getMySlsxRatioApi(filter);

    return res.data.data;
  },

  async getLeaderboardSlsxRatio(filter: LeaderboardFilter) {
    const res = await dashboardApi.getLeaderboardSlsxRatioApi(filter);

    return res.data.data;
  },
  async getOverdue(filter: OverdueFilter) {
    const res = await dashboardApi.getOverdueApi(filter);

    return res.data.data;
  },
  async getOverdueLogWork(filter: OverdueLogWorkFilter) {
    const res = await dashboardApi.getOverdueLogWorkApi(filter);

    return res.data.data;
  },
  async getUSBudget(filter: LeaderboardFilter) {
    const res = await dashboardApi.getUSBudgetApi(filter);

    return res.data.data;
  },

  async getMilestones(filter: MilestonesFilter) {
    const res = await dashboardApi.getMilestonesApi(filter);
    return res.data.data;
  },
};
