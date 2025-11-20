import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const CONTRACT_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface CreateContractRequest {
  rentalId: string;
  contractType: string;
  contractFile: string; // URL hoặc base64 của file hợp đồng
}

export interface ContractResponse {
  contractId: string;
  rentalId: string;
  contractType: string;
  contractFile: string;
  signedByRenter: boolean;
  signedByStaff: boolean;
  signedAt?: string;
  createdAt: string;
}

export interface SignContractRequest {
  contractId?: number;
  signedByStaff?: number;
  signedByRenter?: number;
}

// ==================== SERVICE ====================
export const rentalContractService = {
  // Tạo hợp đồng mới
  async createContract(
    data: CreateContractRequest
  ): Promise<ApiResponse<ContractResponse>> {
    const token = authToken.get();
    const response = await fetch(`${CONTRACT_SERVICE_URL}/api/rental/rental-contracts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo hợp đồng");
    }

    const result = await response.json();
    
    return {
      success: true,
      message: "Tạo hợp đồng thành công",
      data: result
    };
  },

  // Lấy hợp đồng theo Rental ID
  async getContractByRentalId(rentalId: string): Promise<ApiResponse<ContractResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CONTRACT_SERVICE_URL}/api/rental/rental-contracts/by-rental/${rentalId}`,
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
      throw new Error(result.message || "Không thể lấy hợp đồng");
    }

    return result;
  },

  // Tìm kiếm hợp đồng
  async searchContracts(params?: {
    rentalId?: string;
    contractType?: string;
    signedByRenter?: boolean;
    signedByStaff?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<PaginatedResponse<ContractResponse>>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.rentalId) queryParams.append("rentalId", params.rentalId);
    if (params?.contractType) queryParams.append("contractType", params.contractType);
    if (params?.signedByRenter !== undefined) 
      queryParams.append("signedByRenter", params.signedByRenter.toString());
    if (params?.signedByStaff !== undefined) 
      queryParams.append("signedByStaff", params.signedByStaff.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const response = await fetch(
      `${CONTRACT_SERVICE_URL}/api/rental/rental-contracts/search?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tìm kiếm hợp đồng");
    }

    const result = await response.json();
    
    // ✅ Backend trả về trực tiếp array/paginated response
    return {
      success: true,
      message: "Tìm kiếm hợp đồng thành công",
      data: result
    };
  },

  // Ký hợp đồng điện tử
  async signContract(
    contractId: number,
    data: SignContractRequest
  ): Promise<ApiResponse<ContractResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${CONTRACT_SERVICE_URL}/api/rental/rental-contracts/${contractId}/signatures`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể ký hợp đồng");
    }

    const result = await response.json();
    
    return {
      success: true,
      message: "Ký hợp đồng thành công",
      data: result
    };
  },
};

