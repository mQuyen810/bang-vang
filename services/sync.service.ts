import {
  syncFromLastIssuesApi,
  syncFullIssuesApi,
  cancelSyncApi,
  getSyncStatusApi,
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
  async getSyncStatus(mode: "last" | "full") {
    const res = await getSyncStatusApi(mode);
    return res.data;
  },
};
