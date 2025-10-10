"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Car,
  Users,
  CheckCircle,
  AlertTriangle,
  Battery,
  MapPin,
  LogOut,
  ClipboardCheck,
  DollarSign,
  Settings,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function StaffDashboard() {
  const stationInfo = {
    name: "Điểm thuê Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    staffName: "Trần Văn B",
    shift: "Ca sáng (7:00 - 15:00)",
  }

  const todayStats = {
    totalHandovers: 12,
    pickups: 8,
    returns: 4,
    revenue: 4200000,
  }

  const vehicleStatus = {
    available: 12,
    rented: 8,
    maintenance: 2,
    charging: 3,
  }

  const pendingTasks = [
    {
      id: "T-001",
      type: "pickup",
      customer: "Nguyễn Văn A",
      vehicle: "VinFast VF e34",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: "T-002",
      type: "return",
      customer: "Lê Thị C",
      vehicle: "VinFast VF 5",
      time: "10:30 AM",
      status: "pending",
    },
    {
      id: "T-003",
      type: "pickup",
      customer: "Phạm Văn D",
      vehicle: "VinFast VF 8",
      time: "11:00 AM",
      status: "scheduled",
    },
  ]

  const recentActivities = [
    {
      id: "A-001",
      action: "Bàn giao xe",
      customer: "Trần Thị E",
      vehicle: "VinFast VF e34",
      time: "9:30 AM",
      status: "completed",
    },
    {
      id: "A-002",
      action: "Thu tiền",
      customer: "Hoàng Văn F",
      amount: 350000,
      time: "9:15 AM",
      status: "completed",
    },
    {
      id: "A-003",
      action: "Nhận xe",
      customer: "Đỗ Thị G",
      vehicle: "VinFast VF 5",
      time: "9:00 AM",
      status: "completed",
    },
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
              <div className="text-xs text-muted-foreground">Nhân viên</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{stationInfo.staffName}</div>
                <div className="text-xs text-muted-foreground">{stationInfo.shift}</div>
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
                <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Điểm làm việc</span>
                  </div>
                  <div className="font-bold">{stationInfo.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stationInfo.address}</div>
                </div>

                <nav className="space-y-2">
                  <Link href="/staff">
                    <Button variant="default" className="w-full justify-start">
                      <Car className="w-4 h-4 mr-2" />
                      Tổng quan
                    </Button>
                  </Link>
                  <Link href="/staff/handover">
                    <Button variant="ghost" className="w-full justify-start">
                      <ClipboardCheck className="w-4 h-4 mr-2" />
                      Giao nhận xe
                    </Button>
                  </Link>
                  <Link href="/staff/verification">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Xác thực KH
                    </Button>
                  </Link>
                  <Link href="/staff/payment">
                    <Button variant="ghost" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Thanh toán
                    </Button>
                  </Link>
                  <Link href="/staff/vehicles">
                    <Button variant="ghost" className="w-full justify-start">
                      <Battery className="w-4 h-4 mr-2" />
                      Quản lý xe
                    </Button>
                  </Link>
                  <Link href="/staff/settings">
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
              <h1 className="text-3xl font-bold mb-2">Chào buổi sáng, {stationInfo.staffName}!</h1>
              <p className="text-blue-50 mb-4">Bạn có {pendingTasks.length} nhiệm vụ đang chờ xử lý hôm nay</p>
              <div className="flex gap-3">
                <Link href="/staff/handover">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Xem nhiệm vụ
                  </Button>
                </Link>
              </div>
            </div>

            {/* Today Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{todayStats.totalHandovers}</div>
                  <div className="text-sm text-muted-foreground">Giao dịch hôm nay</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{todayStats.pickups}</div>
                  <div className="text-sm text-muted-foreground">Xe đã giao</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{todayStats.returns}</div>
                  <div className="text-sm text-muted-foreground">Xe đã nhận</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{(todayStats.revenue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Doanh thu</div>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tình trạng xe tại điểm</CardTitle>
                <CardDescription>Trạng thái hiện tại của đội xe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Sẵn sàng</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600">{vehicleStatus.available}</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Đang thuê</span>
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{vehicleStatus.rented}</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Đang sạc</span>
                      <Battery className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">{vehicleStatus.charging}</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Bảo trì</span>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-red-600">{vehicleStatus.maintenance}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Nhiệm vụ đang chờ</CardTitle>
                    <CardDescription>Các giao dịch cần xử lý</CardDescription>
                  </div>
                  <Link href="/staff/handover">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          task.type === "pickup" ? "bg-green-50" : "bg-blue-50"
                        }`}
                      >
                        {task.type === "pickup" ? (
                          <Car className="w-6 h-6 text-green-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{task.customer}</div>
                        <div className="text-sm text-muted-foreground">{task.vehicle}</div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-medium">{task.time}</div>
                        <Badge
                          variant="secondary"
                          className={
                            task.status === "pending" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-700"
                          }
                        >
                          {task.status === "pending" ? "Đang chờ" : "Đã đặt"}
                        </Badge>
                      </div>
                      <Link href={`/staff/handover/${task.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                          Xử lý
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các giao dịch đã hoàn thành</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.customer}
                          {activity.vehicle && ` • ${activity.vehicle}`}
                          {activity.amount && ` • ${activity.amount.toLocaleString()}đ`}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
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
