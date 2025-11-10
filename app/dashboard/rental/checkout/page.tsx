"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Zap,
  Car,
  Battery,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Camera,
  AlertTriangle,
  FileText,
  User,
  Phone,
  Loader2,
  Gauge,
  Shield,
  LogOut,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { checkoutService } from "@/services/checkoutService"
import { rentalOrderService } from "@/services/rentalOrderService"
import { vehicleService } from "@/services/vehicleService"
import { branchService } from "@/services/branchService"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rentalOrder, setRentalOrder] = useState<any>(null)
  const [vehicle, setVehicle] = useState<any>(null)
  const [vehicleType, setVehicleType] = useState<any>(null)
  const [branch, setBranch] = useState<any>(null)
  
  const [inspectionChecklist, setInspectionChecklist] = useState({
    exterior: false,
    interior: false,
    battery: false,
    tires: false,
    lights: false,
    documents: false,
  })
  
  const [odometerReading, setOdometerReading] = useState("")
  const [batteryLevel, setBatteryLevel] = useState("")
  const [extraFee, setExtraFee] = useState("0")
  const [notes, setNotes] = useState("")
  const [photoUrls, setPhotoUrls] = useState(["", "", ""])
  const [agreed, setAgreed] = useState(false)

  const rentalId = searchParams.get("rentalId")

  useEffect(() => {
    if (!rentalId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy thông tin đơn thuê xe",
      })
      router.push("/dashboard")
      return
    }
    loadRentalDetails()
  }, [rentalId])

  const loadRentalDetails = async () => {
    try {
      setIsLoading(true)
      const rentalResponse = await rentalOrderService.getRentalOrderById(rentalId!)
      
      if (!rentalResponse.success || !rentalResponse.data) {
        throw new Error("Không tìm thấy đơn thuê xe")
      }

      const rental = rentalResponse.data
      setRentalOrder(rental)

      if (rental.status !== "Active") {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đơn thuê xe chưa ở trạng thái 'Đang thuê'. Không thể trả xe.",
        })
        router.push(`/dashboard/rental/${rentalId}`)
        return
      }

      // Load vehicle details
      if (rental.vehicleId) {
        const vehicleResponse = await vehicleService.getVehicleById(rental.vehicleId)
        if (vehicleResponse.success && vehicleResponse.data) {
          setVehicle(vehicleResponse.data)

          // Load vehicle type
          if (vehicleResponse.data.typeId) {
            const typeResponse = await vehicleService.getVehicleTypeById(vehicleResponse.data.typeId)
            if (typeResponse.success && typeResponse.data) {
              setVehicleType(typeResponse.data)
            }
          }
        }
      }

      // Load branch (return branch)
      if (rental.branchEndId) {
        const branchResponse = await branchService.getBranchById(rental.branchEndId)
        if (branchResponse.success && branchResponse.data) {
          setBranch(branchResponse.data)
        }
      }
    } catch (error: any) {
      console.error("Error loading rental details:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tải thông tin đơn thuê xe",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...photoUrls]
    newPhotos[index] = value
    setPhotoUrls(newPhotos)
  }

  const handleChecklistChange = (key: keyof typeof inspectionChecklist) => {
    setInspectionChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const allChecked = Object.values(inspectionChecklist).every(v => v)

  const handleCheckout = async () => {
    if (!rentalOrder) return

    if (!odometerReading || !batteryLevel) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ số km và mức pin",
      })
      return
    }

    if (!allChecked) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng hoàn thành tất cả kiểm tra",
      })
      return
    }

    if (!agreed) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng xác nhận đồng ý với các điều khoản trả xe",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const staffId = user?.userId || "00000000-0000-0000-0000-000000000000"

      // Lấy RentalOrderDetailId từ RentalOrder
      const detailsResponse = await rentalOrderService.getRentalOrderDetails(rentalOrder.rentalId)
      
      if (!detailsResponse.success || !detailsResponse.data || detailsResponse.data.length === 0) {
        throw new Error("Không tìm thấy thông tin chi tiết đơn thuê")
      }

      const rentalOrderDetailId = detailsResponse.data[0].id

      const checkoutData = {
        rentalOrderDetailId: rentalOrderDetailId,
        staffId: staffId,
        odometerReading: parseInt(odometerReading),
        batteryLevel: parseInt(batteryLevel),
        extraFee: parseFloat(extraFee) || 0,
        status: "Completed",
        photos: photoUrls.filter(url => url.trim()).map(url => ({
          photoUrl: url,
          description: notes || "Check-out photo"
        }))
      }

      const response = await checkoutService.createCheckout(checkoutData)
      
      if (response.success) {
        toast({
          title: "Thành công!",
          description: "Đã trả xe thành công. Chuyển đến thanh toán cuối...",
        })
        // Redirect to final payment
        router.push(`/dashboard/rental/${rentalId}/final-payment`)
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể trả xe. Vui lòng thử lại.",
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

  if (!rentalOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy đơn thuê xe</p>
      </div>
    )
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8 bg-blue-600 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <LogOut className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Check-out trả xe</h1>
                <p className="text-blue-100 text-lg">Vui lòng kiểm tra kỹ xe trước khi trả</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rental Order Info */}
              <Card className="shadow-md">
                <CardHeader className="border-b bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <CardTitle>Thông tin đơn thuê</CardTitle>
                        <CardDescription>Mã: {rentalOrder.rentalId}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      {rentalOrder.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Ngày bắt đầu</p>
                        <p className="font-medium">{new Date(rentalOrder.startTime).toLocaleDateString("vi-VN")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Ngày kết thúc</p>
                        <p className="font-medium">{rentalOrder.endTime ? new Date(rentalOrder.endTime).toLocaleDateString("vi-VN") : "Chưa xác định"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">Chi phí dự kiến: <span className="font-bold text-blue-600">{rentalOrder.estimatedCost?.toLocaleString()} đ</span></p>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Details */}
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="border-b bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6 text-blue-600" />
                    <CardTitle>Thông tin xe</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-200">
                      <Car className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {vehicleType ? `${vehicleType.brand} ${vehicleType.model}` : "Đang tải..."}
                        </div>
                        <div className="text-sm text-gray-600">{vehicleType?.typeName || "---"}</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {vehicle?.plateNumber || "N/A"}
                        </Badge>
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          {vehicle?.color || "---"}
                        </Badge>
                      </div>

                      <div className="pt-2 space-y-3">
                        <div className="flex items-center gap-3">
                          <Battery className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="text-xs text-gray-600">Dung lượng pin ban đầu</div>
                            <div className="font-semibold">{vehicle?.batteryCapacity || 100}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Gauge className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-xs text-gray-600">Năm sản xuất</div>
                            <div className="font-semibold">{vehicle?.manufactureYear || "---"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-start gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-gray-900">{branch?.branchName || "Đang tải..."}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {branch?.address || "---"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inspection Checklist */}
              <Card className="shadow-md">
                <CardHeader className="border-b bg-green-50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                      <CardTitle>Kiểm tra trả xe</CardTitle>
                      <CardDescription>Kiểm tra tình trạng xe trước khi trả</CardDescription>
                    </div>
                  </div>
                  <Progress value={(Object.values(inspectionChecklist).filter(v => v).length / 6) * 100} className="h-2 mt-4" />
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {([
                      { key: "exterior", label: "Ngoại thất không trầy xước" },
                      { key: "interior", label: "Nội thất sạch sẽ" },
                      { key: "battery", label: "Pin đã sạc đầy" },
                      { key: "tires", label: "Lốp xe trong tình trạng tốt" },
                      { key: "lights", label: "Đèn hoạt động bình thường" },
                      { key: "documents", label: "Đã trả đầy đủ giấy tờ" },
                    ] as const).map(item => (
                      <div key={item.key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={item.key}
                          checked={inspectionChecklist[item.key]}
                          onCheckedChange={() => handleChecklistChange(item.key)}
                        />
                        <label
                          htmlFor={item.key}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Odometer & Battery */}
              <Card className="shadow-md">
                <CardHeader className="border-b">
                  <CardTitle>Số km & Mức pin khi trả</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="odometer" className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Số km hiện tại
                      </Label>
                      <Input
                        id="odometer"
                        type="number"
                        placeholder="VD: 12500"
                        value={odometerReading}
                        onChange={(e) => setOdometerReading(e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="battery" className="flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        Mức pin (%)
                      </Label>
                      <Input
                        id="battery"
                        type="number"
                        placeholder="VD: 85"
                        value={batteryLevel}
                        onChange={(e) => setBatteryLevel(e.target.value)}
                        className="text-lg font-semibold"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraFee" className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Phí phát sinh (đ)
                      </Label>
                      <Input
                        id="extraFee"
                        type="number"
                        placeholder="0"
                        value={extraFee}
                        onChange={(e) => setExtraFee(e.target.value)}
                        className="text-lg font-semibold"
                      />
                      <p className="text-xs text-gray-500">Phí hư hỏng hoặc vệ sinh thêm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              <Card className="shadow-md">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-purple-600" />
                    <div>
                      <CardTitle>Ảnh trả xe</CardTitle>
                      <CardDescription>Chụp ảnh tình trạng xe (tùy chọn)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`photo-${index}`}>Link ảnh {index + 1}</Label>
                      <Input
                        id={`photo-${index}`}
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={url}
                        onChange={(e) => handlePhotoChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="shadow-md">
                <CardHeader className="border-b">
                  <CardTitle>Ghi chú thêm</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Mô tả tình trạng xe hoặc vấn đề gặp phải..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              {/* Agreement */}
              <Card className="shadow-md bg-blue-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreement"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="bg-white border-white"
                    />
                    <label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                      <p className="font-medium mb-2">Xác nhận</p>
                      <p className="text-blue-100">
                        Tôi xác nhận đã kiểm tra kỹ xe và đồng ý với các thông tin trên. 
                        Tôi hiểu rằng nếu có hư hỏng phát hiện sau này, tôi có thể phải chịu phí bồi thường.
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 1/3 */}
            <div className="lg:col-span-1 space-y-6">
              {/* Checkout Summary */}
              <Card className="shadow-md sticky top-24">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Tóm tắt trả xe
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tình trạng kiểm tra:</span>
                      <span className="font-semibold">
                        {Object.values(inspectionChecklist).filter(v => v).length}/6
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số km:</span>
                      <span className="font-semibold">{odometerReading || "---"} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mức pin:</span>
                      <span className="font-semibold">{batteryLevel || "---"}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí phát sinh:</span>
                      <span className="font-semibold text-orange-600">
                        {parseInt(extraFee || "0").toLocaleString()} đ
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isSubmitting || !allChecked || !agreed || !odometerReading || !batteryLevel}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Xác nhận trả xe
                        </>
                      )}
                    </Button>
                  </div>

                  {(!allChecked || !agreed || !odometerReading || !batteryLevel) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          Vui lòng hoàn thành tất cả kiểm tra, nhập số km & pin, và đồng ý với điều khoản
                        </span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Help Card */}
              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

