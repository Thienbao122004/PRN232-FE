import { API_CONFIG } from "@/lib/api-config";
import { getAuthHeaders } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

const GATEWAY_URL = API_CONFIG.GATEWAY_URL;

// ==================== TYPES ====================
export interface Branch {
  branchId: string;
  branchName: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  contactNumber?: string;
  workingHours?: string;
  status: string;
  totalVehicles: number;
  availableVehicles: number;
}

export interface BranchCreateRequest {
  branchName: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  contactNumber?: string;
  workingHours?: string;
}

export interface BranchUpdateRequest {
  branchName?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  contactNumber?: string;
  workingHours?: string;
  status?: string;
}

export interface BranchResponse {
  branchId: string;
  branchName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  workingHours: string;
  availableVehicles?: number;
  distance?: string;
}

// ==================== SERVICE ====================
export const branchService = {
  // Lấy tất cả chi nhánh
  async getAllBranches(): Promise<Branch[]> {
    const response = await fetch(`${GATEWAY_URL}/api/fleet/Branch`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách chi nhánh");
    }

    return await response.json();
  },

  // Lấy chi tiết chi nhánh theo ID
  async getBranchById(branchId: string): Promise<Branch> {
    const response = await fetch(`${GATEWAY_URL}/api/fleet/Branch/${branchId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin chi nhánh");
    }

    return await response.json();
  },

  // Tạo chi nhánh mới
  async createBranch(data: BranchCreateRequest): Promise<Branch> {
    const response = await fetch(`${GATEWAY_URL}/api/fleet/Branch`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo chi nhánh");
    }

    return await response.json();
  },

  // Cập nhật chi nhánh
  async updateBranch(branchId: string, data: BranchUpdateRequest): Promise<Branch> {
    const response = await fetch(`${GATEWAY_URL}/api/fleet/Branch/${branchId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể cập nhật chi nhánh");
    }

    return await response.json();
  },

  // Xóa chi nhánh
  async deleteBranch(branchId: string): Promise<void> {
    const response = await fetch(`${GATEWAY_URL}/api/fleet/Branch/${branchId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa chi nhánh");
    }
  },
};

