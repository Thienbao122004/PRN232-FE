import type {
  LoginRequest,
  RegisterRequest,
  AuthenticationResponse,
  LogoutResponse,
} from "@/types/auth";
import { API_ENDPOINTS } from "@/lib/api-config";
import { authToken } from "@/lib/auth";

export const authService = {
  async login(data: LoginRequest): Promise<AuthenticationResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Invalid email or password");
    }

    return response.json();
  },

  async register(data: RegisterRequest): Promise<AuthenticationResponse> {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Registration failed. Email might already exist."
      );
    }

    return response.json();
  },

  async logout(): Promise<LogoutResponse> {
    const token = authToken.get();

    const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    authToken.remove();
    return response.json();
  },

  async googleLogin(idToken: string): Promise<AuthenticationResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH.LOGIN.replace('/login', '/google-login')}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Đăng nhập Google thất bại");
    }

    // Lưu token vào localStorage
    if (result.data && result.data.token) {
      authToken.set(result.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(result.data));
      }
    }

    return result;
  },
};

