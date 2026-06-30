export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  display_name: string;
}
