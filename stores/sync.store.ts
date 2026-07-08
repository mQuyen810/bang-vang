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

export const useIssuesStore = create<IssuesStore>((set) => ({
  loading: false,

  syncFromLastIssues: async () => {
    set({ loading: true });

    try {
      return await issuesService.syncFromLastIssues();
    } finally {
      set({ loading: false });
    }
  },

  syncFullIssues: async () => {
    set({ loading: true });

    try {
      return await issuesService.syncFullIssues();
    } finally {
      set({ loading: false });
    }
  },
  cancelSync: () => {
    issuesService.cancelSync();
    set({ loading: false });
  },
}));
