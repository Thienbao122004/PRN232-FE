// ==================== WORKFORCE TYPES ====================

export interface Shift {
  shiftId: string
  shiftName: string
  startTime: string // TimeSpan format "HH:mm:ss"
  endTime: string
}

export interface CreateShiftRequest {
  shiftName: string
  startTime: string
  endTime: string
}

export interface UpdateShiftRequest {
  shiftName?: string
  startTime?: string
  endTime?: string
}

export interface Workday {
  workdayId: string
  staffId: string
  branchId: string
  date: string // ISO date string
  status?: string
  staffInfo?: UserProfile
  assignments?: Assignment[]
}

export interface CreateWorkdayRequest {
  staffId: string
  branchId: string
  date: string
  status?: string
}

export interface UpdateWorkdayRequest {
  staffId?: string
  branchId?: string
  date?: string
  status?: string
}

export interface WorkdayFilterRequest {
  staffId?: string
  branchId?: string
  startDate?: string
  endDate?: string
  status?: string
  pageNumber?: number
  pageSize?: number
}

export interface Assignment {
  assignmentId: string
  workdayId: string
  shiftId: string
  task?: string
  status?: string
  shift?: Shift
}

export interface CreateAssignmentRequest {
  workdayId: string
  shiftId: string
  task?: string
  status?: string
}

export interface UpdateAssignmentRequest {
  shiftId?: string
  task?: string
  status?: string
}

export interface BulkAssignmentRequest {
  staffId: string
  branchId: string
  startDate: string
  endDate: string
  shiftIds: string[]
  task?: string
}

export interface UserProfile {
  userId: string
  email: string
  userName: string
  fullName: string
  firstName?: string
  lastName?: string
  dob?: string
  address?: string
  avatarUrl?: string
  cccdUrl?: string
  phoneNumber?: string
  status: string
  role: string
}

export interface StaffSchedule {
  staffInfo: UserProfile
  workdays: Workday[]
}

export interface BranchSchedule {
  branchId: string
  startDate: string
  endDate: string
  workdays: Workday[]
}
