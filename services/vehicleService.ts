import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

const FLEET_SERVICE_URL = API_CONFIG.FLEET_SERVICE_URL;

// ==================== TYPES ====================
export interface VehicleTypeResponse {
  typeId: string;
  typeName: string;
  brand: string;
  model: string;
  defaultBattery: number;
  basePrice: number;
  description?: string;
}

export interface VehicleResponse {
  vehicleId: string;
  plateNumber: string;
  chassisNumber: string;
  batteryCapacity: number;
  typeId: string;
  manufactureYear: number;
  color: string;
  qrCode?: string;
  status: "Available" | "Rented" | "Maintenance" | "Unavailable";
  currentBranchId?: string;
  // Joined data from TypeVehicle
  typeVehicle?: VehicleTypeResponse;
}

// ==================== SERVICE ====================
export const vehicleService = {
  // Lấy tất cả xe
  async getAllVehicles(): Promise<ApiResponse<VehicleResponse[]>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Vehicle`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách xe");
    }

    const result = await response.json();
    
    if (Array.isArray(result)) {
      return {
        success: true,
        message: "Success",
        data: result
      };
    }

    return result;
  },

  // Lấy chi tiết xe theo ID
  async getVehicleById(vehicleId: string): Promise<ApiResponse<VehicleResponse>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Vehicle/${vehicleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin xe");
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

  // Lấy xe theo trạng thái
  async getVehiclesByStatus(status: string): Promise<ApiResponse<VehicleResponse[]>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Vehicle/status/${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách xe");
    }

    const result = await response.json();
    
    // Wrap array response
    if (Array.isArray(result)) {
      return {
        success: true,
        message: "Success",
        data: result
      };
    }

    return result;
  },

  // Lấy xe theo loại
  async getVehiclesByType(typeId: string): Promise<ApiResponse<VehicleResponse[]>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Vehicle/type/${typeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách xe theo loại");
    }

    const result = await response.json();
    
    // Wrap array response
    if (Array.isArray(result)) {
      return {
        success: true,
        message: "Success",
        data: result
      };
    }

    return result;
  },

  // Lấy tóm tắt thông tin xe
  async getVehicleSummary(): Promise<ApiResponse<any>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/Vehicle/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy tóm tắt xe");
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

  // ==================== TYPE VEHICLE APIs ====================
  
  // Lấy tất cả loại xe
  async getAllVehicleTypes(): Promise<ApiResponse<VehicleTypeResponse[]>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/TypeVehicle`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách loại xe");
    }

    const result = await response.json();
    
    // Wrap array response
    if (Array.isArray(result)) {
      return {
        success: true,
        message: "Success",
        data: result
      };
    }

    return result;
  },

  // Lấy chi tiết loại xe
  async getVehicleTypeById(typeId: string): Promise<ApiResponse<VehicleTypeResponse>> {
    const token = authToken.get();
    const response = await fetch(`${FLEET_SERVICE_URL}/api/fleet/TypeVehicle/${typeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin loại xe");
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

