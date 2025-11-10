"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, MapPin, Calendar, Clock, TrendingUp, Car, Download, Filter, Battery, DollarSign, Loader2, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { rentalOrderService, type RentalOrderResponse } from "@/services/rentalOrderService"
import { userService, type UserProfileResponse } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api-config"

// Helper để tạo full URL cho image
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_CONFIG.USER_SERVICE_URL}/${cleanPath}`;
}

export default function HistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [rentals, setRentals] = useState<RentalOrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null)
  const { toast } = useToast()

  const getUserId = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.userId || user.id
    }
    return null
  }

  useEffect(() => {
    loadRentals()
    loadUserProfile()
  }, [currentPage, selectedPeriod])

  const loadUserProfile = async () => {
    try {
      const response = await userService.getCurrentProfile()
      if (response.success && response.data) {
        setUserProfile(response.data)
      }
    } catch (error) {
      console.error("Load profile error:", error)
    }
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

  const loadRentals = async () => {
    const userId = getUserId()
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng đăng nhập lại",
      })
      return
    }

    setIsLoading(true)
    try {
      const params: any = {
        page: currentPage,
        pageSize: 10,
      }

      if (selectedPeriod !== "all") {
        params.status = selectedPeriod
      }

      const response = await rentalOrderService.getRentalsByRenter(userId, params)
      
      if (response.success && response.data) {
        setRentals(response.data.data)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải lịch sử",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      Pending: { label: "Chờ xử lý", className: "bg-yellow-500 text-white" },
      Active: { label: "Đang thuê", className: "bg-green-500 text-white" },
      Completed: { label: "Hoàn thành", className: "bg-blue-500 text-white" },
      Cancelled: { label: "Đã hủy", className: "bg-red-500 text-white" },
    }
    return statusMap[status] || { label: status, className: "bg-gray-500 text-white" }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const rentalHistory = (rentals || []).map(r => ({
    id: r.rentalId,
    vehicle: `Xe ${r.vehicleId}`,
    station: `Chi nhánh ${r.branchStartId}`,
    date: formatDate(r.startTime),
    duration: r.endTime ? `${Math.ceil((new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / (1000 * 60 * 60))} giờ` : "N/A",
    distance: 0,
    cost: r.actualCost || r.estimatedCost,
    status: r.status.toLowerCase(),
  }))

  const analytics = {
    totalTrips: 24,
    totalDistance: 1250,
    totalCost: 8400000,
    avgTripDistance: 52,
    co2Saved: 180,
    peakHours: "9:00 - 11:00 AM",
    favoriteStation: "Điểm thuê Quận 1",
    favoriteVehicle: "VinFast VF e34",
  }

  const monthlyStats = [
    { month: "T1", trips: 8, distance: 420 },
    { month: "T12", trips: 6, distance: 310 },
    { month: "T11", trips: 5, distance: 260 },
    { month: "T10", trips: 5, distance: 260 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="w-full p-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">
              EV Station
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 hover:bg-blue-50 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
              {userProfile?.avatarUrl ? (
                <img 
                  src={getImageUrl(userProfile.avatarUrl)}
                  alt={getDisplayName()}
                  className="w-9 h-9 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">{getAvatarInitials()}</span>
                </div>
              )}
              <span className="text-sm font-medium hidden md:block">{getDisplayName()}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full p-6 py-8">
        {/* Header */}
        <Card className="mb-8 shadow-md bg-purple-50 border-l-4 border-l-purple-600">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-purple-600 mb-2">
                  Lịch sử & Phân tích
                </h1>
                <p className="text-muted-foreground text-lg">Xem lại các chuyến đi và thống kê cá nhân</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="history">Lịch sử thuê xe</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích cá nhân</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedPeriod === "all" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("all")}
                  className={selectedPeriod === "all" ? "bg-blue-600 text-white" : ""}
                >
                  Tất cả
                </Button>
                <Button
                  variant={selectedPeriod === "month" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("month")}
                  className={selectedPeriod === "month" ? "bg-blue-600 text-white" : ""}
                >
                  Tháng này
                </Button>
                <Button
                  variant={selectedPeriod === "year" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("year")}
                  className={selectedPeriod === "year" ? "bg-blue-600 text-white" : ""}
                >
                  Năm nay
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 w-4 h-4" />
                  Bộ lọc
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 w-4 h-4" />
                  Xuất file
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : rentalHistory.length === 0 ? (
                <Card className="shadow-md">
                  <CardContent className="p-12 text-center">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Chưa có lịch sử thuê xe</p>
                    <Link href="/dashboard/booking">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Đặt xe ngay
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                rentalHistory.map((rental) => {
                  const statusInfo = getStatusBadge(rental.status)
                  return (
                    <Card key={rental.id} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Car className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-lg">{rental.vehicle}</div>
                              <div className="text-sm text-muted-foreground">Mã: {rental.id}</div>
                            </div>
                          </div>
                          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                        </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Điểm thuê</div>
                          <div className="text-sm font-medium">{rental.station}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Ngày thuê</div>
                          <div className="text-sm font-medium">{rental.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Thời gian</div>
                          <div className="text-sm font-medium">{rental.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Quãng đường</div>
                          <div className="text-sm font-medium">{rental.distance} km</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-2xl font-bold text-blue-600">{rental.cost.toLocaleString()}đ</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 w-4 h-4" />
                          Hóa đơn
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">{analytics.totalTrips}</div>
                  <div className="text-sm text-muted-foreground">Tổng chuyến đi</div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">{analytics.totalDistance}</div>
                  <div className="text-sm text-muted-foreground">Tổng km đã đi</div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">{(analytics.totalCost / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Tổng chi phí</div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Battery className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">{analytics.co2Saved}</div>
                  <div className="text-sm text-muted-foreground">kg CO₂ tiết kiệm</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle>Thống kê theo tháng</CardTitle>
                  <CardDescription>Số chuyến đi và quãng đường</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {monthlyStats.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{stat.month}</span>
                          <span className="text-muted-foreground">
                            {stat.trips} chuyến • {stat.distance} km
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${(stat.distance / 500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle>Thói quen thuê xe</CardTitle>
                  <CardDescription>Phân tích hành vi của bạn</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Giờ thuê thường xuyên</div>
                    <div className="font-bold text-blue-600">{analytics.peakHours}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Điểm thuê yêu thích</div>
                    <div className="font-bold text-green-600">{analytics.favoriteStation}</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Xe yêu thích</div>
                    <div className="font-bold text-blue-600">{analytics.favoriteVehicle}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Quãng đường trung bình</div>
                    <div className="font-bold text-green-600">{analytics.avgTripDistance} km/chuyến</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
