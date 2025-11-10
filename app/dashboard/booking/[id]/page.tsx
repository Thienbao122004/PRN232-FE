"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Zap,
  Car,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Battery,
  Gauge,
  ArrowLeft,
  Loader2,
  CreditCard,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { vehicleService, type VehicleResponse, type VehicleTypeResponse } from "@/services/vehicleService"
import { branchService, type BranchResponse } from "@/services/branchService"
import { rentalOrderService, type CreateRentalOrderRequest } from "@/services/rentalOrderService"
import { userService } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"

// Helper để tạo full URL cho image
const getVehicleImage = (brand?: string, model?: string) => {
  const key = `${brand} ${model}`.toLowerCase();
  if (key.includes("vf e34") || key.includes("vf e34")) return "/vinfast-vf-e34-electric-suv.jpg";
  if (key.includes("vf 8") || key.includes("vf8")) return "/vinfast-vf-8-electric-suv.jpg";
  if (key.includes("vf 5") || key.includes("vf5")) return "/vinfast-vf-5-electric-hatchback.jpg";
  return "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop";
}

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const vehicleId = params.id as string
  const branchId = searchParams.get("branchId")
  const preSelectedDate = searchParams.get("date")
  const preSelectedTime = searchParams.get("time")

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null)
  const [vehicleType, setVehicleType] = useState<VehicleTypeResponse | null>(null)
  const [startBranch, setStartBranch] = useState<BranchResponse | null>(null)
  const [endBranch, setEndBranch] = useState<BranchResponse | null>(null)
  const [allBranches, setAllBranches] = useState<BranchResponse[]>([])
  const [userId, setUserId] = useState<string>("")

  const [bookingData, setBookingData] = useState({
    startDate: preSelectedDate || "",
    startTime: preSelectedTime || "",
    endDate: "",
    endTime: "",
    branchStartId: branchId || "",
    branchEndId: branchId || "",
  })

  useEffect(() => {
    loadData()
  }, [vehicleId])

  const loadData = async () => {
    if (!vehicleId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy thông tin xe",
      })
      router.push("/dashboard/booking")
      return
    }

    setIsLoading(true)
    try {
      // Lấy userId
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null
      if (user?.userId) {
        setUserId(user.userId)
      }

      // Load vehicle, type, branches
      const [vehicleRes, branchesRes] = await Promise.all([
        vehicleService.getVehicleById(vehicleId),
        branchService.getAllBranches(),
      ])

      if (vehicleRes.success && vehicleRes.data) {
        setVehicle(vehicleRes.data)
        
        // Load vehicle type
        const typeRes = await vehicleService.getVehicleTypeById(vehicleRes.data.typeId)
        if (typeRes.success && typeRes.data) {
          setVehicleType(typeRes.data)
        }
      } else {
        throw new Error("Không thể tải thông tin xe")
      }

      if (branchesRes.success && branchesRes.data) {
        setAllBranches(branchesRes.data)
        
        // Load start branch
        if (branchId) {
          const branch = branchesRes.data.find(b => b.branchId === branchId)
          setStartBranch(branch || null)
          setEndBranch(branch || null)
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải dữ liệu",
      })
      router.push("/dashboard/booking")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateRentalDuration = () => {
    if (!bookingData.startDate || !bookingData.startTime || !bookingData.endDate || !bookingData.endTime) {
      return 0
    }
    
    const start = new Date(`${bookingData.startDate}T${bookingData.startTime}`)
    const end = new Date(`${bookingData.endDate}T${bookingData.endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    return Math.max(0, diffHours)
  }

  const calculateEstimatedCost = () => {
    const hours = calculateRentalDuration()
    const days = Math.ceil(hours / 24)
    const basePrice = vehicleType?.basePrice || 0
    return days * basePrice
  }

  const calculateDeposit = () => {
    return calculateEstimatedCost() * 1.5
  }

  const handleBooking = async () => {
    // Validate
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng đăng nhập lại",
      })
      return
    }

    if (!bookingData.startDate || !bookingData.startTime) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ngày và giờ bắt đầu thuê",
      })
      return
    }

    if (!bookingData.endDate || !bookingData.endTime) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ngày và giờ trả xe",
      })
      return
    }

    if (!bookingData.branchStartId || !bookingData.branchEndId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn điểm nhận và trả xe",
      })
      return
    }

    const duration = calculateRentalDuration()
    if (duration <= 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Thời gian trả xe phải sau thời gian nhận xe",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const startDateTime = `${bookingData.startDate}T${bookingData.startTime}:00Z`
      const endDateTime = `${bookingData.endDate}T${bookingData.endTime}:00Z`

      const rentalData: CreateRentalOrderRequest = {
        renterId: userId,
        vehicleId: vehicleId,
        branchStartId: bookingData.branchStartId,
        branchEndId: bookingData.branchEndId,
        startTime: startDateTime,
        endTime: endDateTime,
        estimatedCost: calculateEstimatedCost(),
      }

      const response = await rentalOrderService.createRentalOrder(rentalData)

      if (response.success && response.data) {
        toast({
          title: "Đặt xe thành công!",
          description: "Hợp đồng đã được tạo tự động. Vui lòng ký hợp đồng điện tử để tiếp tục.",
        })
        router.push(`/dashboard/rental/${response.data.rentalId}`)
      } else {
        throw new Error(response.message || (response as any).error || "Đặt xe thất bại")
      }
    } catch (error: any) {
      console.error("❌ Booking error:", error)
      
      let errorMessage = "Không thể tạo đơn thuê"
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.message?.includes("Sequence contains no elements")) {
        errorMessage = "Không tìm thấy thông tin cần thiết. Vui lòng kiểm tra lại thông tin tài khoản."
      }
      
      toast({
        variant: "destructive",
        title: "Lỗi đặt xe",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!vehicle || !vehicleType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Không tìm thấy thông tin xe</p>
        </Card>
      </div>
    )
  }

  const duration = calculateRentalDuration()
  const estimatedCost = calculateEstimatedCost()
  const deposit = calculateDeposit()

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
          <Link href="/dashboard/booking">
            <Button variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-[1800px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-blue-600 rounded-xl p-8 shadow-lg">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Car className="w-5 h-5" />
              <span className="text-sm font-medium">Xác nhận đặt xe</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Thông tin đặt xe</h1>
            <p className="text-blue-100 text-lg">Xác nhận thông tin và hoàn tất đặt xe</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Vehicle Info & Booking Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Vehicle Info */}
            <Card className="shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Thông tin xe</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={getVehicleImage(vehicleType.brand, vehicleType.model)}
                      alt={`${vehicleType.brand} ${vehicleType.model}`}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{vehicleType.brand} {vehicleType.model}</h3>
                      <p className="text-blue-600 font-medium">{vehicleType.typeName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-100 text-gray-900 border">{vehicle.plateNumber}</Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">{vehicle.color}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Battery className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-gray-700">Dung lượng pin</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">{vehicle.batteryCapacity}%</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">Năm sản xuất</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">{vehicle.manufactureYear}</p>
                      </div>
                    </div>
                    {vehicleType.description && (
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Mô tả:</span> {vehicleType.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Thông tin thuê xe</CardTitle>
                <CardDescription>Vui lòng điền đầy đủ thông tin</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {/* Thời gian thuê */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Thời gian thuê xe
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Ngày nhận xe *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={bookingData.startDate}
                          onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                          className="pl-10"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Giờ nhận xe *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          value={bookingData.startTime}
                          onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Ngày trả xe *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={bookingData.endDate}
                          onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                          className="pl-10"
                          min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Giờ trả xe *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          value={bookingData.endTime}
                          onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Điểm nhận/trả */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Điểm nhận và trả xe
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Điểm nhận xe *</Label>
                      <select
                        value={bookingData.branchStartId}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, branchStartId: e.target.value })
                          const branch = allBranches.find(b => b.branchId === e.target.value)
                          setStartBranch(branch || null)
                        }}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Chọn điểm nhận xe</option>
                        {allBranches.map(branch => (
                          <option key={branch.branchId} value={branch.branchId}>
                            {branch.branchName}
                          </option>
                        ))}
                      </select>
                      {startBranch && (
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Địa chỉ:</span> {startBranch.address}, {startBranch.city}
                          </p>
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">SĐT:</span> {startBranch.contactNumber}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Điểm trả xe *</Label>
                      <select
                        value={bookingData.branchEndId}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, branchEndId: e.target.value })
                          const branch = allBranches.find(b => b.branchId === e.target.value)
                          setEndBranch(branch || null)
                        }}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Chọn điểm trả xe</option>
                        {allBranches.map(branch => (
                          <option key={branch.branchId} value={branch.branchId}>
                            {branch.branchName}
                          </option>
                        ))}
                      </select>
                      {endBranch && (
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Địa chỉ:</span> {endBranch.address}, {endBranch.city}
                          </p>
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">SĐT:</span> {endBranch.contactNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {duration > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-900">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">
                        Thời gian thuê: {Math.floor(duration / 24)} ngày {Math.floor(duration % 24)} giờ
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Price Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg">Chi tiết giá</CardTitle>
                  <CardDescription>Tổng chi phí dự kiến</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-sm text-gray-600">Giá thuê / ngày</span>
                      <span className="font-semibold text-gray-900">{vehicleType.basePrice.toLocaleString()}đ / ngày</span>
                    </div>
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-sm text-gray-600">Số ngày thuê</span>
                      <span className="font-semibold text-gray-900">{Math.ceil(duration / 24)} ngày</span>
                    </div>
                    <Separator />
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Tổng phí thuê</span>
                        <span className="text-2xl font-bold text-blue-600">{estimatedCost.toLocaleString()}đ</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Tiền đặt cọc</span>
                        <span className="text-xl font-bold text-orange-600">{deposit.toLocaleString()}đ</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Bằng 150% tổng phí thuê</p>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-yellow-900">
                        <p className="font-semibold mb-1">Lưu ý về đặt cọc:</p>
                        <p>Tiền cọc bằng 150% tổng phí thuê. Số tiền thừa sẽ được hoàn lại sau khi trả xe.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={isSubmitting || duration <= 0 || !bookingData.branchStartId || !bookingData.branchEndId}
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 w-5 h-5" />
                        Xác nhận đặt xe
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>Bằng cách đặt xe, bạn đồng ý với điều khoản của chúng tôi</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

