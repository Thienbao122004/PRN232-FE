import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

const FLEET_SERVICE_URL = API_CONFIG.FLEET_SERVICE_URL;

// ==================== TYPES ====================
export interface BranchResponse {
  branchId: string;
  branchName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  workingHours: string;
  // Thêm các field tính toán
  availableVehicles?: number;
  distance?: string;
}

// ==================== SERVICE ====================
export const branchService = {
  // Lấy tất cả chi nhánh
  async getAllBranches(): Promise<ApiResponse<BranchResponse[]>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Branch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách chi nhánh");
    }

    const result = await response.json();
    
    // Fleet Service trả về array trực tiếp, cần wrap thành ApiResponse format
    if (Array.isArray(result)) {
      return {
        success: true,
        message: "Success",
        data: result
      };
    }

    return result;
  },

  // Lấy chi tiết chi nhánh theo ID
  async getBranchById(branchId: string): Promise<ApiResponse<BranchResponse>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Branch/${branchId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin chi nhánh");
    }

    const result = await response.json();
    
    // Wrap nếu cần
    if (!result.success) {
      return {
        success: true,
        message: "Success",
        data: result
      };
    }

    return result;
  },
};

