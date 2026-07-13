import { create } from "zustand";

import { dashboardService } from "@/services/dashboard.service";
import { useDashboardStore } from "@/stores/dashboard.store";
import type {
  LeaderboardBugResponse,
  LeaderboardSlsxResponse,
} from "@/types/dashboard";

interface RankingState {
  loading: boolean;

  leaderboardBugRatio: LeaderboardBugResponse | null;
  leaderboardSlsxRatio: LeaderboardSlsxResponse | null;

  fetchLeaderboardBugRatio: (
    userName?: string | null,
    page?: number,
    perPage?: number,
    periodOverride?: string,
  ) => Promise<void>;

  fetchLeaderboardSlsxRatio: (
    userName?: string | null,
    page?: number,
    perPage?: number,
    periodOverride?: string,
  ) => Promise<void>;
}

export const useRankingStore = create<RankingState>((set, get) => ({
  loading: false,

  leaderboardBugRatio: null,
  leaderboardSlsxRatio: null,

  fetchLeaderboardBugRatio: async (
    userName = null,
    page = 1,
    perPage = 10,
    periodOverride,
  ) => {
    set({ loading: true });

    try {
      // Ranking page hiện tại đang dùng project filter của dashboard store,
      // nhưng ở đây ta tách store nên sẽ chỉ map periodOverride.
      // project_names vẫn sẽ được lấy từ dashboard store tại component.
      // => implement bên component bằng cách truyền periodOverride + set selectedProjects
      // ở service layer nếu cần.
      // Hiện backend filter cho leaderboard đã nhận period + project_names.
      // Ta sẽ gọi service từ component, vì component đang có access selectedProjects.
      const { period, selectedProjects } = useDashboardStore.getState();
      const periodFinal = periodOverride ?? period;
      const project_names = selectedProjects.length ? selectedProjects : null;

      const filter = {
        period: periodFinal,
        project_names,
        ...(userName ? { user_name: userName } : {}),
        page,
        per_page: perPage,
      };

      const data = await dashboardService.getLeaderboardBugRatio(filter);
      set({ leaderboardBugRatio: data });
    } catch (error) {
      console.error("Leaderboard Bug Ratio API:", error);
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
      const { period, selectedProjects } = useDashboardStore.getState();
      const periodFinal = periodOverride ?? period;
      const project_names = selectedProjects.length ? selectedProjects : null;

      const filter = {
        period: periodFinal,
        project_names,
        ...(userName ? { user_name: userName } : {}),
        page,
        per_page: perPage,
      };

      const data = await dashboardService.getLeaderboardSlsxRatio(filter);
      set({ leaderboardSlsxRatio: data });
    } catch (error) {
      console.error("Leaderboard SLSX API:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
