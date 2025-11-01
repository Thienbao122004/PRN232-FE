export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthenticationResponse {
  userId: string;
  userName: string | null;
  email: string | null;
  phone: string | null;
  token: string | null;
  success: boolean;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

