export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface SyncResponse {
  success: boolean;
  message: string;
}
