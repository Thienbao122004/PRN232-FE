import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const RENTAL_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CreateRentalOrderRequest {
  renterId: string;
  staffId?: string; 
  vehicleId: string; 
  branchStartId: string;
  branchEndId: string;
  startTime: string; 
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
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Closed" | "Cancelled";
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
}

export interface RentalOrderDetailResponse {
  id: string;  // Backend trả về "id" (lowercase)
  vehicleId: string;
  assignedAt: string;
  returnedAt?: string;
}

export const rentalOrderService = {
  async createRentalOrder(
    data: CreateRentalOrderRequest
  ): Promise<ApiResponse<RentalOrderResponse>> {
    const token = authToken.get();
    const response = await fetch(`${RENTAL_SERVICE_URL}/api/rental/rentals`, {
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
      `${RENTAL_SERVICE_URL}/api/rental/rentals?${queryParams}`,
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
      `${RENTAL_SERVICE_URL}/api/rental/rentals/${rentalId}`,
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

  // Lấy RentalOrderDetails của một RentalOrder
  async getRentalOrderDetails(rentalId: string): Promise<ApiResponse<RentalOrderDetailResponse[]>> {
    const token = authToken.get();
    const response = await fetch(
      `${RENTAL_SERVICE_URL}/api/rental/rentals/${rentalId}/details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Không thể lấy chi tiết đơn thuê");
    }

    // Backend trả về data trực tiếp, không có success wrapper
    return {
      success: true,
      data: Array.isArray(result) ? result : [],
      message: "Success"
    };
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
      `${RENTAL_SERVICE_URL}/api/rental/rentals/renter/${renterId}?${queryParams}`,
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
      `${RENTAL_SERVICE_URL}/api/rental/rentals/${rentalId}/cancel`,
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

  async updateRentalStatus(rentalId: string, status: string): Promise<ApiResponse<RentalOrderResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${RENTAL_SERVICE_URL}/api/rental/rentals/${rentalId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể cập nhật trạng thái");
    }

    return result;
  },
};

