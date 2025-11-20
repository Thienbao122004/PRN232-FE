import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

const ANALYTICS_SERVICE_URL = API_CONFIG.RENTAL_PAYMENT_SERVICE_URL;

// ==================== TYPES ====================
export interface RenterAnalyticsResponse {
  renterId: string;
  totalRentals: number;
  completedRentals: number;
  cancelledRentals: number;
  activeRentals: number;
  totalSpent: number;
  averageCostPerRental: number;
  mostRentedVehicleId?: string;
  mostVisitedBranchId?: string;
  rentalsByDay: RentalByTimeResponse[];
  rentalsByHour: RentalByTimeResponse[];
  rentalsByMonth: RentalByTimeResponse[];
  rentalsByBranch: RentalByBranchResponse[];
}

export interface RenterAnalyticsSummaryResponse {
  renterId: string;
  totalRentals: number;
  completedRentals: number;
  totalSpent: number;
  averageCostPerRental: number;
}

export interface RentalByTimeResponse {
  period: string; // Day, Hour, Month
  count: number;
  totalCost: number;
}

export interface RentalByBranchResponse {
  branchId: string;
  branchName?: string;
  count: number;
  totalCost: number;
}

// ==================== SERVICE ====================
export const analyticsService = {
  // Lấy thống kê chi tiết của người thuê
  async getRenterAnalytics(
    renterId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<RenterAnalyticsResponse>> {
    const token = authToken.get();
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(
      `${ANALYTICS_SERVICE_URL}/api/rental/analytics/renter/${renterId}?${queryParams}`,
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
      throw new Error(result.message || "Không thể lấy thống kê");
    }

    return result;
  },

  // Lấy tóm tắt thống kê của người thuê
  async getRenterSummary(
    renterId: string
  ): Promise<ApiResponse<RenterAnalyticsSummaryResponse>> {
    const token = authToken.get();

    const response = await fetch(
      `${ANALYTICS_SERVICE_URL}/api/rental/analytics/renter/${renterId}/summary`,
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
      throw new Error(result.message || "Không thể lấy tóm tắt thống kê");
    }

    return result;
  },
};

