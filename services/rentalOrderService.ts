import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const RENTAL_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CreateRentalOrderRequest {
  renterId: string;
  vehicleId: string;
  branchStartId: string;
  branchEndId: string;
  startTime: string; // ISO datetime
  endTime: string;
  estimatedCost: number;
}

export interface RentalOrderResponse {
  rentalId: string;
  renterId: string;
  staffId?: string;
  vehicleId: string;
  branchStartId: string;
  branchEndId: string;
  startTime: string;
  endTime?: string;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
}

// ==================== SERVICE ====================
export const rentalOrderService = {
  // Tạo đơn thuê xe mới
  async createRentalOrder(
    data: CreateRentalOrderRequest
  ): Promise<ApiResponse<RentalOrderResponse>> {
    const token = authToken.get();
    const response = await fetch(`${RENTAL_SERVICE_URL}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể tạo đơn thuê");
    }

    return result;
  },

  // Lấy danh sách tất cả đơn thuê (có phân trang và lọc)
  async getAllRentals(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResponse<RentalOrderResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(
      `${RENTAL_SERVICE_URL}/api/rentals?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy danh sách đơn thuê");
    }

    return result;
  },

  // Lấy chi tiết đơn thuê theo ID
  async getRentalOrderById(rentalId: string): Promise<ApiResponse<RentalOrderResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${RENTAL_SERVICE_URL}/api/rentals/${rentalId}`,
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
      throw new Error(result.message || "Không thể lấy thông tin đơn thuê");
    }

    return result;
  },

  // Lấy lịch sử thuê xe của người thuê
  async getRentalsByRenter(
    renterId: string,
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<RentalOrderResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(
      `${RENTAL_SERVICE_URL}/api/rentals/renter/${renterId}?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy lịch sử thuê xe");
    }

    return result;
  },

  // Hủy đơn thuê (chỉ được hủy khi Status = Pending)
  async cancelRentalOrder(rentalId: string): Promise<ApiResponse<null>> {
    const token = authToken.get();
    const response = await fetch(
      `${RENTAL_SERVICE_URL}/api/rentals/${rentalId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể hủy đơn thuê");
    }

    return result;
  },
};

