"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Search,
  Car,
  CheckCircle,
  AlertCircle,
  Battery,
  Clock,
  DollarSign,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authToken, userInfo } from "@/lib/auth"
import { rentalOrderService, checkoutService } from "@/services"
import type { RentalOrderResponse, CreateCheckoutRequest } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function CheckOutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRental, setSelectedRental] = useState<RentalOrderResponse | null>(null)
  const [rentals, setRentals] = useState<RentalOrderResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    odometerReading: "",
    batteryLevel: "",
    extraFee: "",
    extraFeeReason: "",
    notes: "",
    vehicleInspected: false,
    damageChecked: false,
  })

  useEffect(() => {
    const currentUser = userInfo.get()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadRentals()

    const rentalId = searchParams.get('rentalId')
    if (rentalId) {
      loadRentalDetails(rentalId)
    }
  }, [])

  const loadRentals = async () => {
    try {
      setLoading(true)
      const token = authToken.get()
      
      console.log("🔑 Auth token:", token ? "exists" : "missing")
      
      if (!token) {
        console.log("⚠️ No auth token, using mock data")
        setRentals(getMockActiveRentals())
        return
      }

      // Gọi API lấy danh sách rental orders với status Active
      console.log("📞 Calling rentals API for Active status...")
      const response = await fetch(
        'https://localhost:7000/api/rental/rentals?pageIndex=1&pageSize=50',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      console.log("📡 Response status:", response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log("📋 Rentals loaded:", result)
        
        if (result.success && result.data) {
          // Lấy array từ result.data (có thể là array trực tiếp hoặc trong data.data)
          let rentalList = Array.isArray(result.data) ? result.data : 
                          (Array.isArray(result.data.data) ? result.data.data : [])
          
          // Filter chỉ lấy đơn Active (đang cho thuê)
          rentalList = rentalList.filter((r: any) => r.status === "Active")
          
          console.log("✅ Active rentals:", rentalList.length)
          console.log("📦 Rental list:", rentalList)
          setRentals(rentalList)
        } else {
          console.log("⚠️ No rental data, using mock")
          setRentals(getMockActiveRentals())
        }
      } else {
        const errorText = await response.text()
        console.log("❌ API error:", response.status, errorText)
        setRentals(getMockActiveRentals())
      }
    } catch (error) {
      console.error("Error loading rentals:", error)
      setRentals(getMockActiveRentals())
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách xe đang thuê",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockActiveRentals = (): any[] => {
    const now = new Date()
    return [
      {
        rentalId: "RO002",
        renterId: "U002",
        vehicleId: "VH002",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 1800000,
        actualCost: 1800000,
        startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Active",
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U002", fullName: "Trần Thị Bình", email: "tranthib@email.com", phoneNumber: "0912345678" },
        vehicle: { vehicleId: "VH002", plateNumber: "59A-678.90", typeVehicle: { typeName: "VinFast VF 8" } },
        checkin: { odometerReading: 12500, batteryLevel: 95, checkinTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() }
      },
      {
        rentalId: "RO006",
        renterId: "U006",
        vehicleId: "VH003",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 2200000,
        actualCost: 2200000,
        startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime()).toISOString(),
        status: "Active",
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U006", fullName: "Võ Thị Hà", email: "vothiha@email.com", phoneNumber: "0945678901" },
        vehicle: { vehicleId: "VH003", plateNumber: "59A-111.22", typeVehicle: { typeName: "VinFast VF e34" } },
        checkin: { odometerReading: 8200, batteryLevel: 88, checkinTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }
      }
    ]
  }

  const loadRentalDetails = async (rentalId: string) => {
    try {
      const response = await rentalOrderService.getRentalOrderById(rentalId)
      if (response.success && response.data) {
        setSelectedRental(response.data)
      }
    } catch (error) {
      console.error("Error loading rental:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin đơn thuê",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRentals()
      return
    }

    try {
      setLoading(true)
      const filtered = rentals.filter(rental => 
        rental.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.renterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.vehicleId.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setRentals(filtered)
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateExtraCharges = () => {
    if (!selectedRental) return 0
    
    const endDate = new Date(selectedRental.endTime || "")
    const now = new Date()
    
    // Calculate late return fee (if overdue)
    if (now > endDate) {
      const hoursLate = Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60))
      const lateFee = hoursLate * 50000 // 50k VND per hour
      return lateFee
    }
    
    return 0
  }

  const handleSubmitCheckOut = async () => {
    if (!selectedRental) return

    // Validation
    if (!formData.odometerReading || !formData.batteryLevel) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập số km và mức pin",
        variant: "destructive",
      })
      return
    }

    if (!formData.vehicleInspected || !formData.damageChecked) {
      toast({
        title: "Chưa hoàn thành kiểm tra",
        description: "Vui lòng hoàn thành tất cả các bước kiểm tra",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Get rental order details
      const detailsResponse = await rentalOrderService.getRentalOrderDetails(selectedRental.rentalId)
      
      if (!detailsResponse.success || !detailsResponse.data || detailsResponse.data.length === 0) {
        throw new Error("Không tìm thấy thông tin chi tiết đơn thuê")
      }

      const rentalDetail = detailsResponse.data[0]

      // Calculate total extra fees
      const lateFee = calculateExtraCharges()
      const additionalFee = formData.extraFee ? parseFloat(formData.extraFee) : 0
      const totalExtraFee = lateFee + additionalFee

      const checkoutData: CreateCheckoutRequest = {
        rentalOrderDetailId: rentalDetail.id,
        staffId: user.userId,
        odometerReading: parseInt(formData.odometerReading),
        batteryLevel: parseInt(formData.batteryLevel),
        extraFee: totalExtraFee,
        status: "Completed",
        photos: formData.notes ? [{
          photoUrl: "",
          description: `${formData.notes}${formData.extraFeeReason ? `\nPhí phát sinh: ${formData.extraFeeReason}` : ''}`
        }] : []
      }

      const response = await checkoutService.createCheckout(checkoutData)

      if (response.success) {
        // Update rental status to Completed
        await rentalOrderService.updateRentalStatus(selectedRental.rentalId, "Completed")

        toast({
          title: "Thành công",
          description: "Đã hoàn thành nhận lại xe",
        })

        // Reset form
        setSelectedRental(null)
        setFormData({
          odometerReading: "",
          batteryLevel: "",
          extraFee: "",
          extraFeeReason: "",
          notes: "",
          vehicleInspected: false,
          damageChecked: false,
        })

        // Reload rentals
        loadRentals()
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể hoàn thành nhận lại xe",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const isOverdue = () => {
    if (!selectedRental || !selectedRental.endTime) return false
    return new Date() > new Date(selectedRental.endTime)
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/staff">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nhận lại xe (Check-out)</h1>
          <p className="text-muted-foreground">Kiểm tra xe và ghi nhận phí phát sinh</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Rentals List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Xe đang cho thuê</CardTitle>
                <CardDescription>Chọn xe cần nhận lại</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tìm theo mã đơn hoặc xe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Đang tải...
                    </div>
                  ) : rentals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Không có xe nào đang cho thuê</p>
                    </div>
                  ) : (
                    rentals.map((rental) => {
                      const endDate = new Date(rental.endTime || "")
                      const isLate = endDate < new Date()

                      return (
                        <div
                          key={rental.rentalId}
                          onClick={() => setSelectedRental(rental)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedRental?.rentalId === rental.rentalId
                              ? isLate 
                                ? "border-red-500 bg-red-50"
                                : "border-green-500 bg-green-50"
                              : isLate
                                ? "border-red-200 hover:border-red-300 hover:bg-red-50/50"
                                : "border-border hover:border-green-300 hover:bg-green-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">
                              {rental.rentalId.substring(0, 8)}
                            </Badge>
                            {isLate && (
                              <Badge className="bg-red-600">
                                Quá hạn
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Xe: {rental.vehicleId}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              Hết hạn: {endDate.toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Check-out Form */}
          <div className="lg:col-span-2">
            {!selectedRental ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Car className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa chọn xe</h3>
                  <p className="text-muted-foreground text-center">
                    Vui lòng chọn một xe đang cho thuê từ danh sách bên trái để bắt đầu quy trình nhận lại xe
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Rental Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin đơn thuê</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Mã đơn</Label>
                        <div className="font-medium">{selectedRental.rentalId}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Trạng thái</Label>
                        <div>
                          <Badge className={isOverdue() ? "bg-red-600" : "bg-green-600"}>
                            {isOverdue() ? "Quá hạn" : selectedRental.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Xe</Label>
                        <div className="font-medium">{selectedRental.vehicleId}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Thời gian kết thúc</Label>
                        <div className="font-medium">
                          {new Date(selectedRental.endTime || "").toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Chi phí dự kiến</Label>
                        <div className="font-medium">
                          {selectedRental.estimatedCost.toLocaleString('vi-VN')} VNĐ
                        </div>
                      </div>
                      {isOverdue() && (
                        <div>
                          <Label className="text-muted-foreground">Phí trễ hạn</Label>
                          <div className="font-medium text-red-600">
                            +{calculateExtraCharges().toLocaleString('vi-VN')} VNĐ
                          </div>
                        </div>
                      )}
                    </div>

                    {isOverdue() && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-900">Xe trả muộn</div>
                          <div className="text-sm text-red-700">
                            Khách hàng đã trả xe muộn hơn thời gian quy định. Phí phạt sẽ được tính tự động.
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Inspection Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách kiểm tra</CardTitle>
                    <CardDescription>Kiểm tra tình trạng xe khi nhận lại</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="vehicleInspected"
                        checked={formData.vehicleInspected}
                        onChange={(e) => setFormData({ ...formData, vehicleInspected: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="vehicleInspected" className="cursor-pointer flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Đã kiểm tra ngoại thất xe
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="damageChecked"
                        checked={formData.damageChecked}
                        onChange={(e) => setFormData({ ...formData, damageChecked: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="damageChecked" className="cursor-pointer flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Đã kiểm tra hư hỏng và vệ sinh
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tình trạng xe khi nhận lại</CardTitle>
                    <CardDescription>Ghi nhận thông số xe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="odometerReading">
                        Số km hiện tại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="odometerReading"
                        type="number"
                        placeholder="Nhập số km"
                        value={formData.odometerReading}
                        onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="batteryLevel">
                        Mức pin (%) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="batteryLevel"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Nhập % pin"
                        value={formData.batteryLevel}
                        onChange={(e) => setFormData({ ...formData, batteryLevel: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Ghi chú tình trạng</Label>
                      <Textarea
                        id="notes"
                        placeholder="Ghi chú về tình trạng xe khi nhận lại (vết xước mới, hư hỏng...)"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Extra Fees */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Phí phát sinh
                    </CardTitle>
                    <CardDescription>Ghi nhận các khoản phí bổ sung (nếu có)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isOverdue() && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Phí trả xe muộn</span>
                          <span className="text-red-600 font-bold">
                            {calculateExtraCharges().toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="extraFee">Phí phát sinh khác (VNĐ)</Label>
                      <Input
                        id="extraFee"
                        type="number"
                        placeholder="Nhập số tiền"
                        value={formData.extraFee}
                        onChange={(e) => setFormData({ ...formData, extraFee: e.target.value })}
                      />
                    </div>

                    {formData.extraFee && (
                      <div>
                        <Label htmlFor="extraFeeReason">Lý do phí phát sinh</Label>
                        <Textarea
                          id="extraFeeReason"
                          placeholder="Mô tả lý do phát sinh phí (hư hỏng, vệ sinh...)"
                          value={formData.extraFeeReason}
                          onChange={(e) => setFormData({ ...formData, extraFeeReason: e.target.value })}
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Tổng chi phí</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {(
                            selectedRental.estimatedCost + 
                            calculateExtraCharges() + 
                            (formData.extraFee ? parseFloat(formData.extraFee) : 0)
                          ).toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bao gồm phí thuê và phí phát sinh
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedRental(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSubmitCheckOut}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      "Đang xử lý..."
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Hoàn thành nhận xe
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
