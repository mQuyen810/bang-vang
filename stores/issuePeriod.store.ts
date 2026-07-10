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

  overduePeriod: string;
  overdueLogWorkPeriod: string;
  milestonesPeriod: string;
  usBudgetPeriod: string;

  overdue: OverdueResponseType | null;
  overdueLogWork: OverdueLogWorkResponseType | null;
  usBudget: USBudgetResponseType | null;

  milestones: MilestonesResponseType | null;

  setOverduePeriod: (period: string) => void;
  setOverdueLogWorkPeriod: (period: string) => void;
  setMilestonesPeriod: (period: string) => void;
  setUsBudgetPeriod: (period: string) => void;

  fetchOverdue: (args: {
    issuetype?: string | null;
    status?: "Overdue" | "Warning" | null;
    table_id?: number;
    userName?: string | null;
    page?: number;
    perPage?: number;
    periodOverride?: string;
  }) => Promise<void>;

  fetchOverdueLogWork: (args: {
    issuetype?: string | null;
    statusLogWork?: "Overdue" | "Warning" | "Missing" | null;
    table_id?: number;
    userName?: string | null;
    page?: number;
    perPage?: number;
    periodOverride?: string;
  }) => Promise<void>;

  fetchMilestones: (args: {
    report_type: "MISSING" | "EXCEPTION";
    issuetype?: string | null;
    userName?: string | null;
    ticketCode?: string | null;
    page?: number;
    perPage?: number;
    periodOverride?: string;
  }) => Promise<void>;

  fetchUSBudget: (args: {
    userName?: string | null;
    page?: number;
    perPage?: number;
    periodOverride?: string;
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

  const getCommonParams = (period: string): CommonParams => {
    return {
      period,
      ...getProjectsFilter(),
    };
  };

  const getOverduePeriod = (periodOverride?: string) =>
    periodOverride ?? get().overduePeriod;
  const getOverdueLogWorkPeriod = (periodOverride?: string) =>
    periodOverride ?? get().overdueLogWorkPeriod;
  const getMilestonesPeriod = (periodOverride?: string) =>
    periodOverride ?? get().milestonesPeriod;
  const getUsBudgetPeriod = (periodOverride?: string) =>
    periodOverride ?? get().usBudgetPeriod;

  return {
    loading: false,

    overduePeriod: getCurrentPeriod(),
    overdueLogWorkPeriod: getCurrentPeriod(),
    milestonesPeriod: getCurrentPeriod(),
    usBudgetPeriod: getCurrentPeriod(),

    overdue: null,
    overdueLogWork: null,
    milestones: null,
    usBudget: null,

    setOverduePeriod: (period) => set({ overduePeriod: period }),
    setOverdueLogWorkPeriod: (period) => set({ overdueLogWorkPeriod: period }),
    setMilestonesPeriod: (period) => set({ milestonesPeriod: period }),
    setUsBudgetPeriod: (period) => set({ usBudgetPeriod: period }),

    fetchOverdue: async ({
      issuetype = null,
      status = null,
      table_id = 1,
      userName = null,
      page = 1,
      perPage = 10,
      periodOverride,
    } = {}) => {
      set({ loading: true });
      try {
        const period = getOverduePeriod(periodOverride);
        const filter = {
          ...getCommonParams(period),
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
      statusLogWork = null,
      table_id = 2,
      userName = null,
      page = 1,
      perPage = 10,
      periodOverride,
    } = {}) => {
      set({ loading: true });
      try {
        const period = getOverdueLogWorkPeriod(periodOverride);
        const filter = {
          ...getCommonParams(period),
          user_name: userName ?? null,
          page,
          per_page: perPage,
          table_id,
          issuetype,
          statusLogWork,
        };

        const overdueLogWork = await dashboardService.getOverdueLogWork(
          filter as import("@/types/dashboard").OverdueLogWorkFilter,
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
      ticketCode = null,
      page = 1,
      perPage = 10,
      periodOverride,
    }) => {
      set({ loading: true });
      try {
        const period = getMilestonesPeriod(periodOverride);
        const filter = {
          ...getCommonParams(period),
          report_type,
          user_name: userName ?? null,
          ticket_code: ticketCode ?? null,
          page,
          per_page: perPage,
          issuetype,
        };

        const milestones = await dashboardService.getMilestones(
          filter as import("@/types/dashboard").MilestonesFilter,
        );
        set({ milestones });
      } catch (error) {
        console.error("Milestones API:", error);
      } finally {
        set({ loading: false });
      }
    },

    fetchUSBudget: async ({
      userName = null,
      page = 1,
      perPage = 10,
      periodOverride,
    } = {}) => {
      set({ loading: true });
      try {
        const period = getUsBudgetPeriod(periodOverride);
        const filter = {
          ...getCommonParams(period),
          user_name: userName ?? null,
          page,
          per_page: perPage,
        };

        const usBudget = await dashboardService.getUSBudget(
          filter as import("@/types/dashboard").LeaderboardFilter,
        );
        set({ usBudget });
      } catch (error) {
        console.error("USBudget API:", error);
      } finally {
        set({ loading: false });
      }
    },
  };
});
