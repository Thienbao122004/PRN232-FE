"use client"
import { useEffect, useState } from "react"
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
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authToken, userInfo } from "@/lib/auth"
import { rentalOrderService, vehicleService, checkinService, checkoutService } from "@/services"
import type { RentalOrderResponse, VehicleResponse } from "@/services"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function StaffDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [rentals, setRentals] = useState<RentalOrderResponse[]>([])
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
  const [todayRentals, setTodayRentals] = useState<RentalOrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const currentUser = userInfo.get()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      
      // Load rentals with today's date
      const [rentalsRes, vehiclesRes] = await Promise.all([
        rentalOrderService.getAllRentals({ page: 1, pageSize: 50 }),
        vehicleService.getAllVehicles(),
      ])

      if (rentalsRes.success && rentalsRes.data) {
        const allRentals = (rentalsRes.data as any).items || rentalsRes.data || []
        setRentals(allRentals)
        
        // Filter today's rentals
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayEnd = new Date(today)
        todayEnd.setHours(23, 59, 59, 999)

        const todaysRentals = allRentals.filter((rental: RentalOrderResponse) => {
          const startTime = new Date(rental.startTime)
          return startTime >= today && startTime <= todayEnd
        })
        setTodayRentals(todaysRentals)
      }

      if (vehiclesRes.success && vehiclesRes.data) {
        setVehicles(vehiclesRes.data)
      }

      // Fallback to mock data if API returns empty
      if (rentals.length === 0) {
        setRentals(generateMockRentals())
      }
      if (vehicles.length === 0) {
        setVehicles(generateMockVehicles())
      }
    } catch (error) {
      console.error("Error loading dashboard:", error)
      // Use mock data on error
      setRentals(generateMockRentals())
      setVehicles(generateMockVehicles())
      setTodayRentals(generateMockRentals().slice(0, 3))
    } finally {
      setLoading(false)
    }
  }

  // Mock data generators
  const generateMockVehicles = (): VehicleResponse[] => {
    return [
      {
        vehicleId: "VH001",
        plateNumber: "59A-123.45",
        chassisNumber: "CHASSIS-001",
        color: "Đỏ",
        batteryCapacity: 85,
        manufactureYear: 2023,
        typeId: "T1",
        status: "Available",
        typeVehicle: { 
          typeId: "T1", 
          typeName: "VinFast VF e34", 
          brand: "VinFast",
          model: "VF e34",
          defaultBattery: 42,
          basePrice: 690000000,
          description: "SUV điện" 
        }
      },
      {
        vehicleId: "VH002",
        plateNumber: "59A-678.90",
        chassisNumber: "CHASSIS-002",
        color: "Xanh",
        batteryCapacity: 60,
        manufactureYear: 2023,
        typeId: "T2",
        status: "Rented",
        typeVehicle: { 
          typeId: "T2", 
          typeName: "VinFast VF 8", 
          brand: "VinFast",
          model: "VF 8",
          defaultBattery: 87.7,
          basePrice: 1200000000,
          description: "SUV cao cấp" 
        }
      },
      {
        vehicleId: "VH003",
        plateNumber: "59A-111.22",
        chassisNumber: "CHASSIS-003",
        color: "Trắng",
        batteryCapacity: 90,
        manufactureYear: 2024,
        typeId: "T1",
        status: "Available",
        typeVehicle: { 
          typeId: "T1", 
          typeName: "VinFast VF e34", 
          brand: "VinFast",
          model: "VF e34",
          defaultBattery: 42,
          basePrice: 690000000,
          description: "SUV điện" 
        }
      },
      {
        vehicleId: "VH004",
        plateNumber: "59A-333.44",
        chassisNumber: "CHASSIS-004",
        color: "Đen",
        batteryCapacity: 45,
        manufactureYear: 2022,
        typeId: "T3",
        status: "Maintenance",
        typeVehicle: { 
          typeId: "T3", 
          typeName: "VinFast VF 5", 
          brand: "VinFast",
          model: "VF 5",
          defaultBattery: 37.23,
          basePrice: 458000000,
          description: "Xe nhỏ gọn" 
        }
      },
      {
        vehicleId: "VH005",
        plateNumber: "59A-555.66",
        chassisNumber: "CHASSIS-005",
        color: "Xám",
        batteryCapacity: 75,
        manufactureYear: 2023,
        typeId: "T2",
        status: "Rented",
        typeVehicle: { 
          typeId: "T2", 
          typeName: "VinFast VF 8", 
          brand: "VinFast",
          model: "VF 8",
          defaultBattery: 87.7,
          basePrice: 1200000000,
          description: "SUV cao cấp" 
        }
      },
    ]
  }

  const generateMockRentals = (): RentalOrderResponse[] => {
    const now = new Date()
    const today = new Date(now)
    today.setHours(10, 0, 0, 0)

    return [
      {
        rentalId: "RO001",
        renterId: "U001",
        vehicleId: "VH001",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 2500000,
        actualCost: 2500000,
        startTime: today.toISOString(),
        endTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Confirmed",
        createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          userId: "U001",
          fullName: "Nguyễn Văn An",
          email: "nguyenvanan@email.com",
          phoneNumber: "0901234567"
        },
        vehicle: {
          vehicleId: "VH001",
          plateNumber: "59A-123.45",
          chassisNumber: "CHASSIS-001",
          color: "Đỏ",
          batteryCapacity: 85,
          manufactureYear: 2023,
          typeId: "T1",
          status: "Available",
          typeVehicle: { 
            typeId: "T1", 
            typeName: "VinFast VF e34", 
            brand: "VinFast",
            model: "VF e34",
            defaultBattery: 42,
            basePrice: 690000000,
            description: "SUV điện" 
          }
        }
      } as any,
      {
        rentalId: "RO002",
        renterId: "U002",
        vehicleId: "VH002",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 1800000,
        actualCost: 1800000,
        startTime: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Active",
        createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          userId: "U002",
          fullName: "Trần Thị Bình",
          email: "tranthib@email.com",
          phoneNumber: "0912345678"
        },
        vehicle: {
          vehicleId: "VH002",
          plateNumber: "59A-678.90",
          chassisNumber: "CHASSIS-002",
          color: "Xanh",
          batteryCapacity: 60,
          manufactureYear: 2023,
          typeId: "T2",
          status: "Rented",
          typeVehicle: { 
            typeId: "T2", 
            typeName: "VinFast VF 8", 
            brand: "VinFast",
            model: "VF 8",
            defaultBattery: 87.7,
            basePrice: 1200000000,
            description: "SUV cao cấp" 
          }
        }
      } as any,
      {
        rentalId: "RO003",
        renterId: "U003",
        vehicleId: "VH003",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 3200000,
        actualCost: 3500000,
        startTime: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Completed",
        createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          userId: "U003",
          fullName: "Lê Hoàng Cường",
          email: "lehoangc@email.com",
          phoneNumber: "0923456789"
        },
        vehicle: {
          vehicleId: "VH003",
          plateNumber: "59A-111.22",
          chassisNumber: "CHASSIS-003",
          color: "Trắng",
          batteryCapacity: 90,
          manufactureYear: 2024,
          typeId: "T1",
          status: "Available",
          typeVehicle: { 
            typeId: "T1", 
            typeName: "VinFast VF e34", 
            brand: "VinFast",
            model: "VF e34",
            defaultBattery: 42,
            basePrice: 690000000,
            description: "SUV điện" 
          }
        }
      } as any,
      {
        rentalId: "RO004",
        renterId: "U004",
        vehicleId: "VH005",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 1500000,
        startTime: today.toISOString(),
        endTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Pending",
        createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          userId: "U004",
          fullName: "Phạm Minh Đức",
          email: "phammd@email.com",
          phoneNumber: "0934567890"
        },
        vehicle: {
          vehicleId: "VH005",
          plateNumber: "59A-555.66",
          chassisNumber: "CHASSIS-005",
          color: "Xám",
          batteryCapacity: 75,
          manufactureYear: 2023,
          typeId: "T2",
          status: "Rented",
          typeVehicle: { 
            typeId: "T2", 
            typeName: "VinFast VF 8", 
            brand: "VinFast",
            model: "VF 8",
            defaultBattery: 87.7,
            basePrice: 1200000000,
            description: "SUV cao cấp" 
          }
        }
      } as any,
    ]
  }

  const handleLogout = () => {
    authToken.remove()
    router.push("/login")
  }

  // Calculate statistics
  const stats = {
    todayPickups: todayRentals.filter((r: any) => r.status === "Confirmed" || r.status === "Pending").length,
    todayReturns: todayRentals.filter((r: any) => r.status === "Active").length,
    totalActive: rentals.filter((r: any) => r.status === "Active").length,
    revenue: rentals
      .filter((r: any) => r.status === "Completed" || r.status === "Closed")
      .reduce((sum: number, r: any) => sum + (r.actualCost || r.estimatedCost), 0),
  }

  const vehicleStats = {
    available: vehicles.filter((v: any) => v.status === "Available").length,
    rented: vehicles.filter((v: any) => v.status === "Rented").length,
    maintenance: vehicles.filter((v: any) => v.status === "Maintenance").length,
    unavailable: vehicles.filter((v: any) => v.status === "Unavailable").length,
  }

  // Filter today's tasks
  const pendingPickups = todayRentals
    .filter((r: any) => r.status === "Confirmed" || r.status === "Pending")
    .slice(0, 5)

  const activeReturns = rentals
    .filter((r: any) => r.status === "Active")
    .slice(0, 5)

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
                <div className="text-sm font-medium">{user?.fullName || "Staff"}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
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
                  <div className="font-bold">EV Station</div>
                  <div className="text-xs text-muted-foreground mt-1">Quản lý thuê xe điện</div>
                </div>

                <nav className="space-y-2">
                  <Link href="/staff">
                    <Button variant="default" className="w-full justify-start">
                      <Car className="w-4 h-4 mr-2" />
                      Tổng quan
                    </Button>
                  </Link>
                  <Link href="/staff/check-in">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowDownRight className="w-4 h-4 mr-2" />
                      Bàn giao xe
                    </Button>
                  </Link>
                  <Link href="/staff/check-out">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Nhận lại xe
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
                      <Car className="w-4 h-4 mr-2" />
                      Quản lý xe
                    </Button>
                  </Link>
                  <Link href="/staff/search">
                    <Button variant="ghost" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Tìm kiếm
                    </Button>
                  </Link>
                  <div className="pt-4 border-t">
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.fullName || "Staff"}!</h1>
                  <p className="text-blue-100">Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <Calendar className="w-16 h-16 text-white/20" />
              </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
              <div className="grid md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Bàn giao hôm nay</span>
                      <ArrowDownRight className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{stats.todayPickups}</div>
                    <p className="text-xs text-muted-foreground mt-1">Xe cần giao</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Nhận lại hôm nay</span>
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-600">{stats.todayReturns}</div>
                    <p className="text-xs text-muted-foreground mt-1">Xe cần nhận</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Đang cho thuê</span>
                      <Car className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600">{stats.totalActive}</div>
                    <p className="text-xs text-muted-foreground mt-1">Xe đang hoạt động</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Doanh thu</span>
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {(stats.revenue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">VNĐ</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Vehicle Status Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Tình trạng xe
                </CardTitle>
                <CardDescription>Tổng quan trạng thái các xe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">Sẵn sàng</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">{vehicleStats.available}</div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">Đang thuê</span>
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">{vehicleStats.rented}</div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-700">Bảo trì</span>
                      <Settings className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-700">{vehicleStats.maintenance}</div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-700">Không khả dụng</span>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-700">{vehicleStats.unavailable}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Pickups */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowDownRight className="w-5 h-5 text-blue-600" />
                      Xe cần bàn giao hôm nay
                    </CardTitle>
                    <CardDescription>Danh sách đơn đặt trước cần xử lý</CardDescription>
                  </div>
                  <Link href="/staff/check-in">
                    <Button size="sm" variant="outline">
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : pendingPickups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không có xe cần bàn giao hôm nay</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingPickups.map((rental) => (
                      <div key={rental.rentalId} className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="bg-white">
                                {rental.rentalId.substring(0, 8)}
                              </Badge>
                              <Badge className="bg-blue-600">
                                {rental.status === "Pending" ? "Chờ xác nhận" : "Đã xác nhận"}
                              </Badge>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Xe: </span>
                              <span className="text-muted-foreground">{rental.vehicleId}</span>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(rental.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <Link href={`/staff/check-in?rentalId=${rental.rentalId}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Bàn giao
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Rentals - Need Return */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                      Xe đang cho thuê
                    </CardTitle>
                    <CardDescription>Xe có thể được trả lại bất cứ lúc nào</CardDescription>
                  </div>
                  <Link href="/staff/check-out">
                    <Button size="sm" variant="outline">
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : activeReturns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không có xe đang cho thuê</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeReturns.map((rental) => {
                      const endDate = new Date(rental.endTime || "")
                      const isOverdue = endDate < new Date()
                      
                      return (
                        <div key={rental.rentalId} className={`p-4 rounded-lg border hover:shadow-md transition-shadow ${
                          isOverdue ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="bg-white">
                                  {rental.rentalId.substring(0, 8)}
                                </Badge>
                                <Badge className={isOverdue ? "bg-red-600" : "bg-green-600"}>
                                  {isOverdue ? "Quá hạn" : "Đang thuê"}
                                </Badge>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Xe: </span>
                                <span className="text-muted-foreground">{rental.vehicleId}</span>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                Hết hạn: {endDate.toLocaleString('vi-VN')}
                              </div>
                            </div>
                            <Link href={`/staff/check-out?rentalId=${rental.rentalId}`}>
                              <Button size="sm" className={isOverdue ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}>
                                Nhận xe
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
                <CardDescription>Các chức năng thường dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/staff/search">
                    <Card className="border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Search className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-medium">Tìm kiếm</div>
                        <div className="text-xs text-muted-foreground mt-1">Khách hàng & đơn thuê</div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/staff/vehicles">
                    <Card className="border-2 border-dashed hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Settings className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <div className="font-medium">Cập nhật xe</div>
                        <div className="text-xs text-muted-foreground mt-1">Trạng thái & bảo trì</div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/staff/payment">
                    <Card className="border-2 border-dashed hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <div className="font-medium">Thu tiền</div>
                        <div className="text-xs text-muted-foreground mt-1">Thanh toán tại quầy</div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
