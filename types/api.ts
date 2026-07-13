export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SyncResponse {
  success: boolean;
  message: string;
}
