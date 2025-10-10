"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Car,
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const systemStats = {
    totalRevenue: 125000000,
    totalRentals: 1250,
    totalCustomers: 3420,
    totalVehicles: 125,
    activeRentals: 45,
    availableVehicles: 68,
    stations: 12,
    staff: 48,
  }

  const revenueByStation = [
    { station: "Quận 1", revenue: 28500000, rentals: 285 },
    { station: "Quận 3", revenue: 22300000, rentals: 223 },
    { station: "Quận 7", revenue: 19800000, rentals: 198 },
    { station: "Quận 2", revenue: 18200000, rentals: 182 },
    { station: "Quận 5", revenue: 15600000, rentals: 156 },
  ]

  const alerts = [
    {
      id: "A-001",
      type: "maintenance",
      message: "3 xe cần bảo trì định kỳ trong tuần này",
      priority: "medium",
    },
    {
      id: "A-002",
      type: "customer",
      message: "2 khiếu nại mới từ khách hàng cần xử lý",
      priority: "high",
    },
    {
      id: "A-003",
      type: "staff",
      message: "Điểm thuê Quận 7 thiếu nhân viên ca chiều",
      priority: "medium",
    },
  ]

  const topPerformers = [
    { name: "Trần Văn B", station: "Quận 1", transactions: 156, rating: 4.9 },
    { name: "Nguyễn Thị C", station: "Quận 3", transactions: 142, rating: 4.8 },
    { name: "Lê Văn D", station: "Quận 7", transactions: 138, rating: 4.9 },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                EV Station
              </span>
              <div className="text-xs text-muted-foreground">Quản trị viên</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">Quản trị hệ thống</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Link href="/admin">
                    <Button variant="default" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Tổng quan
                    </Button>
                  </Link>
                  <Link href="/admin/fleet">
                    <Button variant="ghost" className="w-full justify-start">
                      <Car className="w-4 h-4 mr-2" />
                      Quản lý xe
                    </Button>
                  </Link>
                  <Link href="/admin/stations">
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Điểm thuê
                    </Button>
                  </Link>
                  <Link href="/admin/customers">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Khách hàng
                    </Button>
                  </Link>
                  <Link href="/admin/staff">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Nhân viên
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button variant="ghost" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Phân tích
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </Button>
                  </Link>
                  <div className="pt-4 border-t">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </Button>
                    </Link>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Bảng điều khiển quản trị</h1>
              <p className="text-blue-50">Tổng quan hệ thống EV Station</p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{(systemStats.totalRevenue / 1000000).toFixed(0)}M</div>
                  <div className="text-sm text-muted-foreground">Doanh thu tháng</div>
                  <div className="text-xs text-green-600 mt-1">+12.5% so với tháng trước</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{systemStats.totalRentals}</div>
                  <div className="text-sm text-muted-foreground">Chuyến thuê</div>
                  <div className="text-xs text-blue-600 mt-1">+8.3% so với tháng trước</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{systemStats.totalCustomers}</div>
                  <div className="text-sm text-muted-foreground">Khách hàng</div>
                  <div className="text-xs text-green-600 mt-1">+156 khách mới</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{systemStats.stations}</div>
                  <div className="text-sm text-muted-foreground">Điểm thuê</div>
                  <div className="text-xs text-blue-600 mt-1">{systemStats.staff} nhân viên</div>
                </CardContent>
              </Card>
            </div>

            {/* Fleet Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tình trạng đội xe</CardTitle>
                <CardDescription>Trạng thái xe trên toàn hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Sẵn sàng</div>
                    <div className="text-3xl font-bold text-green-600">{systemStats.availableVehicles}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((systemStats.availableVehicles / systemStats.totalVehicles) * 100).toFixed(0)}% tổng số
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Đang thuê</div>
                    <div className="text-3xl font-bold text-blue-600">{systemStats.activeRentals}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((systemStats.activeRentals / systemStats.totalVehicles) * 100).toFixed(0)}% tổng số
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Đang sạc</div>
                    <div className="text-3xl font-bold text-yellow-600">8</div>
                    <div className="text-xs text-muted-foreground mt-1">6% tổng số</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Bảo trì</div>
                    <div className="text-3xl font-bold text-red-600">4</div>
                    <div className="text-xs text-muted-foreground mt-1">3% tổng số</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Station */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Doanh thu theo điểm thuê</CardTitle>
                    <CardDescription>Top 5 điểm có doanh thu cao nhất</CardDescription>
                  </div>
                  <Link href="/admin/analytics">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {revenueByStation.map((station, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{station.station}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{(station.revenue / 1000000).toFixed(1)}M</div>
                        <div className="text-xs text-muted-foreground">{station.rentals} chuyến</div>
                      </div>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                        style={{ width: `${(station.revenue / revenueByStation[0].revenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Cảnh báo hệ thống</CardTitle>
                <CardDescription>Các vấn đề cần xử lý</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border-l-4 ${
                      alert.priority === "high" ? "bg-red-50 border-l-red-500" : "bg-yellow-50 border-l-yellow-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          alert.priority === "high" ? "text-red-600" : "text-yellow-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-medium mb-1">{alert.message}</div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              alert.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {alert.priority === "high" ? "Ưu tiên cao" : "Ưu tiên trung bình"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Mã: {alert.id}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Xử lý
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Nhân viên xuất sắc</CardTitle>
                <CardDescription>Top 3 nhân viên có hiệu suất cao nhất tháng này</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-muted-foreground">{performer.station}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{performer.transactions} giao dịch</div>
                      <div className="text-sm text-yellow-600 flex items-center gap-1">
                        <span>⭐</span>
                        {performer.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
