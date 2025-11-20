import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const PENALTY_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CreatePenaltyRequest {
  rentalId: string;
  reason: string;
  penaltyAmount: number;
  issuedBy: string; // Staff ID
}

export interface PenaltyResponse {
  penaltyId: string;
  rentalId: string;
  reason: string;
  penaltyAmount: number;
  issuedBy: string;
  status: string;
  createdAt: string;
}

// ==================== SERVICE ====================
export const penaltyService = {
  // Tạo penalty mới (Chỉ staff có thể tạo)
  async createPenalty(
    data: CreatePenaltyRequest
  ): Promise<ApiResponse<PenaltyResponse>> {
    const token = authToken.get();
    const response = await fetch(`${PENALTY_SERVICE_URL}/api/rental/penalty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể tạo phạt");
    }

    return result;
  },

  // Lấy thông tin penalty theo ID
  async getPenaltyById(penaltyId: string): Promise<ApiResponse<PenaltyResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${PENALTY_SERVICE_URL}/api/rental/penalty/${penaltyId}`,
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
      throw new Error(result.message || "Không thể lấy thông tin phạt");
    }

    return result;
  },

  // Lấy danh sách penalty theo Rental ID
  async getPenaltiesByRentalId(
    rentalId: string,
    params?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<PenaltyResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    try {
      const response = await fetch(
        `${PENALTY_SERVICE_URL}/api/rental/penalty/rental/${rentalId}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return {
          success: true,
          message: "Chưa có phạt",
          data: {
            data: [],
            page: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0
          }
        };
      }

      const result = await response.json();
      
      if (Array.isArray(result)) {
        return {
          success: true,
          message: "Lấy danh sách phạt thành công",
          data: {
            data: result,
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
            totalCount: result.length,
            totalPages: 1
          }
        };
      }

      // Nếu đúng format ApiResponse
      if (result.success) {
        return result;
      }

      return {
        success: true,
        message: "Chưa có phạt",
        data: {
          data: [],
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      return {
        success: true,
        message: "Chưa có phạt",
        data: {
          data: [],
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0
        }
      };
    }
  },
};

