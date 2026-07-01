import * as dashboardApi from "@/api/dashboard.api";
import { DashboardFilter, LeaderboardFilter } from "@/types/dashboard";

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
};
