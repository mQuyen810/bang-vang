import {
  syncFromLastIssuesApi,
  syncFullIssuesApi,
  cancelSyncApi,
  getSyncStatusApi,
  syncCustomIssuesApi,
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

  async syncCustomIssues(fromMonth: string, toMonth: string, projects: string[]) {
    const res = await syncCustomIssuesApi(fromMonth, toMonth, projects);

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
