export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  display_name: string;
  super_admin: number;
  is_admin: number;
}
