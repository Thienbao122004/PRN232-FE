import { API_CONFIG } from '@/lib/api-config'
import { getAuthHeaders } from '@/lib/auth'

const GATEWAY_URL = API_CONFIG.GATEWAY_URL

// ==================== TYPES ====================
export interface UserReport {
  reportId: string
  reporterId: string
  reporterEmail?: string
  reporterName?: string
  reportType: string
  category: string
  priority: string
  title: string
  description: string
  relatedStationId?: string
  relatedVehicleId?: string
  relatedRentalId?: string
  attachmentUrls?: string[]
  status: string
  assignedToStaffId?: string
  assignedToStaffName?: string
  staffNotes?: string
  resolution?: string
  createdAt: string
  updatedAt: string
  startedAt?: string
  resolvedAt?: string
  userRating?: number
  userFeedback?: string
}

export interface CreateReportRequest {
  reportType: string
  category: string
  priority: string
  title: string
  description: string
  relatedStationId?: string
  relatedVehicleId?: string
  relatedRentalId?: string
  attachmentUrls?: string[]
}

export interface UpdateReportRequest {
  priority?: string
  status?: string
  assignedToStaffId?: string
  staffNotes?: string
  resolution?: string
}

export interface AssignReportRequest {
  staffId: string
  notes?: string
}

export interface ResolveReportRequest {
  resolution: string
  staffNotes?: string
}

export interface ReportFilterRequest {
  reportType?: string
  category?: string
  status?: string
  priority?: string
  assignedToStaffId?: string
  reporterId?: string
  fromDate?: string
  toDate?: string
  searchKeyword?: string
  pageNumber?: number
  pageSize?: number
}

export interface ReportListResponse {
  reports: UserReport[]
  totalRecords: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface ReportStatistics {
  totalReports: number
  pendingReports: number
  inProgressReports: number
  resolvedReports: number
  closedReports: number
  rejectedReports: number
  reportsByType: Record<string, number>
  reportsByCategory: Record<string, number>
  reportsByPriority: Record<string, number>
  averageResolutionTimeHours: number
  averageRating: number
}

// ==================== SERVICE ====================
export const reportService = {
  // Lấy danh sách tất cả báo cáo (với filter)
  async getReports(filter?: ReportFilterRequest): Promise<ReportListResponse> {
    const params = new URLSearchParams()
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report?${params.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách báo cáo')
    }

    const result = await response.json()

    // Handle both response formats
    if (result.success && result.data) {
      // If data has pagination structure
      if (result.data.reports) {
        return result.data
      }
      // If data is direct array
      if (Array.isArray(result.data)) {
        return {
          reports: result.data,
          totalRecords: result.data.length,
          pageNumber: 1,
          pageSize: result.data.length,
          totalPages: 1,
        }
      }
    }

    // Fallback for direct pagination object
    if (result.reports) {
      return result
    }

    // Default empty response
    return {
      reports: [],
      totalRecords: 0,
      pageNumber: 1,
      pageSize: 0,
      totalPages: 0,
    }
  },

  // Lấy báo cáo của tôi
  async getMyReports(): Promise<UserReport[]> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/my-reports`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách báo cáo của tôi')
    }

    const result = await response.json()
    return result.data
  },

  // Lấy báo cáo được assign cho tôi
  async getMyAssignedReports(): Promise<UserReport[]> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/my-assigned`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách báo cáo được assign')
    }

    const result = await response.json()
    return result.data
  },

  // Lấy chi tiết báo cáo theo ID
  async getReportById(reportId: string): Promise<UserReport> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Không thể lấy thông tin báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Tạo báo cáo mới
  async createReport(data: CreateReportRequest): Promise<UserReport> {
    const response = await fetch(`${GATEWAY_URL}/workforcegateway/Report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể tạo báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Cập nhật báo cáo
  async updateReport(
    reportId: string,
    data: UpdateReportRequest
  ): Promise<UserReport> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể cập nhật báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Assign báo cáo cho staff
  async assignReport(
    reportId: string,
    data: AssignReportRequest
  ): Promise<UserReport> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}/assign`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể assign báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Giải quyết báo cáo
  async resolveReport(
    reportId: string,
    data: ResolveReportRequest
  ): Promise<UserReport> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}/resolve`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể giải quyết báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Đóng báo cáo
  async closeReport(reportId: string): Promise<UserReport> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}/close`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể đóng báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Từ chối báo cáo
  async rejectReport(reportId: string, reason: string): Promise<UserReport> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}/reject`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể từ chối báo cáo')
    }

    const result = await response.json()
    return result.data
  },

  // Xóa báo cáo
  async deleteReport(reportId: string): Promise<void> {
    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/${reportId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Không thể xóa báo cáo')
    }
  },

  // Lấy thống kê báo cáo
  async getStatistics(
    fromDate?: string,
    toDate?: string
  ): Promise<ReportStatistics> {
    const params = new URLSearchParams()
    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)

    const response = await fetch(
      `${GATEWAY_URL}/workforcegateway/Report/statistics?${params.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Không thể lấy thống kê báo cáo')
    }

    const result = await response.json()
    return result.data
  },
}
