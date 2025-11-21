import { API_CONFIG } from '@/lib/api-config'
import { getAuthHeaders } from '@/lib/auth'

// Response Types
export interface RevenueByPeriod {
  period: string
  revenue: number
  rentalCount: number
  averageRevenuePerRental: number
}

export interface RevenueByBranch {
  branchId: string
  branchName: string
  totalRevenue: number
  rentalCount: number
  utilizationRate: number
}

export interface RevenueAnalyticsData {
  totalRevenue: number
  paidRevenue: number
  pendingRevenue: number
  refundedRevenue: number
  averageRevenuePerRental: number
  totalRentals: number
  completedRentals: number
  activeRentals: number
  cancelledRentals: number
  revenueByPeriod: RevenueByPeriod[]
  revenueByBranch: RevenueByBranch[]
  revenueByVehicleType: any[]
}

export interface VehicleUtilization {
  vehicleId: string
  vehicleName: string
  vehicleType: string
  status: string
  totalRentals: number
  totalRentalHours: number
  utilizationRate: number
  revenue: number
  averageRating: number
}

export interface UtilizationByBranch {
  branchId: string
  branchName: string
  totalVehicles: number
  activeVehicles: number
  averageUtilizationRate: number
  totalRevenue: number
}

export interface VehicleUtilizationData {
  overallUtilizationRate: number
  totalVehicles: number
  activeVehicles: number
  inMaintenanceVehicles: number
  availableVehicles: number
  totalRentalHours: number
  totalPossibleHours: number
  vehicles: VehicleUtilization[]
  utilizationByBranch: UtilizationByBranch[]
  utilizationByVehicleType: any[]
}

export interface CustomerSegment {
  segment: string
  customerCount: number
  percentage: number
  averageSpending: number
}

export interface CustomerAnalyticsData {
  totalCustomers: number
  activeCustomers: number
  newCustomersInPeriod: number
  customerRetentionRate: number
  averageCustomerLifetimeValue: number
  averageRentalsPerCustomer: number
  topCustomers: any[]
  customerSegments: CustomerSegment[]
}

export interface PeakHourData {
  hour: number
  rentalCount: number
  percentage: number
}

export interface OperationalMetricsData {
  totalStaff: number
  activeStaff: number
  totalMaintenanceRecords: number
  pendingMaintenanceCount: number
  completedMaintenanceCount: number
  averageMaintenanceTime: number
  peakHours: PeakHourData[]
  branchPerformance: any[]
  staffProductivity: any[]
}

export interface DashboardSummary {
  totalRevenue: number
  totalRentals: number
  totalCustomers: number
  totalVehicles: number
  activeVehicles: number
  utilizationRate: number
  averageRevenuePerRental: number
  customerRetentionRate: number
  topPerformingBranch: {
    branchId: string
    branchName: string
    revenue: number
  } | null
  recentTrends: {
    revenueGrowth: number
    rentalGrowth: number
    customerGrowth: number
  }
}

export interface ComparisonData {
  currentPeriod: {
    startDate: string
    endDate: string
    totalRevenue: number
    totalRentals: number
    totalCustomers: number
    utilizationRate: number
  }
  previousPeriod: {
    startDate: string
    endDate: string
    totalRevenue: number
    totalRentals: number
    totalCustomers: number
    utilizationRate: number
  }
  comparison: {
    revenueChange: number
    revenueChangePercentage: number
    rentalChange: number
    rentalChangePercentage: number
    customerChange: number
    customerChangePercentage: number
    utilizationChange: number
  }
}

// Request Parameters
export interface AnalyticsParams {
  startDate?: string
  endDate?: string
  branchId?: string
  vehicleType?: string
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

class BusinessAnalyticsService {
  private readonly baseUrl = `${API_CONFIG.WORKFORCE_SERVICE_URL}/workforcegateway/BusinessAnalytics`

  async getRevenueAnalytics(
    params?: AnalyticsParams
  ): Promise<RevenueAnalyticsData> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('StartDate', params.startDate)
    if (params?.endDate) queryParams.append('EndDate', params.endDate)
    if (params?.branchId) queryParams.append('BranchId', params.branchId)
    if (params?.vehicleType)
      queryParams.append('VehicleType', params.vehicleType)
    if (params?.period) queryParams.append('Period', params.period)

    const url = `${this.baseUrl}/revenue${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch revenue analytics')
    const result = await response.json()
    return result.data
  }

  async getVehicleUtilization(
    params?: AnalyticsParams
  ): Promise<VehicleUtilizationData> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('StartDate', params.startDate)
    if (params?.endDate) queryParams.append('EndDate', params.endDate)
    if (params?.branchId) queryParams.append('BranchId', params.branchId)
    if (params?.vehicleType)
      queryParams.append('VehicleType', params.vehicleType)

    const url = `${this.baseUrl}/vehicle-utilization${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch vehicle utilization')
    const result = await response.json()
    return result.data
  }

  async getCustomerAnalytics(
    params?: AnalyticsParams
  ): Promise<CustomerAnalyticsData> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('StartDate', params.startDate)
    if (params?.endDate) queryParams.append('EndDate', params.endDate)
    if (params?.branchId) queryParams.append('BranchId', params.branchId)

    const url = `${this.baseUrl}/customer${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch customer analytics')
    const result = await response.json()
    return result.data
  }

  async getOperationalMetrics(
    params?: AnalyticsParams
  ): Promise<OperationalMetricsData> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('StartDate', params.startDate)
    if (params?.endDate) queryParams.append('EndDate', params.endDate)
    if (params?.branchId) queryParams.append('BranchId', params.branchId)

    const url = `${this.baseUrl}/operational${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch operational metrics')
    const result = await response.json()
    return result.data
  }

  async getDashboardSummary(
    params?: AnalyticsParams
  ): Promise<DashboardSummary> {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('StartDate', params.startDate)
    if (params?.endDate) queryParams.append('EndDate', params.endDate)

    const url = `${this.baseUrl}/dashboard${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch dashboard summary')
    const result = await response.json()
    return result.data
  }

  async getComparison(
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ): Promise<ComparisonData> {
    const url = `${this.baseUrl}/comparison?CurrentStartDate=${currentStart}&CurrentEndDate=${currentEnd}&PreviousStartDate=${previousStart}&PreviousEndDate=${previousEnd}`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch comparison data')
    const result = await response.json()
    return result.data
  }

  async getSummary(): Promise<DashboardSummary> {
    const url = `${this.baseUrl}/summary`
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch summary')
    const result = await response.json()
    return result.data
  }
}

export const businessAnalyticsService = new BusinessAnalyticsService()
