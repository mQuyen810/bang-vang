import { create } from "zustand";

import { dashboardService } from "@/services/dashboard.service";
import { getCurrentPeriod } from "@/utils/date";

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

  period: string;

  selectedProjects: string[];

  overview: Overview | null;

  projects: Project[];

  myBugRatio: MyBugRatioResponse | null;

  leaderboardBugRatio: LeaderboardBugResponse | null;

  mySlsxRatio: MySlsxResponse | null;

  leaderboardSlsxRatio: LeaderboardSlsxResponse | null;

  setPeriod: (period: string) => void;

  setSelectedProjects: (projects: string[]) => void;

  fetchDashboard: (userName?: string | null) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  loading: false,

  period: getCurrentPeriod(),

  selectedProjects: [],

  overview: null,

  projects: [],

  myBugRatio: null,

  leaderboardBugRatio: null,

  mySlsxRatio: null,

  leaderboardSlsxRatio: null,

  setPeriod: (period) =>
    set({
      period,
    }),

  setSelectedProjects: (projects) =>
    set({
      selectedProjects: projects,
    }),

  fetchDashboard: async (userName = null) => {
    set({
      loading: true,
    });

    try {
      const { period, selectedProjects } = get();

      const dashboardFilter: DashboardFilter = {
        period,
        project_names: selectedProjects.length === 0 ? null : selectedProjects,
      };

      const leaderboardFilter: LeaderboardFilter = {
        period,
        project_names: selectedProjects.length === 0 ? null : selectedProjects,
        user_name: userName,
      };

      const [
        overviewRes,
        projectsRes,
        myBugRatioRes,
        leaderboardBugRatioRes,
        mySlsxRatioRes,
        leaderboardSlsxRatioRes,
      ] = await Promise.allSettled([
        dashboardService.getOverview(dashboardFilter),
        dashboardService.getProjects(dashboardFilter),
        dashboardService.getMyBugRatio(dashboardFilter),
        dashboardService.getLeaderboardBugRatio(leaderboardFilter),
        dashboardService.getMySlsxRatio(dashboardFilter),
        dashboardService.getLeaderboardSlsxRatio(leaderboardFilter),
      ]);

      if (overviewRes.status === "rejected") {
        console.error("Overview API:", overviewRes.reason);
      }

      if (projectsRes.status === "rejected") {
        console.error("Projects API:", projectsRes.reason);
      }

      if (myBugRatioRes.status === "rejected") {
        console.error("My Bug Ratio API:", myBugRatioRes.reason);
      }

      if (leaderboardBugRatioRes.status === "rejected") {
        console.error(
          "Leaderboard Bug Ratio API:",
          leaderboardBugRatioRes.reason,
        );
      }

      if (mySlsxRatioRes.status === "rejected") {
        console.error("My SLSX API:", mySlsxRatioRes.reason);
      }

      if (leaderboardSlsxRatioRes.status === "rejected") {
        console.error("Leaderboard SLSX API:", leaderboardSlsxRatioRes.reason);
      }

      const overview =
        overviewRes.status === "fulfilled" ? overviewRes.value : null;

      const projects =
        projectsRes.status === "fulfilled" ? projectsRes.value : [];

      const myBugRatio =
        myBugRatioRes.status === "fulfilled" ? myBugRatioRes.value : null;

      const leaderboardBugRatio =
        leaderboardBugRatioRes.status === "fulfilled"
          ? leaderboardBugRatioRes.value
          : null;

      const mySlsxRatio =
        mySlsxRatioRes.status === "fulfilled" ? mySlsxRatioRes.value : null;

      const leaderboardSlsxRatio =
        leaderboardSlsxRatioRes.status === "fulfilled"
          ? leaderboardSlsxRatioRes.value
          : null;

      set({
        overview,
        projects,
        myBugRatio,
        leaderboardBugRatio,
        mySlsxRatio,
        leaderboardSlsxRatio,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
