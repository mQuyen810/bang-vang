import { create } from "zustand";

import { dashboardService } from "@/services/dashboard.service";
import { getCurrentPeriod } from "@/utils/date";

import { useDashboardStore } from "@/stores/dashboard.store";

import type {
  MilestonesResponseType,
  OverdueResponseType,
  OverdueLogWorkResponseType,
  USBudgetResponseType,
} from "@/types/dashboard";

interface IssuePeriodState {
  loading: boolean;

  period: string;

  overdue: OverdueResponseType | null;
  overdueLogWork: OverdueLogWorkResponseType | null;
  usBudget: USBudgetResponseType | null;

  milestones: MilestonesResponseType | null;

  setPeriod: (period: string) => void;

  fetchOverdue: (args: {
    issuetype?: string | null;
    status?: "Overdue" | "Warning" | null;
    table_id?: number;
    userName?: string | null;
    page?: number;
    perPage?: number;
  }) => Promise<void>;

  fetchOverdueLogWork: (args: {
    issuetype?: string | null;
    status?: "Overdue" | "Warning" | "Missing" | null;
    table_id?: number;
    userName?: string | null;
    page?: number;
    perPage?: number;
  }) => Promise<void>;

  fetchMilestones: (args: {
    report_type: "MISSING" | "EXCEPTION";
    issuetype?: string | null;
    userName?: string | null;
    page?: number;
    perPage?: number;
  }) => Promise<void>;

  fetchUSBudget: (args: {
    userName?: string | null;
    page?: number;
    perPage?: number;
  }) => Promise<void>;
}

type ProjectsFilter = {
  project_names: string[] | null;
};

type CommonParams = ProjectsFilter & {
  period: string;
};

export const useIssuePeriodStore = create<IssuePeriodState>((set, get) => {
  const getProjectsFilter = (): ProjectsFilter => {
    const { selectedProjects } = useDashboardStore.getState();

    return {
      project_names: selectedProjects.length ? selectedProjects : null,
    };
  };

  const getCommonParams = (): CommonParams => {
    const { period } = get();
    return {
      period,
      ...getProjectsFilter(),
    };
  };

  return {
    loading: false,

    period: getCurrentPeriod(),

    overdue: null,
    overdueLogWork: null,
    milestones: null,
    usBudget: null,

    milestones: null,

    setPeriod: (period) => set({ period }),

    fetchOverdue: async ({
      issuetype = null,
      status = null,
      table_id = 1,
      userName = null,
      page = 1,
      perPage = 10,
    } = {}) => {
      set({ loading: true });
      try {
        const filter = {
          ...getCommonParams(),
          user_name: userName ?? null,
          page,
          per_page: perPage,
          table_id,
          issuetype,
          status,
        };

        const overdue = await dashboardService.getOverdue(
          filter as import("@/types/dashboard").OverdueFilter,
        );

        set({ overdue });
      } catch (error) {
        console.error("Overdue API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchOverdueLogWork: async ({
      issuetype = null,
      status = null,
      table_id = 2,
      userName = null,
      page = 1,
      perPage = 10,
    } = {}) => {
      set({ loading: true });
      try {
        const filter = {
          ...getCommonParams(),
          user_name: userName ?? null,
          page,
          per_page: perPage,
          table_id,
          issuetype,
          status,
        };

        const overdueLogWork = await dashboardService.getOverdueLogWork(
          filter as unknown as import("@/types/dashboard").OverdueLogWorkFilter,
        );

        set({ overdueLogWork });
      } catch (error) {
        console.error("Overdue LogWork API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchMilestones: async ({
      report_type,
      issuetype = null,
      userName = null,
      page = 1,
      perPage = 10,
    }) => {
      set({ loading: true });
      try {
        const filter = {
          ...getCommonParams(),
          report_type,
          user_name: userName ?? null,
          page,
          per_page: perPage,
          issuetype,
        };

        const milestones = await dashboardService.getMilestones(filter as any);
        set({ milestones });
      } catch (error) {
        console.error("Milestones API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchUSBudget: async ({ userName = null, page = 1, perPage = 10 } = {}) => {
      set({ loading: true });
      try {
        const filter = {
          ...getCommonParams(),
          user_name: userName ?? null,
          page,
          per_page: perPage,
        };

        const usBudget = await dashboardService.getUSBudget(filter as any);

        set({ usBudget });
      } catch (error) {
        console.error("USBudget API:", error);
      } finally {
        set({ loading: false });
      }
    },
  };
});
