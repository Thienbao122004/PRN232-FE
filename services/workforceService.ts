import { API_ENDPOINTS } from '@/lib/api-config'
import { getAuthHeaders } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'
import type {
  Assignment,
  BranchSchedule,
  BulkAssignmentRequest,
  CreateAssignmentRequest,
  CreateShiftRequest,
  CreateWorkdayRequest,
  Shift,
  StaffSchedule,
  UpdateAssignmentRequest,
  UpdateShiftRequest,
  UpdateWorkdayRequest,
  Workday,
  WorkdayFilterRequest,
} from '@/types/workforce'

// ==================== SHIFT SERVICES ====================

export const shiftService = {
  async getAllShifts(): Promise<Shift[]> {
    const response = await fetch(API_ENDPOINTS.SHIFTS.GET_ALL, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch shifts')
    }

    const result: ApiResponse<Shift[]> = await response.json()
    return result.data
  },

  async getShiftById(shiftId: string): Promise<Shift> {
    const response = await fetch(API_ENDPOINTS.SHIFTS.GET_BY_ID(shiftId), {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch shift')
    }

    const result: ApiResponse<Shift> = await response.json()
    return result.data
  },

  async createShift(data: CreateShiftRequest): Promise<Shift> {
    const response = await fetch(API_ENDPOINTS.SHIFTS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create shift')
    }

    const result: ApiResponse<Shift> = await response.json()
    return result.data
  },

  async updateShift(shiftId: string, data: UpdateShiftRequest): Promise<Shift> {
    const response = await fetch(API_ENDPOINTS.SHIFTS.UPDATE(shiftId), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update shift')
    }

    const result: ApiResponse<Shift> = await response.json()
    return result.data
  },

  async deleteShift(shiftId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.SHIFTS.DELETE(shiftId), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete shift')
    }
  },
}

// ==================== WORKDAY SERVICES ====================

export const workdayService = {
  async getWorkdays(filter: WorkdayFilterRequest = {}): Promise<Workday[]> {
    const params = new URLSearchParams()
    if (filter.staffId) params.append('staffId', filter.staffId)
    if (filter.branchId) params.append('branchId', filter.branchId)
    if (filter.startDate) params.append('startDate', filter.startDate)
    if (filter.endDate) params.append('endDate', filter.endDate)
    if (filter.status) params.append('status', filter.status)
    if (filter.pageNumber)
      params.append('pageNumber', filter.pageNumber.toString())
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())

    const url = `${API_ENDPOINTS.WORKDAYS.GET_ALL}?${params.toString()}`
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch workdays')
    }

    const result: ApiResponse<Workday[]> = await response.json()
    return result.data
  },

  async getWorkdayById(workdayId: string): Promise<Workday> {
    const response = await fetch(API_ENDPOINTS.WORKDAYS.GET_BY_ID(workdayId), {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch workday')
    }

    const result: ApiResponse<Workday> = await response.json()
    return result.data
  },

  async createWorkday(data: CreateWorkdayRequest): Promise<Workday> {
    const response = await fetch(API_ENDPOINTS.WORKDAYS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create workday')
    }

    const result: ApiResponse<Workday> = await response.json()
    return result.data
  },

  async updateWorkday(
    workdayId: string,
    data: UpdateWorkdayRequest
  ): Promise<Workday> {
    const response = await fetch(API_ENDPOINTS.WORKDAYS.UPDATE(workdayId), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update workday')
    }

    const result: ApiResponse<Workday> = await response.json()
    return result.data
  },

  async deleteWorkday(workdayId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.WORKDAYS.DELETE(workdayId), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete workday')
    }
  },

  async getStaffSchedule(
    staffId: string,
    startDate: string,
    endDate: string
  ): Promise<StaffSchedule> {
    const params = new URLSearchParams({ startDate, endDate })
    const url = `${API_ENDPOINTS.WORKDAYS.GET_STAFF_SCHEDULE(
      staffId
    )}?${params.toString()}`

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch staff schedule')
    }

    const result: ApiResponse<Workday[]> = await response.json()

    // Transform API response to StaffSchedule format
    const workdays = result.data || []
    const staffInfo = workdays.length > 0 ? workdays[0].staffInfo : null

    return {
      staffInfo: staffInfo || {
        userId: staffId,
        email: '',
        userName: '',
        fullName: '',
        status: '',
        role: 'staff',
      },
      workdays: workdays,
    }
  },

  async getBranchSchedule(
    branchId: string,
    startDate: string,
    endDate: string
  ): Promise<BranchSchedule> {
    const params = new URLSearchParams({ startDate, endDate })
    const url = `${API_ENDPOINTS.WORKDAYS.GET_BRANCH_SCHEDULE(
      branchId
    )}?${params.toString()}`

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch branch schedule')
    }

    const result: ApiResponse<Workday[] | BranchSchedule> =
      await response.json()

    // Handle both array and object responses
    if (Array.isArray(result.data)) {
      return {
        branchId: branchId,
        startDate: startDate,
        endDate: endDate,
        workdays: result.data,
      }
    }

    // If already in BranchSchedule format, ensure workdays is an array
    return {
      ...result.data,
      workdays: result.data.workdays || [],
    }
  },
}

// ==================== ASSIGNMENT SERVICES ====================

export const assignmentService = {
  async getAssignmentById(assignmentId: string): Promise<Assignment> {
    const response = await fetch(
      API_ENDPOINTS.ASSIGNMENTS.GET_BY_ID(assignmentId),
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch assignment')
    }

    const result: ApiResponse<Assignment> = await response.json()
    return result.data
  },

  async getAssignmentsByWorkday(workdayId: string): Promise<Assignment[]> {
    const response = await fetch(
      API_ENDPOINTS.ASSIGNMENTS.GET_BY_WORKDAY(workdayId),
      {
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch assignments')
    }

    const result: ApiResponse<Assignment[]> = await response.json()
    return result.data
  },

  async createAssignment(data: CreateAssignmentRequest): Promise<Assignment> {
    const response = await fetch(API_ENDPOINTS.ASSIGNMENTS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create assignment')
    }

    const result: ApiResponse<Assignment> = await response.json()
    return result.data
  },

  async createBulkAssignments(
    data: BulkAssignmentRequest
  ): Promise<Assignment[]> {
    const response = await fetch(API_ENDPOINTS.ASSIGNMENTS.CREATE_BULK, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create bulk assignments')
    }

    const result: ApiResponse<Assignment[]> = await response.json()
    return result.data
  },

  async updateAssignment(
    assignmentId: string,
    data: UpdateAssignmentRequest
  ): Promise<Assignment> {
    const response = await fetch(
      API_ENDPOINTS.ASSIGNMENTS.UPDATE(assignmentId),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update assignment')
    }

    const result: ApiResponse<Assignment> = await response.json()
    return result.data
  },

  async deleteAssignment(assignmentId: string): Promise<void> {
    const response = await fetch(
      API_ENDPOINTS.ASSIGNMENTS.DELETE(assignmentId),
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete assignment')
    }
  },
}
