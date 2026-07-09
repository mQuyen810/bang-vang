import axiosClient from "./axios";
import { ApiResponse } from "@/types/api";

type MilestonesResponseType = any;



type MilestonesFilter = {
  period: string | null;
  project_names: string[] | null;
  user_name: string | null;
  page?: number;
  per_page?: number;
  issuetype: string | null;
  status: "Missing" | "Exception" | null;
  table_id: number;
};



export const getMilestonesApi = (filter: MilestonesFilter) =>
  axiosClient.get<ApiResponse<MilestonesResponseType>>(
    "/issues/milestones",
    {
      params: filter,
    },
  );


