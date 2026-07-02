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

  fetchOverview: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchMyBugRatio: () => Promise<void>;
  fetchLeaderboardBugRatio: (
    userName?: string | null,
    page?: number,
    perPage?: number,
    periodOverride?: string,
  ) => Promise<void>;

  fetchMySlsxRatio: () => Promise<void>;
  fetchLeaderboardSlsxRatio: (
    userName?: string | null,
    page?: number,
    perPage?: number,
    periodOverride?: string,
  ) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => {
  const getDashboardFilter = (): DashboardFilter => {
    const { period, selectedProjects } = get();

    return {
      period,
      project_names: selectedProjects.length ? selectedProjects : null,
    };
  };

  const getLeaderboardFilter = (
    userName?: string | null,
    page?: number,
    perPage?: number,
    periodOverride?: string,
  ): LeaderboardFilter => {
    const { period, selectedProjects } = get();

    return {
      period: periodOverride ?? period,
      project_names: selectedProjects.length ? selectedProjects : null,
      user_name: userName ?? null,
      page,
      per_page: perPage,
    };
  };

  return {
    loading: false,

    period: getCurrentPeriod(),

    selectedProjects: [],

    overview: null,

    projects: [],

    myBugRatio: null,

    leaderboardBugRatio: null,

    mySlsxRatio: null,

    leaderboardSlsxRatio: null,

    setPeriod: (period) => set({ period }),

    setSelectedProjects: (projects) =>
      set({
        selectedProjects: projects,
      }),

    fetchOverview: async () => {
      set({ loading: true });

      try {
        const overview =
          await dashboardService.getOverview(getDashboardFilter());

        set({ overview });
      } catch (error) {
        console.error("Overview API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchProjects: async () => {
      set({ loading: true });

      try {
        const projects =
          await dashboardService.getProjects(getDashboardFilter());

        set({ projects });
      } catch (error) {
        console.error("Projects API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchMyBugRatio: async () => {
      set({ loading: true });

      try {
        const myBugRatio =
          await dashboardService.getMyBugRatio(getDashboardFilter());

        set({ myBugRatio });
      } catch (error) {
        console.error("My Bug Ratio API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchLeaderboardBugRatio: async (
      userName = null,
      page = 1,
      perPage = 10,
      periodOverride,
    ) => {
      set({ loading: true });

      try {
        const leaderboardBugRatio =
          await dashboardService.getLeaderboardBugRatio(
            getLeaderboardFilter(userName, page, perPage, periodOverride),
          );

        set({ leaderboardBugRatio });
      } catch (error) {
        console.error("Leaderboard Bug Ratio API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchMySlsxRatio: async () => {
      set({ loading: true });

      try {
        const mySlsxRatio =
          await dashboardService.getMySlsxRatio(getDashboardFilter());

        set({ mySlsxRatio });
      } catch (error) {
        console.error("My SLSX Ratio API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchLeaderboardSlsxRatio: async (
      userName = null,
      page = 1,
      perPage = 10,
      periodOverride,
    ) => {
      set({ loading: true });

      try {
        const leaderboardSlsxRatio =
          await dashboardService.getLeaderboardSlsxRatio(
            getLeaderboardFilter(userName, page, perPage, periodOverride),
          );

        set({ leaderboardSlsxRatio });
      } catch (error) {
        console.error("Leaderboard SLSX API:", error);
      } finally {
        set({ loading: false });
      }
    },
  };
});
