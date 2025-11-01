import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const FEEDBACK_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CreateFeedbackRequest {
  rentalId: string;
  renterId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface FeedbackResponse {
  feedbackId: string;
  rentalId: string;
  renterId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ==================== SERVICE ====================
export const feedbackService = {
  // Tạo feedback mới
  async createFeedback(
    data: CreateFeedbackRequest
  ): Promise<ApiResponse<FeedbackResponse>> {
    const token = authToken.get();
    const response = await fetch(`${FEEDBACK_SERVICE_URL}/api/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể tạo đánh giá");
    }

    return result;
  },

  // Lấy danh sách tất cả feedback (có phân trang và lọc)
  async getAllFeedbacks(params?: {
    page?: number;
    pageSize?: number;
    minRating?: number;
    maxRating?: number;
  }): Promise<ApiResponse<PaginatedResponse<FeedbackResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.minRating) queryParams.append("minRating", params.minRating.toString());
    if (params?.maxRating) queryParams.append("maxRating", params.maxRating.toString());

    const response = await fetch(
      `${FEEDBACK_SERVICE_URL}/api/feedbacks?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy danh sách đánh giá");
    }

    return result;
  },

  // Lấy chi tiết feedback theo ID
  async getFeedbackById(feedbackId: string): Promise<ApiResponse<FeedbackResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${FEEDBACK_SERVICE_URL}/api/feedbacks/${feedbackId}`,
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
      throw new Error(result.message || "Không thể lấy thông tin đánh giá");
    }

    return result;
  },

  // Lấy feedback theo Rental ID
  async getFeedbacksByRentalId(
    rentalId: string,
    params?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<FeedbackResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const response = await fetch(
      `${FEEDBACK_SERVICE_URL}/api/feedbacks/rental/${rentalId}?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy đánh giá của đơn thuê");
    }

    return result;
  },

  // Lấy feedback theo Renter ID
  async getFeedbacksByRenterId(
    renterId: string,
    params?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<FeedbackResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const response = await fetch(
      `${FEEDBACK_SERVICE_URL}/api/feedbacks/renter/${renterId}?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy lịch sử đánh giá");
    }

    return result;
  },
};

