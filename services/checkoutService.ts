import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const CHECKOUT_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CheckoutPhotoRequest {
  photoUrl: string;
  description?: string;
}

export interface CreateCheckoutRequest {
  rentalOrderDetailId: string;
  staffId: string;
  odometerReading: number;
  batteryLevel: number;
  extraFee: number;
  status: string;
  photos?: CheckoutPhotoRequest[];
}

export interface CheckoutResponse {
  checkoutId: string;
  rentalOrderDetailId: string;
  staffId: string;
  odometerReading: number;
  batteryLevel: number;
  extraFee: number;
  status: string;
  photos?: CheckoutPhotoRequest[];
  createdAt: string;
}

export interface UpdateCheckoutStatusRequest {
  status: string;
}

// ==================== SERVICE ====================
export const checkoutService = {
  // Tạo checkout mới (Trả xe)
  async createCheckout(
    data: CreateCheckoutRequest
  ): Promise<ApiResponse<CheckoutResponse>> {
    const token = authToken.get();
    const response = await fetch(`${CHECKOUT_SERVICE_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể tạo checkout");
    }

    return result;
  },

  // Lấy danh sách tất cả checkout
  async getAllCheckouts(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<CheckoutResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);

    const response = await fetch(
      `${CHECKOUT_SERVICE_URL}/api/checkout?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lấy danh sách checkout");
    }

    return result;
  },

  // Lấy thông tin checkout theo ID
  async getCheckoutById(checkoutId: string): Promise<ApiResponse<CheckoutResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CHECKOUT_SERVICE_URL}/api/checkout/${checkoutId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lấy thông tin checkout");
    }

    return result;
  },

  // Lấy thông tin checkout theo Order ID
  async getCheckoutByOrderId(orderId: string): Promise<ApiResponse<CheckoutResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CHECKOUT_SERVICE_URL}/rental-contract/checkout/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lấy thông tin checkout theo order");
    }

    return result;
  },

  // Cập nhật trạng thái checkout
  async updateCheckoutStatus(
    checkoutId: string,
    data: UpdateCheckoutStatusRequest
  ): Promise<ApiResponse<CheckoutResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CHECKOUT_SERVICE_URL}/api/checkout/${checkoutId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể cập nhật trạng thái checkout");
    }

    return result;
  },
};

