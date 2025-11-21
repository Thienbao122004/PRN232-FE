"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DatePicker, TimePicker, ConfigProvider } from "antd"
import locale from "antd/locale/vi_VN"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import * as Icons from "react-icons/lu"
import { Zap, MapPin, Search, ArrowLeft, Loader2, Star, Battery, Gauge } from "lucide-react"
import Link from "next/link"
import { userService, type UserProfileResponse } from "@/services/userService"
import { vehicleService, type VehicleResponse, type VehicleTypeResponse } from "@/services/vehicleService"
import { branchService, type Branch } from "@/services/branchService"
import { API_CONFIG } from "@/lib/api-config"
import { useToast } from "@/hooks/use-toast"

dayjs.locale("vi")

// Helper để tạo full URL cho image
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  if (cleanPath.startsWith("uploads")) {
    return `${API_CONFIG.GATEWAY_URL}/userGateway/${cleanPath}`;
  }
  return `${API_CONFIG.USER_SERVICE_URL}/${cleanPath}`;
}

// Map loại xe sang icon/image
const getVehicleImage = (brand?: string, model?: string) => {
  const key = `${brand} ${model}`.toLowerCase();
  if (key.includes("vf e34") || key.includes("vf e34")) return "/vinfast-vf-e34-electric-suv.jpg";
  if (key.includes("vf 8") || key.includes("vf8")) return "/vinfast-vf-8-electric-suv.jpg";
  if (key.includes("vf 5") || key.includes("vf5")) return "/vinfast-vf-5-electric-hatchback.jpg";
  return "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop";
}

export default function BookingPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null)
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null)
  
  // API Data
  const [branches, setBranches] = useState<Branch[]>([])
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      // Load user profile
      const profileRes = await userService.getCurrentProfile().catch(() => ({ success: false, data: null }))
      if (profileRes.success && profileRes.data) {
        setUserProfile(profileRes.data)
      }

      // Load branches - returns Branch[] directly (not wrapped in ApiResponse)
      const branchesData = await branchService.getAllBranches().catch((err) => {
        console.error("Load branches error:", err)
        return []
      })
      console.log("Branches loaded:", branchesData)
      setBranches(branchesData)

      // Load vehicles - returns ApiResponse<VehicleResponse[]>
      const vehiclesRes = await vehicleService.getVehiclesByStatus("Available").catch((err) => {
        console.error("Load vehicles error:", err)
        return { success: false, data: [] }
      })
      console.log("Vehicles loaded:", vehiclesRes)
      if (vehiclesRes.success && vehiclesRes.data) {
        setVehicles(vehiclesRes.data)
      }

      // Load vehicle types - returns ApiResponse<VehicleTypeResponse[]>
      const typesRes = await vehicleService.getAllVehicleTypes().catch((err) => {
        console.error("Load vehicle types error:", err)
        return { success: false, data: [] }
      })
      console.log("Vehicle types loaded:", typesRes)
      if (typesRes.success && typesRes.data) {
        setVehicleTypes(typesRes.data)
      }

    } catch (error) {
      console.error("Load data error:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu từ server",
      })
    } finally {
      setIsLoading(false)
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

  // Filter vehicles theo branch được chọn
  // Lưu ý: Nếu vehicle không có currentBranchId, hiển thị tất cả
  const filteredVehicles = selectedStation 
    ? vehicles.filter(v => !v.currentBranchId || v.currentBranchId === selectedStation)
    : vehicles

  // Lấy thông tin type cho vehicle
  const getVehicleWithType = (vehicle: VehicleResponse) => {
    const type = vehicleTypes.find(t => t.typeId === vehicle.typeId)
    return { ...vehicle, typeVehicle: type }
  }

  // Tính số xe available cho mỗi branch
  // Nếu vehicle không có currentBranchId, tính tất cả xe available
  const getBranchAvailableCount = (branchId: string) => {
    const vehiclesWithBranch = vehicles.filter(v => v.currentBranchId === branchId && v.status === "Available")
    const vehiclesWithoutBranch = vehicles.filter(v => !v.currentBranchId && v.status === "Available")
    // Nếu không có xe nào có currentBranchId, hiển thị tất cả
    return vehiclesWithBranch.length > 0 ? vehiclesWithBranch.length : vehiclesWithoutBranch.length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">EV Station</span>
              <p className="text-xs text-gray-500">Rental System</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
              {userProfile?.avatarUrl ? (
                <img 
                  src={getImageUrl(userProfile.avatarUrl)}
                  alt={getDisplayName()}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{getAvatarInitials()}</span>
                </div>
              )}
              <span className="text-sm font-medium hidden md:block">{getDisplayName()}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1800px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-blue-600 rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Đặt xe điện</h1>
                <p className="text-blue-100 text-lg">Tìm và đặt xe điện tại điểm thuê gần bạn</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-6 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{branches.length}</p>
                <p className="text-blue-100 text-sm">Điểm thuê</p>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{vehicles.length}</p>
                <p className="text-blue-100 text-sm">Xe sẵn có</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Search & Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Bộ lọc tìm kiếm
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Vị trí điểm thuê</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tìm điểm thuê..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <ConfigProvider locale={locale}>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Ngày thuê</Label>
                      <DatePicker
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                        className="w-full h-10"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Giờ thuê</Label>
                      <TimePicker
                        value={selectedTime}
                        onChange={(time) => setSelectedTime(time)}
                        format="HH:mm"
                        placeholder="Chọn giờ"
                        className="w-full h-10"
                      />
                    </div>
                  </ConfigProvider>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (!selectedStation) {
                        toast({
                          variant: "destructive",
                          title: "Vui lòng chọn điểm thuê",
                        })
                      }
                    }}
                  >
                    <Search className="mr-2 w-4 h-4" />
                    Tìm kiếm
                  </Button>
                </CardContent>
              </Card>

              {/* Stations List */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Điểm thuê ({branches.length})
                  </CardTitle>
                  <CardDescription>Chọn điểm thuê để xem xe có sẵn</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-3 max-h-[500px] overflow-y-auto">
                  {branches.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Không có điểm thuê</p>
                  ) : (
                    branches
                      .filter(branch => 
                        !searchQuery || 
                        branch.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (branch.city || '').toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((branch) => (
                        <div
                          key={branch.branchId}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedStation === branch.branchId
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedStation(branch.branchId)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{branch.branchName}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {branch.address}, {branch.city}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                📞 {branch.contactNumber}
                              </div>
                              <div className="text-xs text-gray-500">
                                ⏰ {branch.workingHours}
                              </div>
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700">
                              {getBranchAvailableCount(branch.branchId)} xe
                            </Badge>
                          </div>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Vehicles List */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Xe có sẵn</h2>
                      <p className="text-gray-600">
                        {selectedStation 
                          ? `${filteredVehicles.length} xe tại ${branches.find(b => b.branchId === selectedStation)?.branchName || "điểm thuê đã chọn"}` 
                          : "Chọn điểm thuê để xem xe"}
                      </p>
                    </div>
                    <Badge className="text-base px-4 py-2 bg-blue-600">
                      {filteredVehicles.length} xe
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {filteredVehicles.length === 0 ? (
                <Card className="shadow-md">
                  <CardContent className="p-12 text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {selectedStation 
                        ? "Không có xe nào tại điểm thuê này"
                        : "Vui lòng chọn điểm thuê"}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedStation 
                        ? "Vui lòng thử chọn điểm thuê khác"
                        : "Chọn điểm thuê bên trái để xem danh sách xe"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredVehicles.map((vehicle) => {
                    const vehicleWithType = getVehicleWithType(vehicle)
                    const type = vehicleWithType.typeVehicle
                    
                    return (
                      <Card key={vehicle.vehicleId} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-5 gap-0">
                            {/* Vehicle Image */}
                            <div className="md:col-span-2 relative h-64 md:h-auto">
                              <img
                                src={getVehicleImage(type?.brand, type?.model)}
                                alt={`${type?.brand} ${type?.model}`}
                                className="w-full h-full object-cover rounded-l-lg"
                              />
                              <Badge className="absolute top-4 left-4 bg-white text-gray-900 font-semibold">
                                {vehicle.plateNumber}
                              </Badge>
                              <Badge className="absolute top-4 right-4 bg-green-600">
                                {vehicle.status}
                              </Badge>
                            </div>

                            {/* Vehicle Info */}
                            <div className="md:col-span-3 p-6 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{type?.brand} {type?.model}</h3>
                                    <p className="text-blue-600 font-medium">{type?.typeName}</p>
                                  </div>
                                  <div className="text-right bg-blue-50 px-4 py-3 rounded-lg border-2 border-blue-200">
                                    <p className="text-xs text-gray-600 mb-1">Giá thuê</p>
                                    <div className="text-2xl font-bold text-blue-600">
                                      {type?.basePrice?.toLocaleString() || 0}đ
                                    </div>
                                    <div className="text-sm text-gray-500">/ ngày</div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icons.LuBattery className="w-4 h-4 text-green-600" />
                                      <p className="text-xs font-medium text-gray-700">Dung lượng pin</p>
                                    </div>
                                    <p className="text-lg font-bold text-green-600">{vehicle.batteryCapacity}%</p>
                                  </div>
                                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icons.LuGauge className="w-4 h-4 text-blue-600" />
                                      <p className="text-xs font-medium text-gray-700">Năm sản xuất</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-600">{vehicle.manufactureYear}</p>
                                  </div>
                                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icons.LuStar className="w-4 h-4 text-orange-600" />
                                      <p className="text-xs font-medium text-gray-700">Màu sắc</p>
                                    </div>
                                    <p className="text-lg font-bold text-orange-600">{vehicle.color}</p>
                                  </div>
                                </div>

                                {type?.description && (
                                  <div className="bg-gray-50 p-3 rounded-lg border">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-semibold">Mô tả:</span> {type.description}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-3 mt-4">
                                <Link 
                                  href={`/dashboard/booking/${vehicle.vehicleId}?branchId=${selectedStation}&date=${selectedDate?.format('YYYY-MM-DD') || ''}&time=${selectedTime?.format('HH:mm') || ''}`} 
                                  className="flex-1"
                                >
                                  <Button 
                                    disabled={!selectedStation}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
                                  >
                                    Đặt xe ngay
                                    <Icons.LuChevronRight className="ml-2 w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button variant="outline">
                                  Chi tiết
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
