import axiosClient from "./axios";
import { SyncResponse } from "@/types/api";

export const syncFromLastIssuesApi = () =>
  axiosClient.get<SyncResponse>("/issues/sync/from_last_issues");

export const syncFullIssuesApi = () =>
  axiosClient.get<SyncResponse>("/issues/sync/full_issues");
