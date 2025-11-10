import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const CHECKIN_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CheckinPhotoRequest {
  photoUrl: string;
  description?: string;
}

export interface CreateCheckinRequest {
  rentalOrderDetailId: string;
  staffId: string;
  odometerReading: number;
  batteryLevel: number;
  status: string;
  photos?: CheckinPhotoRequest[];
}

export interface CheckinResponse {
  checkinId: string;
  rentalOrderDetailId: string;
  staffId: string;
  datetime: string;  
  odometerReading: number;
  batteryLevel: number;
  status: string;
  photos?: CheckinPhotoRequest[];
}

export interface UpdateCheckinStatusRequest {
  status: string;
}

export const checkinService = {
  async createCheckin(
    data: CreateCheckinRequest
  ): Promise<ApiResponse<CheckinResponse>> {
    const token = authToken.get();
    const response = await fetch(`${CHECKIN_SERVICE_URL}/api/checkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Không thể tạo checkin" }));
      throw new Error(error.message || "Không thể tạo checkin");
    }

    const result = await response.json();
    
    if (result.success !== undefined) {
      return result;
    }
    
    return {
      success: true,
      data: result,
      message: "Checkin created successfully"
    };
  },

  async getAllCheckins(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<CheckinResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);

    const response = await fetch(
      `${CHECKIN_SERVICE_URL}/api/checkin?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy danh sách checkin");
    }

    return result;
  },

  async getCheckinById(checkinId: string): Promise<ApiResponse<CheckinResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CHECKIN_SERVICE_URL}/api/checkin/${checkinId}`,
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
      throw new Error(result.message || "Không thể lấy thông tin checkin");
    }

    return result;
  },

  async getCheckinByOrderId(orderId: string): Promise<ApiResponse<CheckinResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CHECKIN_SERVICE_URL}/rental-contract/checkin/${orderId}`,
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
      throw new Error(result.message || "Không thể lấy thông tin checkin theo order");
    }

    return result;
  },

  async updateCheckinStatus(
    checkinId: string,
    data: UpdateCheckinStatusRequest
  ): Promise<ApiResponse<CheckinResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CHECKIN_SERVICE_URL}/api/checkin/${checkinId}/status`,
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
      throw new Error(result.message || "Không thể cập nhật trạng thái checkin");
    }

    return result;
  },
};

