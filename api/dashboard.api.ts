import axiosClient from "./axios";

import {
  ApiResponse,
  Overview,
  Project,
  DashboardFilter,
  LeaderboardFilter,
  MyBugRatioResponse,
  LeaderboardBugResponse,
  MySlsxResponse,
  LeaderboardSlsxResponse,
} from "@/types";

export const getOverviewApi = () =>
  axiosClient.get<ApiResponse<Overview>>("/issues/dashboard/overview");

export const getProjectsApi = () =>
  axiosClient.get<ApiResponse<Project[]>>("/issues/dashboard/projects");

export const getMyBugRatioApi = (filter: DashboardFilter) =>
  axiosClient.post<ApiResponse<MyBugRatioResponse>>(
    "/issues/dashboard/bug_ratio/myself",
    filter,
  );

export const getLeaderboardBugRatioApi = (filter: LeaderboardFilter) =>
  axiosClient.post<ApiResponse<LeaderboardBugResponse>>(
    "/issues/dashboard/bug_ratio/leaderboard",
    filter,
  );

export const getMySlsxRatioApi = (filter: DashboardFilter) =>
  axiosClient.post<ApiResponse<MySlsxResponse>>(
    "/issues/dashboard/slsx_unlh_ratio/myself",
    filter,
  );

export const getLeaderboardSlsxRatioApi = (filter: LeaderboardFilter) =>
  axiosClient.post<ApiResponse<LeaderboardSlsxResponse>>(
    "/issues/dashboard/slsx_unlh_ratio/leaderboard",
    filter,
  );
