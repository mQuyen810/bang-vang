import { create } from "zustand";
import { issuesService } from "@/services/sync.service";

interface SyncResponse {
  success: boolean;
  message: string;
}

interface IssuesStore {
  loadingLast: boolean;
  loadingFull: boolean;
  setLoadingLast: (loading: boolean) => void;
  setLoadingFull: (loading: boolean) => void;
  syncFromLastIssues: () => Promise<SyncResponse>;
  syncFullIssues: () => Promise<SyncResponse>;
  syncCustomIssues: (fromMonth: string, toMonth: string, projects: string[]) => Promise<SyncResponse>;
  cancelSync: () => void;
  syncTimestamp: number;
  triggerRefresh: () => void;
}

type AbortLikeError = {
  name?: string;
  code?: string;
};

const isAbortError = (err: unknown) => {
  if (!err) return false;
  const anyErr = err as AbortLikeError;

  return (
    anyErr?.name === "CanceledError" ||
    anyErr?.name === "AbortError" ||
    anyErr?.code === "ERR_CANCELED"
  );
};

export const useIssuesStore = create<IssuesStore>((set) => ({
  loadingLast: false,
  loadingFull: false,
  setLoadingLast: (loading) => set({ loadingLast: loading }),
  setLoadingFull: (loading) => set({ loadingFull: loading }),
  syncTimestamp: Date.now(),
  triggerRefresh: () => set({ syncTimestamp: Date.now() }),

  syncFromLastIssues: async () => {
    try {
      return await issuesService.syncFromLastIssues();
    } catch (err) {
      if (isAbortError(err)) {
        throw err;
      }
      throw err;
    }
  },

  syncFullIssues: async () => {
    try {
      return await issuesService.syncFullIssues();
    } catch (err) {
      if (isAbortError(err)) {
        throw err;
      }
      throw err;
    }
  },

  syncCustomIssues: async (fromMonth, toMonth, projects) => {
    try {
      return await issuesService.syncCustomIssues(fromMonth, toMonth, projects);
    } catch (err) {
      if (isAbortError(err)) {
        throw err;
      }
      throw err;
    }
  },

  cancelSync: () => {
    issuesService.cancelSync();
    set({ loadingLast: false, loadingFull: false });
  },
}));
