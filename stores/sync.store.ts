import { create } from "zustand";
import { issuesService } from "@/services/sync.service";

interface SyncResponse {
  success: boolean;
  message: string;
}

interface IssuesStore {
  loading: boolean;
  syncFromLastIssues: () => Promise<SyncResponse>;
  syncFullIssues: () => Promise<SyncResponse>;
  cancelSync: () => void;
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
  loading: false,

  syncFromLastIssues: async () => {
    set({ loading: true });
    try {
      return await issuesService.syncFromLastIssues();
    } catch (err) {
      // Khi user đăng xuất/cancel thì chỉ cần dừng silent
      if (isAbortError(err)) {
        throw err;
      }
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  syncFullIssues: async () => {
    set({ loading: true });
    try {
      return await issuesService.syncFullIssues();
    } catch (err) {
      if (isAbortError(err)) {
        throw err;
      }
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  cancelSync: () => {
    issuesService.cancelSync();
    set({ loading: false });
  },
}));
