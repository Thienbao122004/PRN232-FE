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
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { checkinService } from "@/services/checkinService"
import { rentalOrderService } from "@/services/rentalOrderService"
import { vehicleService } from "@/services/vehicleService"
import { branchService } from "@/services/branchService"
import { useToast } from "@/hooks/use-toast"

export default function CheckInPage() {
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
    documents: false,
    photos: false,
  })
  const [notes, setNotes] = useState("")
  const [agreed, setAgreed] = useState(false)
  
  const [odometerReading, setOdometerReading] = useState("")
  const [batteryLevel, setBatteryLevel] = useState("")
  const [photoUrls, setPhotoUrls] = useState<string[]>(["", "", "", "", ""])

  const rentalId = searchParams.get("rentalId")

  useEffect(() => {
    if (rentalId) {
      loadAllData()
    } else {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy thông tin đơn thuê",
      })
      router.push("/dashboard")
    }
  }, [rentalId])

  const loadAllData = async () => {
    if (!rentalId) return
    
    setIsLoading(true)
    try {
      const response = await rentalOrderService.getRentalOrderById(rentalId)
      if (response.success && response.data) {
        setRentalOrder(response.data)
        
        // Load vehicle details
        try {
          const vehicleRes = await vehicleService.getVehicleById(response.data.vehicleId)
          if (vehicleRes.success && vehicleRes.data) {
            setVehicle(vehicleRes.data)
            
            // Load vehicle type
            const typeRes = await vehicleService.getVehicleTypeById(vehicleRes.data.typeId)
            if (typeRes.success && typeRes.data) {
              setVehicleType(typeRes.data)
            }
          }
        } catch (err) {
          console.error("Load vehicle error:", err)
        }
        
        // Load branch details
        try {
          const branchRes = await branchService.getBranchById(response.data.branchStartId)
          if (branchRes.success && branchRes.data) {
            setBranch(branchRes.data)
          }
        } catch (err) {
          console.error("Load branch error:", err)
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải thông tin đơn thuê",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckin = async () => {
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

      // Lấy RentalOrderDetailId đầu tiên (backend trả về field "id")
      const rentalOrderDetailId = detailsResponse.data[0].id

      const checkinData = {
        rentalOrderDetailId: rentalOrderDetailId,  // ✅ ĐÚNG: Sử dụng RentalOrderDetailId
        staffId: staffId,
        odometerReading: parseInt(odometerReading),
        batteryLevel: parseInt(batteryLevel),
        status: "Completed",
        photos: photoUrls.filter(url => url.trim()).map(url => ({
          photoUrl: url,
          description: notes || "Check-in photo"
        }))
      }

      const response = await checkinService.createCheckin(checkinData)
      
      if (response.success) {
        toast({
          title: "Thành công!",
          description: "Đã check-in nhận xe thành công",
        })
        router.push(`/dashboard/rental/${rentalId}`)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể check-in",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const allChecked = Object.values(inspectionChecklist).every((v) => v) && agreed && odometerReading && batteryLevel

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
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Không tìm thấy thông tin đơn thuê</p>
        </Card>
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

      <div className="max-w-[1800px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-blue-600 rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Check-in nhận xe</h1>
              <p className="text-blue-100 text-lg">Xác nhận tình trạng xe trước khi khởi hành</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Vehicle & Rental Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Info Card */}
            <Card className="shadow-md">
                <CardHeader className="bg-blue-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    Thông tin xe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {vehicleType ? `${vehicleType.brand} ${vehicleType.model}` : "Đang tải..."}
                        </div>
                        <div className="text-sm text-gray-600">{vehicleType?.typeName || "---"}</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
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
                            <div className="text-xs text-gray-600">Dung lượng pin</div>
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

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-gray-900">{branch?.branchName || "Đang tải..."}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {branch?.address}, {branch?.city}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            📞 {branch?.contactNumber || "---"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ⏰ {branch?.workingHours || "---"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-600">Thời gian nhận</div>
                        <div className="font-medium">{rentalOrder ? new Date(rentalOrder.startTime).toLocaleString('vi-VN') : "---"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-600">Thời gian trả</div>
                        <div className="font-medium">{rentalOrder?.endTime ? new Date(rentalOrder.endTime).toLocaleString('vi-VN') : "---"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Vehicle Inspection */}
            <Card className="shadow-md">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle>Kiểm tra xe</CardTitle>
                  <CardDescription>Xác nhận tình trạng cùng nhân viên</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Checklist */}
                  <div className="space-y-3">
                    <div 
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inspectionChecklist.exterior 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setInspectionChecklist({ ...inspectionChecklist, exterior: !inspectionChecklist.exterior })}
                    >
                      <Checkbox
                        checked={inspectionChecklist.exterior}
                        onCheckedChange={(checked) =>
                          setInspectionChecklist({ ...inspectionChecklist, exterior: checked as boolean })
                        }
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Ngoại thất</div>
                        <div className="text-sm text-gray-600">Kiểm tra vết xước, móp méo, đèn, gương</div>
                      </div>
                    </div>

                    <div 
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inspectionChecklist.interior 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setInspectionChecklist({ ...inspectionChecklist, interior: !inspectionChecklist.interior })}
                    >
                      <Checkbox
                        checked={inspectionChecklist.interior}
                        onCheckedChange={(checked) =>
                          setInspectionChecklist({ ...inspectionChecklist, interior: checked as boolean })
                        }
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Nội thất</div>
                        <div className="text-sm text-gray-600">Kiểm tra ghế ngồi, vô lăng, màn hình</div>
                      </div>
                    </div>

                    <div 
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inspectionChecklist.battery 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setInspectionChecklist({ ...inspectionChecklist, battery: !inspectionChecklist.battery })}
                    >
                      <Checkbox
                        checked={inspectionChecklist.battery}
                        onCheckedChange={(checked) =>
                          setInspectionChecklist({ ...inspectionChecklist, battery: checked as boolean })
                        }
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Pin & Động cơ</div>
                        <div className="text-sm text-gray-600">Kiểm tra mức pin, hệ thống sạc</div>
                      </div>
                    </div>

                    <div 
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inspectionChecklist.documents 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setInspectionChecklist({ ...inspectionChecklist, documents: !inspectionChecklist.documents })}
                    >
                      <Checkbox
                        checked={inspectionChecklist.documents}
                        onCheckedChange={(checked) =>
                          setInspectionChecklist({ ...inspectionChecklist, documents: checked as boolean })
                        }
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Giấy tờ xe</div>
                        <div className="text-sm text-gray-600">Đăng ký xe, bảo hiểm, phù hiệu</div>
                      </div>
                    </div>

                    <div 
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        inspectionChecklist.photos 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setInspectionChecklist({ ...inspectionChecklist, photos: !inspectionChecklist.photos })}
                    >
                      <Checkbox
                        checked={inspectionChecklist.photos}
                        onCheckedChange={(checked) =>
                          setInspectionChecklist({ ...inspectionChecklist, photos: checked as boolean })
                        }
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Chụp ảnh bàn giao</div>
                        <div className="text-sm text-gray-600">4 góc xe + nội thất</div>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Số km hiện tại *</Label>
                      <Input
                        type="number"
                        value={odometerReading}
                        onChange={(e) => setOdometerReading(e.target.value)}
                        placeholder="Nhập số km"
                        className="h-12 text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mức pin hiện tại (%) *</Label>
                      <Input
                        type="number"
                        value={batteryLevel}
                        onChange={(e) => setBatteryLevel(e.target.value)}
                        min="0"
                        max="100"
                        placeholder="0-100"
                        className="h-12 text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ghi chú (nếu có)</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ghi chú về tình trạng xe..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              {/* Progress Card */}
              <Card className="shadow-md mb-6">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg">Tiến trình check-in</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(inspectionChecklist).map(([key, checked]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key === 'exterior' ? 'Ngoại thất' : key === 'interior' ? 'Nội thất' : key === 'battery' ? 'Pin' : key === 'documents' ? 'Giấy tờ' : 'Ảnh'}</span>
                        {checked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      </div>
                    ))}
                  </div>
                  <Progress value={(Object.values(inspectionChecklist).filter(Boolean).length / 5) * 100} className="mt-4" />
                  <p className="text-xs text-gray-600 mt-2">
                    {Object.values(inspectionChecklist).filter(Boolean).length}/5 hoàn thành
                  </p>
                </CardContent>
              </Card>

              {/* Agreement */}
              <Card className="shadow-md bg-blue-600 text-white mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="mt-1 bg-white border-white"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium mb-2">Xác nhận</p>
                      <p className="text-blue-100">
                        Tôi đã kiểm tra xe cùng nhân viên và xác nhận tình trạng xe như mô tả. Tôi cam kết sử dụng xe đúng mục đích và tuân thủ luật giao thông.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button
                onClick={handleCheckin}
                disabled={!allChecked || isSubmitting}
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Xác nhận nhận xe
                  </>
                )}
              </Button>

              {!allChecked && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Vui lòng hoàn thành tất cả bước kiểm tra và nhập đầy đủ thông tin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
