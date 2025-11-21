import { API_CONFIG } from '@/lib/api-config'
import { authToken } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'

const WORKFORCE_SERVICE_URL = `${API_CONFIG.GATEWAY_URL}/workforce`

// ==================== TYPES ====================
export interface UserManagementResponse {
  userId: string
  email: string
  userName: string
  fullName: string
  dob?: string
  address?: string
  avatarUrl?: string
  cccdUrl?: string
  phoneNumber?: string
  status: string
  role: string
}

export interface AdminUpdateUserRequest {
  fullName?: string
  dob?: string
  address?: string
  phoneNumber?: string
  status?: string
  role?: string
}

export interface ChangeUserRoleRequest {
  userId: string
  newRole: string
}

export interface LockUserRequest {
  userId: string
  isLocked: boolean
  reason?: string
}

export interface DeleteUserRequest {
  userId: string
  reason?: string
}

export interface VerifyUserRequest {
  status: string
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  lockedUsers: number
  staffCount: number
  customerCount: number
}

// ==================== HELPER FUNCTIONS ====================
function getAuthHeaders() {
  const token = authToken.get()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// ==================== USER MANAGEMENT SERVICE ====================
export const userManagementService = {
  // Lấy thông tin user theo ID
  async getUserById(userId: string): Promise<UserManagementResponse> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    const result: ApiResponse<UserManagementResponse> = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể lấy thông tin người dùng')
    }

    return result.data!
  },

  // Lấy nhiều users cùng lúc
  async getMultipleUsers(
    userIds: string[]
  ): Promise<Record<string, UserManagementResponse>> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/bulk`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userIds),
      }
    )

    const result: ApiResponse<Record<string, UserManagementResponse>> =
      await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể lấy thông tin người dùng')
    }

    return result.data || {}
  },

  // Lấy danh sách users theo role (từ UserService)
  async getUsersByRole(role: string): Promise<UserManagementResponse[]> {
    const response = await fetch(
      `${API_CONFIG.GATEWAY_URL}/userGateway/?role=${role}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách người dùng')
    }

    const result: ApiResponse<UserManagementResponse[]> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Không thể lấy danh sách người dùng')
    }

    return result.data || []
  },

  // Lấy tất cả users (customers + staff)
  async getAllUsers(): Promise<UserManagementResponse[]> {
    try {
      const [customers, staff] = await Promise.all([
        this.getUsersByRole('customer'),
        this.getUsersByRole('staff'),
      ])

      return [...customers, ...staff]
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  },

  // Cập nhật thông tin user
  async updateUser(
    userId: string,
    request: AdminUpdateUserRequest
  ): Promise<UserManagementResponse> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      }
    )

    const result: ApiResponse<UserManagementResponse> = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể cập nhật người dùng')
    }

    return result.data!
  },

  // Thay đổi role
  async changeUserRole(
    userId: string,
    newRole: string
  ): Promise<{ userId: string; newRole: string }> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}/role`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, newRole }),
      }
    )

    const result: ApiResponse<{ userId: string; newRole: string }> =
      await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể thay đổi role')
    }

    return result.data!
  },

  // Khóa tài khoản
  async lockUser(
    userId: string,
    reason?: string
  ): Promise<{ userId: string; isLocked: boolean; reason?: string }> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}/lock`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, isLocked: true, reason }),
      }
    )

    const result: ApiResponse<{
      userId: string
      isLocked: boolean
      reason?: string
    }> = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể khóa người dùng')
    }

    return result.data!
  },

  // Mở khóa tài khoản
  async unlockUser(
    userId: string
  ): Promise<{ userId: string; isLocked: boolean }> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}/unlock`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
      }
    )

    const result: ApiResponse<{ userId: string; isLocked: boolean }> =
      await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể mở khóa người dùng')
    }

    return result.data!
  },

  // Xóa tài khoản
  async deleteUser(
    userId: string,
    reason?: string
  ): Promise<{ userId: string; reason?: string }> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: reason ? JSON.stringify({ userId, reason }) : undefined,
      }
    )

    const result: ApiResponse<{ userId: string; reason?: string }> =
      await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể xóa người dùng')
    }

    return result.data!
  },

  // Verify/Phê duyệt tài khoản
  async verifyUser(
    userId: string,
    status: string
  ): Promise<UserManagementResponse> {
    const response = await fetch(
      `${WORKFORCE_SERVICE_URL}/usermanagement/${userId}/verify`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      }
    )

    const result: ApiResponse<UserManagementResponse> = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể verify người dùng')
    }

    return result.data!
  },

  // Lấy thống kê users
  async getUserStatistics(): Promise<UserStatistics> {
    try {
      const allUsers = await this.getAllUsers()

      const stats: UserStatistics = {
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter((u) => u.status === 'active').length,
        pendingUsers: allUsers.filter((u) => u.status === 'pending').length,
        lockedUsers: allUsers.filter((u) => u.status === 'locked').length,
        staffCount: allUsers.filter((u) => u.role === 'staff').length,
        customerCount: allUsers.filter((u) => u.role === 'customer').length,
      }

      return stats
    } catch (error) {
      console.error('Error getting user statistics:', error)
      throw error
    }
  },
}
