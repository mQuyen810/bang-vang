import axiosClient from "./axios";
import { SyncResponse } from "@/types/api";

let controller: AbortController | null = null;

const createNewController = () => {
  // Mỗi lần bắt đầu sync mới => tạo controller mới để request nào đang chạy thì hủy đúng request đó
  controller?.abort();
  controller = new AbortController();
  return controller;
};

export const cancelSyncApi = () => {
  controller?.abort();
  controller = null;
};

export const syncFromLastIssuesApi = () => {
  const c = createNewController();
  return axiosClient.get<SyncResponse>("/issues/sync/from_last_issues", {
    signal: c.signal,
  });
};

export const syncFullIssuesApi = () => {
  const c = createNewController();
  return axiosClient.get<SyncResponse>("/issues/sync/full_issues", {
    signal: c.signal,
  });
};
