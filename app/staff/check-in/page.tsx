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
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Camera,
  Battery,
  FileText,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authToken, userInfo } from "@/lib/auth"
import { rentalOrderService, checkinService, vehicleService } from "@/services"
import type { RentalOrderResponse, CreateCheckinRequest } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function CheckInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRental, setSelectedRental] = useState<RentalOrderResponse | null>(null)
  const [rentals, setRentals] = useState<RentalOrderResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [contract, setContract] = useState<any>(null)
  const [loadingContract, setLoadingContract] = useState(false)
  const [rentalDetails, setRentalDetails] = useState<any>(null)
  const [hasDepositPayment, setHasDepositPayment] = useState(false)

  // Form data - chỉ checklist
  const [formData, setFormData] = useState({
    customerIdVerified: false,
    documentsChecked: false,
    vehicleInspected: false,
  })

  useEffect(() => {
    const currentUser = userInfo.get()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadRentals()

    // Check if there's a rentalId in the query params
    const rentalId = searchParams.get('rentalId')
    if (rentalId) {
      loadRentalDetails(rentalId)
    }
  }, [])

  const loadRentals = async () => {
    try {
      setLoading(true)
      
      // Call API through Gateway
      const token = authToken.get()
      const response = await fetch('https://localhost:7000/api/rental/rentals?page=1&pageSize=20', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log("📥 Rentals response:", result)

      if (result.success && result.data) {
        // Data is direct array from API
        const rentalList = Array.isArray(result.data) ? result.data : []
        
        // Debug: Log all statuses
        console.log("📋 All rental statuses:", rentalList.map((r: any) => ({ id: r.rentalId, status: r.status })))
        
        // Hiển thị tất cả các đơn thuê
        console.log("✅ All rentals loaded:", rentalList)
        setRentals(rentalList)
      } else {
        console.log("⚠️ No data, using mock")
        setRentals(getMockConfirmedRentals())
      }
    } catch (error) {
      console.error("Error loading rentals:", error)
      setRentals(getMockConfirmedRentals())
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn thuê",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockConfirmedRentals = (): any[] => {
    const today = new Date()
    today.setHours(10, 0, 0, 0)
    return [
      {
        rentalId: "RO001",
        renterId: "U001",
        vehicleId: "VH001",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 2500000,
        startTime: today.toISOString(),
        endTime: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Confirmed",
        createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U001", fullName: "Nguyễn Văn An", email: "nguyenvanan@email.com", phoneNumber: "0901234567" },
        vehicle: { vehicleId: "VH001", plateNumber: "59A-123.45", typeVehicle: { typeName: "VinFast VF e34" } }
      },
      {
        rentalId: "RO004",
        renterId: "U004",
        vehicleId: "VH005",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 1500000,
        startTime: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Confirmed",
        createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U004", fullName: "Phạm Minh Đức", email: "phammd@email.com", phoneNumber: "0934567890" },
        vehicle: { vehicleId: "VH005", plateNumber: "59A-555.66", typeVehicle: { typeName: "VinFast VF 8" } }
      }
    ]
  }

  const loadRentalDetails = async (rentalId: string) => {
    try {
      const token = authToken.get()
      
      // Load rental order details
      const response = await rentalOrderService.getRentalOrderById(rentalId)
      if (response.success && response.data) {
        setSelectedRental(response.data)
      }

      // Load rental with payment info from Gateway API
      const paymentResponse = await fetch(
        `https://localhost:7000/api/rental/rentals/${rentalId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (paymentResponse.ok) {
        const result = await paymentResponse.json()
        console.log('💰 Rental payment details:', result.data)
        console.log('💳 Payments array:', result.data.payments)
        
        setRentalDetails(result.data)
        
        // Check if deposit payment exists and is paid
        const hasPaidDeposit = result.data.payments && 
                              result.data.payments.length > 0 && 
                              result.data.payments.some((p: any) => p.status === "Paid")
        
        console.log('✅ Has paid deposit:', hasPaidDeposit)
        setHasDepositPayment(hasPaidDeposit)
      } else {
        console.log('⚠️ Could not load payment details')
        setHasDepositPayment(false)
      }
    } catch (error) {
      console.error("Error loading rental:", error)
      setHasDepositPayment(false)
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
      // Search by rental ID or customer info
      const filtered = rentals.filter(rental => 
        rental.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.renterId.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setRentals(filtered)
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load contract info when rental is selected
  const loadContractInfo = async (rentalId: string) => {
    setLoadingContract(true)
    try {
      const token = authToken.get()
      const response = await fetch(
        `https://localhost:7015/api/rental-contracts/by-rental/${rentalId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setContract(result.data)
          console.log("📄 Contract loaded:", result.data)
          console.log("👤 Staff signed status:", result.data.signedByStaff)
          console.log("🧑 Renter signed status:", result.data.signedByRenter)
        }
      } else {
        console.log("⚠️ Contract not found or error:", response.status)
        setContract(null)
      }
    } catch (error) {
      console.error("❌ Error loading contract:", error)
      setContract(null)
    } finally {
      setLoadingContract(false)
    }
  }

  // Sign contract by staff
  const handleSignContract = async () => {
    if (!selectedRental || !contract) return

    try {
      setSubmitting(true)
      const token = authToken.get()

      console.log("✍️ Staff signing contract ID:", contract.contractId)
      const signatureData = {
        contractId: contract.contractId,
        signedByStaff: 1,
        signedByRenter: contract.signedByRenter
      }

      const signatureResponse = await fetch(
        `https://localhost:7015/api/rental-contracts/${contract.contractId}/signatures`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(signatureData),
        }
      )

      if (!signatureResponse.ok) {
        throw new Error("Không thể ký hợp đồng")
      }

      const signatureResult = await signatureResponse.json()
      console.log("✅ Contract signed:", signatureResult)

      toast({
        title: "Thành công",
        description: "Đã ký hợp đồng thành công",
      })

      // Reload contract info
      await loadContractInfo(selectedRental.rentalId)

    } catch (error: any) {
      console.error("❌ Error signing contract:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể ký hợp đồng",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitCheckIn = async () => {
    if (!selectedRental) return

    // Validation - chỉ kiểm tra checklist
    if (!formData.customerIdVerified || !formData.documentsChecked || !formData.vehicleInspected) {
      toast({
        title: "Chưa hoàn thành kiểm tra",
        description: "Vui lòng hoàn thành tất cả các bước xác thực",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const token = authToken.get()
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại")
      }

      // Create check-in record
      console.log("📝 Creating check-in record")
      const detailsResponse = await rentalOrderService.getRentalOrderDetails(selectedRental.rentalId)
      
      if (!detailsResponse.success || !detailsResponse.data || detailsResponse.data.length === 0) {
        throw new Error("Không tìm thấy thông tin chi tiết đơn thuê")
      }

      const rentalDetail = detailsResponse.data[0]

      const checkinData: CreateCheckinRequest = {
        rentalOrderDetailId: rentalDetail.id,
        staffId: user.userId,
        odometerReading: 0, // Default value - sẽ được cập nhật khi checkout
        batteryLevel: 100, // Default value - giả định pin đầy khi bàn giao
        status: "Completed",
        photos: []
      }

      console.log("📤 Check-in data:", checkinData)

      const response = await checkinService.createCheckin(checkinData)

      if (response.success) {
        // Update rental status to Active (nếu chưa phải Active)
        console.log("🔄 Current rental status:", selectedRental.status)
        
        if (selectedRental.status !== "Active") {
          console.log("🔄 Updating rental status to Active")
          await rentalOrderService.updateRentalStatus(selectedRental.rentalId, "Active")
        } else {
          console.log("ℹ️ Rental already Active, skipping status update")
        }

        toast({
          title: "Thành công",
          description: "Đã hoàn thành bàn giao xe",
        })

        // Reset form
        setSelectedRental(null)
        setContract(null)
        setFormData({
          customerIdVerified: false,
          documentsChecked: false,
          vehicleInspected: false,
        })

        // Reload rentals
        loadRentals()
      }
    } catch (error: any) {
      console.error("❌ Error in check-in process:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể hoàn thành bàn giao xe",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold">Bàn giao xe (Check-in)</h1>
          <p className="text-muted-foreground">Xác nhận giấy tờ và bàn giao xe cho khách hàng</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rental List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Đơn đặt trước</CardTitle>
                <CardDescription>Chọn đơn cần xử lý</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tìm theo mã đơn..."
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
                      <p>Không có đơn nào</p>
                    </div>
                  ) : (
                    rentals.map((rental) => (
                      <div
                        key={rental.rentalId}
                        onClick={() => {
                          setSelectedRental(rental)
                          loadContractInfo(rental.rentalId)
                          loadRentalDetails(rental.rentalId)
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedRental?.rentalId === rental.rentalId
                            ? "border-blue-500 bg-blue-50"
                            : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {rental.rentalId.substring(0, 8)}
                          </Badge>
                          <Badge className="bg-blue-600">
                            {rental.status}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Xe: {rental.vehicleId}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(rental.startTime).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Check-in Form */}
          <div className="lg:col-span-2">
            {!selectedRental ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Car className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa chọn đơn thuê</h3>
                  <p className="text-muted-foreground text-center">
                    Vui lòng chọn một đơn đặt trước từ danh sách bên trái để bắt đầu quy trình bàn giao xe
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
                          <Badge className="bg-blue-600">{selectedRental.status}</Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Xe</Label>
                        <div className="font-medium">{selectedRental.vehicleId}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Thời gian bắt đầu</Label>
                        <div className="font-medium">
                          {new Date(selectedRental.startTime).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Chi phí dự kiến</Label>
                        <div className="font-medium text-green-600">
                          {selectedRental.estimatedCost.toLocaleString('vi-VN')} VNĐ
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách kiểm tra</CardTitle>
                    <CardDescription>Xác thực giấy tờ và kiểm tra xe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="customerIdVerified"
                        checked={formData.customerIdVerified}
                        onChange={(e) => setFormData({ ...formData, customerIdVerified: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="customerIdVerified" className="cursor-pointer flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Đã xác thực CMND/CCCD khách hàng
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="documentsChecked"
                        checked={formData.documentsChecked}
                        onChange={(e) => setFormData({ ...formData, documentsChecked: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="documentsChecked" className="cursor-pointer flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Đã kiểm tra giấy phép lái xe
                      </Label>
                    </div>

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
                        Đã kiểm tra tình trạng xe
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Contract Status */}
                {contract && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trạng thái hợp đồng</CardTitle>
                      <CardDescription className="text-xs">
                        Debug: Staff={contract.signedByStaff}, Renter={contract.signedByRenter}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Khách hàng đã ký</span>
                        {contract.signedByRenter === 1 ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-xs text-green-600">Đã ký</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-gray-300" />
                            <span className="text-xs text-gray-500">Chưa ký</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Staff đã ký</span>
                        {contract.signedByStaff === 1 ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-xs text-green-600">Đã ký</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-gray-300" />
                            <span className="text-xs text-gray-500">Chưa ký</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  {/* Debug info */}
                  {contract && (
                    <div className="p-2 bg-gray-100 rounded text-xs">
                      <p>Contract ID: {contract.contractId}</p>
                      <p>signedByStaff: {JSON.stringify(contract.signedByStaff)} (type: {typeof contract.signedByStaff})</p>
                      <p>signedByRenter: {JSON.stringify(contract.signedByRenter)} (type: {typeof contract.signedByRenter})</p>
                      <p>hasDepositPayment: {JSON.stringify(hasDepositPayment)}</p>
                      <p>Payments: {rentalDetails?.payments ? JSON.stringify(rentalDetails.payments.map((p: any) => ({amount: p.amount, status: p.status}))) : 'null'}</p>
                      <p>Show Sign Button: {String(contract.signedByStaff === 0 || contract.signedByStaff === false)}</p>
                      <p>Show Complete Button: {String(contract.signedByStaff === 1 || contract.signedByStaff === true)}</p>
                      <p>Enable Complete Button: {String(hasDepositPayment)}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setSelectedRental(null)
                        setContract(null)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Hủy
                    </Button>

                    {/* Nút Ký hợp đồng - Hiển thị khi contract chưa được staff ký */}
                    {contract && (contract.signedByStaff === 0 || contract.signedByStaff === false) && (
                      <Button
                        onClick={handleSignContract}
                        disabled={submitting || loadingContract}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {submitting ? (
                          "Đang ký..."
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            Ký hợp đồng
                          </>
                        )}
                      </Button>
                    )}

                    {/* Nút Hoàn thành bàn giao - Chỉ hiển thị khi staff đã ký hợp đồng VÀ khách hàng đã thanh toán */}
                    {contract && (contract.signedByStaff === 1 || contract.signedByStaff === true) && (
                      <Button
                        onClick={handleSubmitCheckIn}
                        disabled={submitting || !hasDepositPayment}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          "Đang xử lý..."
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Hoàn thành bàn giao
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Thông báo cần ký hợp đồng trước */}
                  {contract && contract.signedByStaff === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-900">Cần ký hợp đồng</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Vui lòng ký hợp đồng trước khi hoàn thành bàn giao xe cho khách hàng
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thông báo cần thanh toán tiền cọc */}
                  {contract && (contract.signedByStaff === 1 || contract.signedByStaff === true) && !hasDepositPayment && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">Khách hàng chưa thanh toán tiền cọc</p>
                          <p className="text-sm text-red-700 mt-1">
                            Không thể bàn giao xe khi khách hàng chưa thanh toán tiền cọc. Vui lòng yêu cầu khách hàng thanh toán trước.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Đang load contract */}
                  {loadingContract && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 text-center">Đang tải thông tin hợp đồng...</p>
                    </div>
                  )}

                  {/* Không tìm thấy contract */}
                  {!contract && !loadingContract && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">Chưa có hợp đồng</p>
                          <p className="text-sm text-red-700 mt-1">
                            Khách hàng chưa ký hợp đồng. Vui lòng yêu cầu khách hàng hoàn thành ký hợp đồng trước.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
