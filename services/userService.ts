import { API_CONFIG } from "@/lib/api-config";
import { authToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

const USER_SERVICE_URL = API_CONFIG.USER_SERVICE_URL;

// ==================== TYPES ====================
// Backend response từ API
export interface UserProfileApiResponse {
  userId: string;
  email: string;
  userName: string;
  fullName: string;
  dob?: string;
  address?: string;
  avatarUrl?: string;
  cccdUrl?: string;
  drivingLicenseUrl?: string;
  phoneNumber?: string;
  status: string;
  role: string;
}

// Frontend sử dụng (normalized)
export interface UserProfileResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  cccdNumber?: string;
  cccdImageUrl?: string;
  drivingLicenseNumber?: string;
  drivingLicenseImageUrl?: string;
  avatarUrl?: string;
  isVerified: boolean;
  status?: string;
  role?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  cccdNumber?: string;
  drivingLicenseNumber?: string;
}

export interface UploadDocumentRequest {
  documentType: "CCCD" | "DrivingLicense" | "Avatar";
  file: File;
}

export interface VerificationStatusResponse {
  userId: string;
  isVerified: boolean;
  cccdVerified: boolean;
  drivingLicenseVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

// Helper function để normalize data từ backend sang frontend
function normalizeUserProfile(apiData: UserProfileApiResponse): UserProfileResponse {
  return {
    userId: apiData.userId,
    fullName: apiData.fullName,
    email: apiData.email,
    phoneNumber: apiData.phoneNumber,
    dateOfBirth: apiData.dob,
    address: apiData.address,
    cccdNumber: undefined, // Backend không trả về số CCCD riêng
    cccdImageUrl: apiData.cccdUrl,
    drivingLicenseNumber: undefined, // Backend không trả về số license riêng
    drivingLicenseImageUrl: apiData.drivingLicenseUrl,
    avatarUrl: apiData.avatarUrl,
    isVerified: apiData.status === "Active", // Giả định Active = verified
    status: apiData.status,
    role: apiData.role,
  };
}

// ==================== SERVICE ====================
export const userService = {
  // Lấy profile của người dùng hiện tại
  async getCurrentProfile(): Promise<ApiResponse<UserProfileResponse>> {
    const token = authToken.get();
    const response = await fetch(`${USER_SERVICE_URL}/userGateway/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result: ApiResponse<UserProfileApiResponse> = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lấy thông tin profile");
    }

    // Normalize data trước khi return
    return {
      ...result,
      data: result.data ? normalizeUserProfile(result.data) : undefined,
    } as ApiResponse<UserProfileResponse>;
  },

  // Lấy profile theo User ID
  async getProfileById(userId: string): Promise<ApiResponse<UserProfileResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${USER_SERVICE_URL}/userGateway/profile/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: ApiResponse<UserProfileApiResponse> = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể lấy thông tin profile");
    }

    // Normalize data trước khi return
    return {
      ...result,
      data: result.data ? normalizeUserProfile(result.data) : undefined,
    } as ApiResponse<UserProfileResponse>;
  },

  // Cập nhật profile
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfileResponse>> {
    const token = authToken.get();
    const response = await fetch(`${USER_SERVICE_URL}/userGateway/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể cập nhật profile");
    }

    return result;
  },

  // Upload tài liệu (CCCD, Driving License, Avatar)
  async uploadDocument(
    documentType: "CCCD" | "DrivingLicense" | "Avatar",
    file: File
  ): Promise<ApiResponse<{ fileUrl: string }>> {
    const token = authToken.get();
    const formData = new FormData();
    
    formData.append("documentType", documentType);
    formData.append("file", file);

    const response = await fetch(`${USER_SERVICE_URL}/userGateway/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Không thể upload tài liệu");
    }

    return result;
  },

  // Lấy trạng thái xác thực (Staff only)
  async getVerificationStatus(
    userId: string
  ): Promise<ApiResponse<VerificationStatusResponse>> {
    const token = authToken.get();
    const response = await fetch(
      `${USER_SERVICE_URL}/userGateway/${userId}/verification-status`,
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
      throw new Error(result.message || "Không thể lấy trạng thái xác thực");
    }

    return result;
  },

  // Xác thực người dùng (Staff only)
  async verifyUser(
    userId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const token = authToken.get();
    const response = await fetch(
      `${USER_SERVICE_URL}/userGateway/${userId}/verify`,
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
      throw new Error(result.message || "Không thể xác thực người dùng");
    }

    return result;
  },
};
