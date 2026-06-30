import { create } from "zustand";

import { dashboardService } from "@/services/dashboard.service";

import {
  Overview,
  Project,
  DashboardFilter,
  LeaderboardFilter,
  MyBugRatioResponse,
  LeaderboardBugResponse,
  MySlsxResponse,
  LeaderboardSlsxResponse,
} from "@/types/dashboard";

interface DashboardState {
  loading: boolean;

  overview: Overview | null;

  projects: Project[];

  myBugRatio: MyBugRatioResponse | null;

  leaderboardBugRatio: LeaderboardBugResponse | null;

  mySlsxRatio: MySlsxResponse | null;

  leaderboardSlsxRatio: LeaderboardSlsxResponse | null;

  fetchDashboard: (
    period: string,
    projectNames: string[] | null,
    userName: string | null,
  ) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  loading: false,

  overview: null,

  projects: [],

  myBugRatio: null,

  leaderboardBugRatio: null,

  mySlsxRatio: null,

  leaderboardSlsxRatio: null,

  fetchDashboard: async (period, projectNames, userName) => {
    set({
      loading: true,
    });

    try {
      const myFilter: DashboardFilter = {
        period,
        project_names: projectNames,
      };

      const leaderboardFilter: LeaderboardFilter = {
        period,
        project_names: projectNames,
        user_name: userName,
      };

      const [
        overview,
        projects,
        myBugRatio,
        leaderboardBugRatio,
        mySlsxRatio,
        leaderboardSlsxRatio,
      ] = await Promise.all([
        dashboardService.getOverview(),

        dashboardService.getProjects(),

        dashboardService.getMyBugRatio(myFilter),

        dashboardService.getLeaderboardBugRatio(leaderboardFilter),

        dashboardService.getMySlsxRatio(myFilter),

        dashboardService.getLeaderboardSlsxRatio(leaderboardFilter),
      ]);

      set({
        overview,

        projects,

        myBugRatio,

        leaderboardBugRatio,

        mySlsxRatio,

        leaderboardSlsxRatio,
      });

      console.log({
        overview,
        projects,
        myBugRatio,
        leaderboardBugRatio,
        mySlsxRatio,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
