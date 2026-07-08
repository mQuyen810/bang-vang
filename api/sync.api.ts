import axiosClient from "./axios";
import { SyncResponse } from "@/types/api";

let controller: AbortController | null = null;

export const cancelSyncApi = () => {
  controller?.abort();
  controller = null;
};

export const syncFromLastIssuesApi = () =>
  axiosClient.get<SyncResponse>("/issues/sync/from_last_issues", {
    signal: createSignal(),
  });

export const syncFullIssuesApi = () =>
  axiosClient.get<SyncResponse>("/issues/sync/full_issues", {
    signal: createSignal(),
  });

const createSignal = () => {
  controller?.abort();
  controller = new AbortController();
  return controller.signal;
};
