"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  Battery,
  TrendingUp,
  Car,
  ChevronRight,
  Bell,
  User,
  History,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { analyticsService } from "@/services/analyticsService"
import { rentalOrderService } from "@/services/rentalOrderService"
import { userService, type UserProfileResponse } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api-config"

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_CONFIG.USER_SERVICE_URL}/${cleanPath}`;
}

export default function RenterDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null)
  const [stats, setStats] = useState({
    totalRentals: 0,
    completedRentals: 0,
    totalSpent: 0,
    activeRentals: 0,
  })
  const [activeRentals, setActiveRentals] = useState<any[]>([])
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([])
  const { toast } = useToast()

  // Lấy userId từ localStorage
  const getUserId = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.userId || user.id
    }
    return null
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    const userId = getUserId()
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
      })
      return
    }

    try {
      try {
        const profileResponse = await userService.getCurrentProfile()
        if (profileResponse.success && profileResponse.data) {
          setUserProfile(profileResponse.data)
        }
      } catch (error) {
        console.error("Load profile error:", error)
      }

      const analyticsResponse = await analyticsService.getRenterSummary(userId)
      if (analyticsResponse.success && analyticsResponse.data) {
        setStats({
          totalRentals: analyticsResponse.data.totalRentals,
          completedRentals: analyticsResponse.data.completedRentals,
          totalSpent: analyticsResponse.data.totalSpent,
          activeRentals: 0, // Sẽ tính từ rentals
        })
      }

      // Gọi API lấy danh sách rentals
      const rentalsResponse = await rentalOrderService.getRentalsByRenter(userId, {
        page: 1,
        pageSize: 20,
      })
      
      if (rentalsResponse.success && rentalsResponse.data) {
        const allRentals = rentalsResponse.data.data || []
        
        // Lọc active rentals (Status = Active hoặc Pending)
        const active = allRentals.filter(
          (r: any) => r.status === "Active" || r.status === "Pending"
        )
        setActiveRentals(active)
        
        // Lọc upcoming bookings (Status = Pending và startTime > now)
        const now = new Date()
        const upcoming = allRentals.filter((r: any) => {
          if (r.status !== "Pending") return false
          const startTime = new Date(r.startTime)
          return startTime > now
        })
        setUpcomingBookings(upcoming)
      }

    } catch (error) {
      console.error("Load dashboard error:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải dữ liệu dashboard",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDisplayName = () => {
    return userProfile?.fullName || "Người dùng"
  }

  const getAvatarInitials = () => {
    const name = userProfile?.fullName || "U"
    const words = name.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  const handleCancelRental = async (rentalId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn thuê này?")) return

    try {
      await rentalOrderService.cancelRentalOrder(rentalId)
      toast({
        title: "Thành công!",
        description: "Đã hủy đơn thuê",
      })
      loadDashboardData() // Reload data
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể hủy đơn thuê",
      })
    }
  }

  const statsDisplay = [
    { 
      label: "Tổng chuyến đi", 
      value: isLoading ? "..." : stats.totalRentals.toString(), 
      icon: Car, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Hoàn thành", 
      value: isLoading ? "..." : stats.completedRentals.toString(), 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      label: "Tổng chi tiêu", 
      value: isLoading ? "..." : formatCurrency(stats.totalSpent), 
      icon: Zap, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Đang thuê", 
      value: isLoading ? "..." : activeRentals.length.toString(), 
      icon: Battery, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-border/50 fixed top-0 left-0 right-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between ml-0 lg:ml-72">
          <div>
            <h2 className="text-xl font-bold text-foreground">Tổng quan</h2>
            <p className="text-sm text-muted-foreground">Quản lý chuyến đi của bạn</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
              {userProfile?.avatarUrl ? (
                <img 
                  src={getImageUrl(userProfile.avatarUrl)}
                  alt={getDisplayName()}
                  className="w-9 h-9 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">{getAvatarInitials()}</span>
                </div>
              )}
              <span className="text-sm font-medium hidden md:block">{getDisplayName()}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-border/50 z-50 hidden lg:block shadow-xl">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
                  EV Station
                </span>
                <span className="text-xs text-muted-foreground">Rental System</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link href="/dashboard">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start h-12 text-base transition-all ${
                  activeTab === "overview" 
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg shadow-blue-500/30" 
                    : "hover:bg-blue-50 hover:translate-x-1"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <Car className="w-5 h-5 mr-3" />
                Tổng quan
              </Button>
            </Link>
            
            <Link href="/dashboard/booking">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 text-base hover:bg-green-50 hover:translate-x-1 transition-all"
              >
                <MapPin className="w-5 h-5 mr-3" />
                Đặt xe
              </Button>
            </Link>
            
            <Link href="/dashboard/history">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 text-base hover:bg-purple-50 hover:translate-x-1 transition-all"
              >
                <History className="w-5 h-5 mr-3" />
                Lịch sử
              </Button>
            </Link>
            
            <Link href="/dashboard/profile">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 text-base hover:bg-orange-50 hover:translate-x-1 transition-all"
              >
                <User className="w-5 h-5 mr-3" />
                Hồ sơ
              </Button>
            </Link>
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-border/50">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Đăng xuất
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-24 min-h-screen">
        <div className="px-6 py-8 max-w-[1600px] mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Xin chào, {getDisplayName()}!</h1>
              <p className="text-blue-50 mb-6">Sẵn sàng cho hành trình xanh hôm nay?</p>
              <Link href="/dashboard/booking">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Đặt xe ngay
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              {statsDisplay.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Rental */}
            {isLoading ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : activeRentals.length > 0 ? (
              <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Chuyến đi đang diễn ra</CardTitle>
                      <CardDescription>Mã chuyến: {activeRentals[0].rentalId}</CardDescription>
                    </div>
                    <Badge className={
                      activeRentals[0].status === "Active" 
                        ? "bg-green-500 text-white" 
                        : "bg-yellow-500 text-white"
                    }>
                      {activeRentals[0].status === "Active" ? "Đang thuê" : "Chờ xử lý"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Xe</div>
                          <div className="font-medium">ID: {activeRentals[0].vehicleId}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Điểm thuê</div>
                          <div className="font-medium">Branch: {activeRentals[0].branchStartId}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Thời gian</div>
                          <div className="font-medium">
                            {formatTime(activeRentals[0].startTime)} - {formatTime(activeRentals[0].endTime || activeRentals[0].startTime)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Chi phí dự kiến</div>
                          <div className="font-medium">{formatCurrency(activeRentals[0].estimatedCost)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/dashboard/rental/${activeRentals[0].rentalId}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                        Xem chi tiết
                      </Button>
                    </Link>
                    {activeRentals[0].status === "Pending" && (
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-transparent"
                        onClick={() => handleCancelRental(activeRentals[0].rentalId)}
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Bạn chưa có chuyến đi nào đang diễn ra</p>
                  <Link href="/dashboard/booking">
                    <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                      Đặt xe ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Bookings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Đặt chỗ sắp tới</CardTitle>
                  <Link href="/dashboard/history">
                    <Button variant="ghost" size="sm">
                      Xem tất cả
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div
                      key={booking.rentalId}
                      className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/dashboard/rental/${booking.rentalId}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Xe ID: {booking.vehicleId}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Branch: {booking.branchStartId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatDate(booking.startTime)}</div>
                        <div className="text-sm text-muted-foreground">{formatTime(booking.startTime)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Không có đặt chỗ sắp tới
                  </p>
                )}

                <Link href="/dashboard/booking">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="mr-2 w-4 h-4" />
                    Đặt xe mới
                  </Button>
                </Link>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
