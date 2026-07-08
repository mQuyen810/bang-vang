import {
  syncFromLastIssuesApi,
  syncFullIssuesApi,
  cancelSyncApi,
} from "@/api/sync.api";

export const issuesService = {
  async syncFromLastIssues() {
    const res = await syncFromLastIssuesApi();

    return res.data;
  },

  async syncFullIssues() {
    const res = await syncFullIssuesApi();

    return res.data;
  },
  cancelSync() {
    cancelSyncApi();
  },
};
