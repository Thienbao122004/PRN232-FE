import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const PAYMENT_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CreatePaymentRequest {
  rentalId: string;
  amount: number;
  paymentMethod: string; // "Cash", "CreditCard", "DebitCard", "MoMo", "ZaloPay"
  transactionRef?: string; // Transaction reference (DEPOSIT, FINAL_PAYMENT, REFUND, etc.)
}

export interface PaymentResponse {
  paymentId: string;
  rentalId: string;
  amount: number;
  paymentMethod: string;
  status: string; // "Pending", "Paid", "Failed", "Refunded"
  paymentDate?: string;
  transactionRef?: string;
  createdAt: string;
}

// ==================== SERVICE ====================
export const paymentService = {
  // Tạo thanh toán mới
  async createPayment(
    data: CreatePaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> {
    const token = authToken.get();
    const response = await fetch(`${PAYMENT_SERVICE_URL}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể tạo thanh toán");
    }

    return result;
  },

  async getAllPayments(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResponse<PaymentResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy danh sách thanh toán");
    }

    return result;
  },

  // Lấy chi tiết thanh toán theo ID
  async getPaymentById(paymentId: string): Promise<ApiResponse<PaymentResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/${paymentId}`,
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
      throw new Error(result.message || "Không thể lấy thông tin thanh toán");
    }

    return result;
  },

  // Lấy danh sách thanh toán theo Rental ID
  async getPaymentsByRentalId(
    rentalId: string,
    params?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<ApiResponse<PaginatedResponse<PaymentResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/rental/${rentalId}?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy danh sách thanh toán của đơn thuê");
    }

    return result;
  },

  // Lấy lịch sử thanh toán của người thuê
  async getPaymentsByRenterId(
    renterId: string,
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<PaymentResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(
      `${PAYMENT_SERVICE_URL}/api/payments/renter/${renterId}?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy lịch sử thanh toán");
    }

    return result;
  },
};

