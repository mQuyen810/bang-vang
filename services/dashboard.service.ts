import * as dashboardApi from "@/api/dashboard.api";

export const dashboardService = {
  async getOverview() {
    const res = await dashboardApi.getOverviewApi();

    return res.data.data;
  },

  async getProjects() {
    const res = await dashboardApi.getProjectsApi();

    return res.data.data;
  },

  async getMyBugRatio(filter) {
    const res = await dashboardApi.getMyBugRatioApi(filter);

    return res.data.data;
  },

  async getLeaderboardBugRatio(filter) {
    const res = await dashboardApi.getLeaderboardBugRatioApi(filter);

    return res.data.data;
  },

  async getMySlsxRatio(filter) {
    const res = await dashboardApi.getMySlsxRatioApi(filter);

    return res.data.data;
  },

  async getLeaderboardSlsxRatio(filter) {
    const res = await dashboardApi.getLeaderboardSlsxRatioApi(filter);

    return res.data.data;
  },
};
