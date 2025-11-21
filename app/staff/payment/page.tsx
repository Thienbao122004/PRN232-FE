"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft,
  DollarSign, 
  CreditCard, 
  Wallet, 
  CheckCircle, 
  Receipt, 
  User, 
  Car,
  Search,
  Smartphone,
  Banknote,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authToken, userInfo } from "@/lib/auth"
import { rentalOrderService, paymentService } from "@/services"
import type { RentalOrderResponse, CreatePaymentRequest } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [rentals, setRentals] = useState<RentalOrderResponse[]>([])
  const [selectedRental, setSelectedRental] = useState<RentalOrderResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "Cash",
    amount: "",
    transactionRef: "",
  })

  useEffect(() => {
    const currentUser = userInfo.get()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadCompletedRentals()
  }, [])

  const loadPendingPayments = async () => {
    try {
      setLoading(true)
      const response = await rentalOrderService.getAllRentals({ 
        page: 1, 
        pageSize: 50,
        status: "Completed"
      })

      if (response.success && response.data) {
        const items = response.data.items || []
        setRentals(items.length > 0 ? items : getMockCompletedRentals())
      } else {
        setRentals(getMockCompletedRentals())
      }
    } catch (error) {
      console.error("Error loading rentals:", error)
      setRentals(getMockCompletedRentals())
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn thuê",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockCompletedRentals = (): any[] => {
    const now = new Date()
    return [
      {
        rentalId: "RO003",
        renterId: "U003",
        vehicleId: "VH003",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 3200000,
        actualCost: 3500000,
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Completed",
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U003", fullName: "Lê Hoàng Cường", email: "lehoangc@email.com", phoneNumber: "0923456789" },
        vehicle: { vehicleId: "VH003", plateNumber: "59A-111.22", typeVehicle: { typeName: "VinFast VF e34" } },
        checkout: { 
          extraFee: 300000, 
          extraFeeReason: "Trả xe trễ 6 giờ",
          checkoutTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        rentalId: "RO007",
        renterId: "U007",
        vehicleId: "VH004",
        branchStartId: "BR001",
        branchEndId: "BR001",
        estimatedCost: 2800000,
        actualCost: 2800000,
        startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime()).toISOString(),
        status: "Completed",
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U007", fullName: "Hoàng Văn Đạt", email: "hoangvd@email.com", phoneNumber: "0956789012" },
        vehicle: { vehicleId: "VH004", plateNumber: "59A-333.44", typeVehicle: { typeName: "VinFast VF 5" } },
        checkout: { 
          extraFee: 0, 
          checkoutTime: new Date(now.getTime()).toISOString()
        }
      }
    ]
  }

  const getMockCustomers = () => {
    return [
      {
        userId: "U001",
        fullName: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        phoneNumber: "0901234567",
        address: "123 Lê Lợi, Q1, TP.HCM",
        totalRentals: 5,
        totalSpent: 12500000,
        lastRentalDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        userId: "U002",
        fullName: "Trần Thị Bình",
        email: "tranthib@email.com",
        phoneNumber: "0912345678",
        address: "456 Nguyễn Huệ, Q1, TP.HCM",
        totalRentals: 3,
        totalSpent: 7200000,
        lastRentalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        userId: "U003",
        fullName: "Lê Hoàng Cường",
        email: "lehoangc@email.com",
        phoneNumber: "0923456789",
        address: "789 Võ Văn Tần, Q3, TP.HCM",
        totalRentals: 8,
        totalSpent: 22400000,
        lastRentalDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCompletedRentals()
      return
    }

    try {
      setLoading(true)
      const response = await rentalOrderService.getAllRentals({ 
        page: 1, 
        pageSize: 100
      })

      if (response.success && response.data) {
        const allRentals = response.data.items || []
        const filtered = allRentals.filter((rental: RentalOrderResponse) => 
          (rental.status === "Completed" || rental.status === "Active") &&
          (rental.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.renterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        setRentals(filtered)
      }
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPayment = async () => {
    if (!selectedRental) return

    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập số tiền thanh toán",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(true)

      const paymentData: CreatePaymentRequest = {
        rentalId: selectedRental.rentalId,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionRef: paymentForm.transactionRef || "COUNTER_PAYMENT",
      }

      const response = await paymentService.createPayment(paymentData)

      if (response.success) {
        // Update rental to Closed if this is final payment
        if (selectedRental.status === "Completed") {
          await rentalOrderService.updateRentalStatus(selectedRental.rentalId, "Closed")
        }

        toast({
          title: "Thành công",
          description: "Đã ghi nhận thanh toán",
        })

        // Reset form
        setSelectedRental(null)
        setPaymentForm({
          paymentMethod: "Cash",
          amount: "",
          transactionRef: "",
        })

        // Reload rentals
        loadCompletedRentals()
      }
    } catch (error: any) {
      console.error("Error processing payment:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xử lý thanh toán",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash":
        return <Banknote className="w-5 h-5" />
      case "CreditCard":
      case "DebitCard":
        return <CreditCard className="w-5 h-5" />
      case "MoMo":
      case "ZaloPay":
        return <Smartphone className="w-5 h-5" />
      default:
        return <Wallet className="w-5 h-5" />
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
          <h1 className="text-3xl font-bold">Thanh toán tại quầy</h1>
          <p className="text-muted-foreground">Ghi nhận thanh toán tiền mặt và các hình thức khác</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rental List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Đơn cần thanh toán</CardTitle>
                <CardDescription>Chọn đơn để xử lý</CardDescription>
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
                      <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Không có đơn nào cần thanh toán</p>
                    </div>
                  ) : (
                    rentals.map((rental) => (
                      <div
                        key={rental.rentalId}
                        onClick={() => {
                          setSelectedRental(rental)
                          setPaymentForm({
                            ...paymentForm,
                            amount: (rental.actualCost || rental.estimatedCost).toString()
                          })
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedRental?.rentalId === rental.rentalId
                            ? "border-green-500 bg-green-50"
                            : "border-border hover:border-green-300 hover:bg-green-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {rental.rentalId.substring(0, 8)}
                          </Badge>
                          <Badge className="bg-green-600">
                            {rental.status}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Xe: {rental.vehicleId}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Số tiền: {(rental.actualCost || rental.estimatedCost).toLocaleString('vi-VN')} VNĐ
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            {!selectedRental ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Receipt className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa chọn đơn</h3>
                  <p className="text-muted-foreground text-center">
                    Vui lòng chọn một đơn thuê từ danh sách bên trái để ghi nhận thanh toán
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
                          <Badge className="bg-green-600">{selectedRental.status}</Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Xe</Label>
                        <div className="font-medium">{selectedRental.vehicleId}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Khách hàng</Label>
                        <div className="font-medium">{selectedRental.renterId}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Thời gian thuê</Label>
                        <div className="font-medium">
                          {new Date(selectedRental.startTime).toLocaleDateString('vi-VN')}
                          {selectedRental.endTime && 
                            ` - ${new Date(selectedRental.endTime).toLocaleDateString('vi-VN')}`
                          }
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Chi phí dự kiến</Label>
                        <div className="font-medium">
                          {selectedRental.estimatedCost.toLocaleString('vi-VN')} VNĐ
                        </div>
                      </div>
                    </div>

                    {selectedRental.actualCost && selectedRental.actualCost !== selectedRental.estimatedCost && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Chi phí thực tế</span>
                          <span className="text-xl font-bold text-blue-600">
                            {selectedRental.actualCost.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phương thức thanh toán</CardTitle>
                    <CardDescription>Chọn hình thức thanh toán</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">
                        Phương thức <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={paymentForm.paymentMethod} 
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}
                      >
                        <SelectTrigger id="paymentMethod">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">
                            <div className="flex items-center gap-2">
                              <Banknote className="w-4 h-4" />
                              Tiền mặt
                            </div>
                          </SelectItem>
                          <SelectItem value="CreditCard">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Thẻ tín dụng
                            </div>
                          </SelectItem>
                          <SelectItem value="DebitCard">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Thẻ ghi nợ
                            </div>
                          </SelectItem>
                          <SelectItem value="MoMo">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              MoMo
                            </div>
                          </SelectItem>
                          <SelectItem value="ZaloPay">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              ZaloPay
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">
                        Số tiền (VNĐ) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Nhập số tiền"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Đề xuất: {(selectedRental.actualCost || selectedRental.estimatedCost).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>

                    {paymentForm.paymentMethod !== "Cash" && (
                      <div>
                        <Label htmlFor="transactionRef">Mã giao dịch</Label>
                        <Input
                          id="transactionRef"
                          placeholder="Nhập mã giao dịch (nếu có)"
                          value={paymentForm.transactionRef}
                          onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Tổng kết thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Chi phí thuê xe</span>
                        <span>{selectedRental.estimatedCost.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                      
                      {selectedRental.actualCost && selectedRental.actualCost > selectedRental.estimatedCost && (
                        <div className="flex justify-between text-sm">
                          <span>Phí phát sinh</span>
                          <span className="text-red-600">
                            +{(selectedRental.actualCost - selectedRental.estimatedCost).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Tổng cần thanh toán</span>
                          <span className="text-2xl font-bold text-green-600">
                            {(selectedRental.actualCost || selectedRental.estimatedCost).toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Khách thanh toán</span>
                          <span className="font-bold">
                            {paymentForm.amount ? parseFloat(paymentForm.amount).toLocaleString('vi-VN') : '0'} VNĐ
                          </span>
                        </div>
                        {paymentForm.amount && parseFloat(paymentForm.amount) > (selectedRental.actualCost || selectedRental.estimatedCost) && (
                          <div className="flex justify-between items-center mt-2 text-blue-600">
                            <span className="text-sm">Tiền thừa</span>
                            <span className="font-bold">
                              {(parseFloat(paymentForm.amount) - (selectedRental.actualCost || selectedRental.estimatedCost)).toLocaleString('vi-VN')} VNĐ
                            </span>
                          </div>
                        )}
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
                    onClick={handleProcessPayment}
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processing ? (
                      "Đang xử lý..."
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Xác nhận thanh toán
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
