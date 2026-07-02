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

export const getOverviewApi = (filter: DashboardFilter) =>
  axiosClient.get<ApiResponse<Overview>>("/issues/dashboard/overview", {
    params: filter,
  });

export const getProjectsApi = (filter: DashboardFilter) =>
  axiosClient.get<ApiResponse<Project[]>>("/issues/dashboard/projects", {
    params: filter,
  });

export const getMyBugRatioApi = (filter: DashboardFilter) =>
  axiosClient.get<ApiResponse<MyBugRatioResponse>>(
    "/issues/dashboard/bug_ratio/myself",
    {
      params: filter,
    },
  );

export const getLeaderboardBugRatioApi = (filter: LeaderboardFilter) =>
  axiosClient.get<ApiResponse<LeaderboardBugResponse>>(
    "/issues/dashboard/leaderboard/bug_ratio",
    {
      params: filter,
    },
  );

export const getMySlsxRatioApi = (filter: DashboardFilter) =>
  axiosClient.get<ApiResponse<MySlsxResponse>>(
    "/issues/dashboard/slsx_ulnl_ratio/myself",
    {
      params: filter,
    },
  );

export const getLeaderboardSlsxRatioApi = (filter: LeaderboardFilter) =>
  axiosClient.get<ApiResponse<LeaderboardSlsxResponse>>(
    "/issues/dashboard/leaderboard/slsx_ulnl_ratio",
    {
      params: filter,
    },
  );
