'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { branchService, type Branch } from '@/services/branchService'
import {
  businessAnalyticsService,
  type PeakHourData as APIPeakHourData,
  type UtilizationByBranch,
} from '@/services/businessAnalyticsService'
import {
  Activity,
  BarChart3,
  Car,
  Clock,
  DollarSign,
  MapPin,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BranchVehicleStats {
  branchId: string
  branchName: string
  address: string
  totalVehicles: number
  availableVehicles: number
  inUseVehicles: number
  maintenanceVehicles: number
  utilizationRate: number
}

interface PeakHourDisplay {
  hour: string
  rentals: number
  percentage: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchStats, setBranchStats] = useState<BranchVehicleStats[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [peakHours, setPeakHours] = useState<PeakHourDisplay[]>([])

  // Summary stats from API
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalRentals: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    utilizationRate: 0,
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedPeriod])

  const getDateRangeFromPeriod = (period: string) => {
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    }
  }

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)

      const dateRange = getDateRangeFromPeriod(selectedPeriod)

      // Load data from APIs in parallel
      const [summaryData, utilizationData, operationalData, branchesData] =
        await Promise.all([
          businessAnalyticsService.getDashboardSummary(dateRange),
          businessAnalyticsService.getVehicleUtilization(dateRange),
          businessAnalyticsService.getOperationalMetrics(dateRange),
          branchService.getAllBranches(),
        ])

      setBranches(branchesData)

      // Set summary stats from API
      setStats({
        totalRevenue: summaryData.totalRevenue || 0,
        totalRentals: summaryData.totalRentals || 0,
        totalVehicles: summaryData.totalVehicles || 0,
        activeVehicles: summaryData.activeVehicles || 0,
        utilizationRate:
          Math.round((summaryData.utilizationRate || 0) * 10) / 10,
      })

      // Process peak hours from operational metrics
      if (operationalData.peakHours && operationalData.peakHours.length > 0) {
        const formattedPeakHours = processPeakHours(operationalData.peakHours)
        setPeakHours(formattedPeakHours)
      }

      // Process branch stats from utilization data
      if (
        utilizationData.utilizationByBranch &&
        utilizationData.utilizationByBranch.length > 0
      ) {
        const formattedBranchStats = await processBranchStats(
          utilizationData.utilizationByBranch,
          branchesData
        )
        setBranchStats(formattedBranchStats)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Không thể tải dữ liệu phân tích')
    } finally {
      setLoading(false)
    }
  }

  const processPeakHours = (
    apiPeakHours: APIPeakHourData[]
  ): PeakHourDisplay[] => {
    // Find max rental count for percentage calculation
    const maxRentals = Math.max(...apiPeakHours.map((h) => h.rentalCount))

    // Group hours into 2-hour slots
    const hourSlots = [
      { range: '7-9h', hours: [7, 8] },
      { range: '9-11h', hours: [9, 10] },
      { range: '11-13h', hours: [11, 12] },
      { range: '13-15h', hours: [13, 14] },
      { range: '15-17h', hours: [15, 16] },
      { range: '17-19h', hours: [17, 18] },
    ]

    return hourSlots.map((slot) => {
      const slotData = apiPeakHours.filter((h) => slot.hours.includes(h.hour))
      const totalRentals = slotData.reduce((sum, h) => sum + h.rentalCount, 0)
      const percentage =
        maxRentals > 0 ? Math.round((totalRentals / maxRentals) * 100) : 0

      return {
        hour: slot.range,
        rentals: totalRentals,
        percentage,
      }
    })
  }

  const processBranchStats = async (
    utilizationByBranch: UtilizationByBranch[],
    branchesData: Branch[]
  ): Promise<BranchVehicleStats[]> => {
    const stats: BranchVehicleStats[] = utilizationByBranch.map(
      (branchUtil) => {
        const branch = branchesData.find(
          (b) => b.branchId === branchUtil.branchId
        )

        return {
          branchId: branchUtil.branchId,
          branchName: branchUtil.branchName,
          address: branch?.address || 'N/A',
          totalVehicles: branchUtil.totalVehicles,
          activeVehicles: branchUtil.activeVehicles,
          inUseVehicles: Math.round(
            (branchUtil.totalVehicles * branchUtil.averageUtilizationRate) / 100
          ),
          availableVehicles:
            branchUtil.activeVehicles -
            Math.round(
              (branchUtil.totalVehicles * branchUtil.averageUtilizationRate) /
                100
            ),
          maintenanceVehicles:
            branchUtil.totalVehicles - branchUtil.activeVehicles,
          utilizationRate:
            Math.round(branchUtil.averageUtilizationRate * 10) / 10,
        }
      }
    )

    // Sort by total vehicles descending
    stats.sort((a, b) => b.totalVehicles - a.totalVehicles)
    return stats
  }

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'text-red-600'
    if (rate >= 60) return 'text-yellow-600'
    if (rate >= 40) return 'text-green-600'
    return 'text-blue-600'
  }

  const getUtilizationBgColor = (rate: number) => {
    if (rate >= 80) return 'bg-red-500'
    if (rate >= 60) return 'bg-yellow-500'
    if (rate >= 40) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phân Tích & Báo Cáo</h1>
          <p className="text-muted-foreground">
            Dashboard tổng quan về doanh thu, lượt thuê và phân bố xe
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn kỳ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalRentals} lượt thuê
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số xe</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVehicles} xe hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ sử dụng</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getUtilizationColor(
                stats.utilizationRate
              )}`}
            >
              {stats.utilizationRate}%
            </div>
            <p className="text-xs text-muted-foreground">Trung bình hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm cho thuê</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">Chi nhánh hoạt động</p>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Phân tích giờ cao điểm
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Nhu cầu thuê xe theo khung giờ trong ngày
          </p>
        </CardHeader>
        <CardContent>
          {peakHours.length > 0 ? (
            <>
              <div className="space-y-4">
                {peakHours.map((hour, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{hour.hour}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">
                          {hour.percentage}%
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({hour.rentals} chuyến)
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          hour.percentage >= 90
                            ? 'bg-red-500'
                            : hour.percentage >= 75
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${hour.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {peakHours.length > 0 && (
                  <>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-900">
                          Giờ cao điểm nhất
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {
                          peakHours.reduce((max, h) =>
                            h.percentage > max.percentage ? h : max
                          ).hour
                        }
                      </p>
                      <p className="text-sm text-red-700">
                        Nhu cầu{' '}
                        {
                          peakHours.reduce((max, h) =>
                            h.percentage > max.percentage ? h : max
                          ).percentage
                        }
                        % - Cần chuẩn bị xe dự phòng
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">
                          Giờ thấp điểm nhất
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          peakHours.reduce((min, h) =>
                            h.percentage < min.percentage ? h : min
                          ).hour
                        }
                      </p>
                      <p className="text-sm text-green-700">
                        Nhu cầu{' '}
                        {
                          peakHours.reduce((min, h) =>
                            h.percentage < min.percentage ? h : min
                          ).percentage
                        }
                        % - Có thể áp dụng giá ưu đãi
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu giờ cao điểm
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branch Vehicle Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân bố xe theo điểm cho thuê
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tổng quan số lượng và trạng thái xe tại mỗi chi nhánh
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {branchStats.map((branch) => (
              <Card key={branch.branchId} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                          {branch.branchName}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {branch.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {branch.totalVehicles}
                      </div>
                      <p className="text-xs text-muted-foreground">Tổng xe</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {branch.availableVehicles}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sẵn sàng
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {branch.inUseVehicles}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Đang thuê
                      </div>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {branch.maintenanceVehicles}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bảo trì
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div
                        className={`text-2xl font-bold ${getUtilizationColor(
                          branch.utilizationRate
                        )}`}
                      >
                        {branch.utilizationRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sử dụng
                      </div>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Tỷ lệ sử dụng
                      </span>
                      <span
                        className={`font-medium ${getUtilizationColor(
                          branch.utilizationRate
                        )}`}
                      >
                        {branch.utilizationRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getUtilizationBgColor(
                          branch.utilizationRate
                        )}`}
                        style={{ width: `${branch.utilizationRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {branchStats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu chi nhánh
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                Doanh thu trung bình/chuyến
              </span>
              <span className="font-bold text-blue-600">
                {formatCurrency(
                  stats.totalRentals > 0
                    ? stats.totalRevenue / stats.totalRentals
                    : 0
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                Số lượt thuê trung bình/xe
              </span>
              <span className="font-bold text-green-600">
                {stats.totalVehicles > 0
                  ? Math.round(
                      (stats.totalRentals / stats.totalVehicles) * 10
                    ) / 10
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                Xe đang hoạt động
              </span>
              <span className="font-bold text-purple-600">
                {stats.activeVehicles} / {stats.totalVehicles}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Khuyến nghị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-900 mb-1">
                ⚠️ Tỷ lệ sử dụng{' '}
                {stats.utilizationRate >= 80
                  ? 'cao'
                  : stats.utilizationRate >= 60
                  ? 'trung bình'
                  : 'thấp'}
              </p>
              <p className="text-xs text-yellow-800">
                {stats.utilizationRate >= 80
                  ? 'Cân nhắc bổ sung thêm xe để đáp ứng nhu cầu'
                  : stats.utilizationRate >= 60
                  ? 'Giám sát và chuẩn bị kế hoạch mở rộng nếu cần'
                  : 'Có thể áp dụng các chiến dịch marketing để tăng lượt thuê'}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">
                💡 Tối ưu giờ cao điểm
              </p>
              <p className="text-xs text-blue-800">
                Tăng cường xe và nhân viên vào khung 17:00-19:00
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-1">
                ✅ Chiến lược giá linh hoạt
              </p>
              <p className="text-xs text-green-800">
                Áp dụng giá ưu đãi giờ thấp điểm (13:00-15:00) để tăng tỷ lệ sử
                dụng
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
