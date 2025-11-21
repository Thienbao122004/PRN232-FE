"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  CheckCircle2,
  Circle,
  FileText,
  CreditCard,
  Key,
  AlertTriangle,
  LogOut,
  DollarSign,
  Loader2,
  Zap
} from "lucide-react"
import Link from "next/link"
import { rentalOrderService, type RentalOrderResponse } from "@/services/rentalOrderService"
import { paymentService } from "@/services/paymentService"
import { rentalContractService } from "@/services/rentalContractService"
import { penaltyService } from "@/services/penaltyService"
import { useToast } from "@/hooks/use-toast"

// ✅ RENTAL FLOW STEPS
const FLOW_STEPS = [
  { id: 1, label: "Đặt xe", status: "Pending", icon: Circle },
  { id: 2, label: "Ký hợp đồng", status: "Pending", icon: FileText },
  { id: 3, label: "Đặt cọc", status: "Confirmed", icon: CreditCard },
  { id: 4, label: "Nhận xe", status: "Active", icon: Key },
  { id: 5, label: "Thuê xe", status: "Active", icon: AlertTriangle },
  { id: 6, label: "Trả xe", status: "Completed", icon: LogOut },
  { id: 7, label: "Thanh toán", status: "Closed", icon: DollarSign }
]

export default function RentalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const rentalId = params.id as string

  const [rental, setRental] = useState<RentalOrderResponse | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [penalties, setPenalties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [rentalId])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      // Load rental order
      const rentalResponse = await rentalOrderService.getRentalOrderById(rentalId)
      if (rentalResponse.success && rentalResponse.data) {
        setRental(rentalResponse.data)
      }

      // Load contract
      try {
        const contractResponse = await rentalContractService.getContractByRentalId(rentalId)
        if (contractResponse.success && contractResponse.data) {
          setContract(contractResponse.data)
        }
      } catch (error) {
        console.log("Contract not found yet")
      }

      // Load all payments
      try {
        const paymentResponse = await paymentService.getPaymentsByRentalId(rentalId, { page: 1, pageSize: 10 })
        if (paymentResponse.success && paymentResponse.data) {
          setPayments(paymentResponse.data.data || [])
        }
      } catch (error) {
        console.log("No payments found")
      }

      // Load penalties
      try {
        const penaltyResponse = await penaltyService.getPenaltiesByRentalId(rentalId, { page: 1, pageSize: 10 })
        if (penaltyResponse.success && penaltyResponse.data) {
          setPenalties(penaltyResponse.data.data || [])
        }
      } catch (error) {
        console.log("No penalties found")
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin đơn thuê"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ GET CURRENT STEP BASED ON STATUS
  const getCurrentStep = () => {
    if (!rental) return 1
    
    switch (rental.status) {
      case "Pending":
        if (contract) {
          // Kiểm tra cả staff và renter đã ký chưa
          if (contract.signedByRenter === 0) {
            return 2 // Đang chờ khách hàng ký
          }
          if (contract.signedByStaff === 0) {
            return 2 // Đang chờ staff ký
          }
          const hasDeposit = payments.some(p => p.transactionRef?.includes("DEPOSIT") && p.status === "Paid")
          return hasDeposit ? 4 : 3
        }
        return 1
      case "Confirmed":
        return 4 
      case "Active":
        return 5 
      case "Completed":
        return 6 
      case "Closed":
        return 7 
      default:
        return 1
    }
  }

  const currentStep = getCurrentStep()

  const depositPayment = payments.find(p => p.transactionRef?.includes("DEPOSIT") && p.status === "Paid")
  const finalPayment = payments.find(p => p.transactionRef?.includes("FINAL_PAYMENT") || p.transactionRef?.includes("REFUND"))
  const totalPenalties = penalties.reduce((sum, p) => sum + p.penaltyAmount, 0)

  const handleSignContract = () => {
    router.push(`/dashboard/rental/${rentalId}/sign-contract`)
  }

  const handlePayDeposit = () => {
    router.push(`/dashboard/rental/${rentalId}/pay-deposit`)
  }

  const handleCheckin = () => {
    router.push(`/dashboard/rental/checkin?rentalId=${rentalId}`)
  }

  const handleCheckout = () => {
    router.push(`/dashboard/rental/checkout?rentalId=${rentalId}`)
  }

  const handleFinalPayment = () => {
    router.push(`/dashboard/rental/${rentalId}/final-payment`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!rental) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy đơn thuê xe</p>
        <Button onClick={() => router.push("/dashboard/history")}>Quay lại</Button>
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
            <Link href="/dashboard/history">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Chi tiết đơn thuê xe</h1>
              <p className="text-blue-100 text-lg">Mã đơn: {rentalId}</p>
            </div>
          </div>
        </div>
        {/* Stepper */}
        <Card className="mb-6 shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Tiến trình thuê xe</CardTitle>
            <CardDescription>Theo dõi các bước của đơn thuê xe</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (FLOW_STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-7 gap-2">
                {FLOW_STEPS.map((step, index) => {
                  const isCompleted = index + 1 < currentStep
                  const isCurrent = index + 1 === currentStep
                  const Icon = step.icon

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div 
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10
                          ${isCompleted ? 'bg-blue-600 border-blue-600' : 
                            isCurrent ? 'bg-white border-blue-600' : 
                            'bg-white border-gray-300'}
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <p className={`mt-2 text-xs text-center font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Rental Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rental Order Info */}
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Thông tin đơn thuê</CardTitle>
                <Badge className={`${
                  rental.status === "Active" ? "bg-green-600" :
                  rental.status === "Completed" ? "bg-blue-600" :
                  rental.status === "Cancelled" ? "bg-red-600" :
                  "bg-yellow-600"
                }`}>
                  {rental.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                  <p className="font-medium">{new Date(rental.startTime).toLocaleString("vi-VN")}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Kết thúc</p>
                  <p className="font-medium">{rental.endTime ? new Date(rental.endTime).toLocaleString("vi-VN") : "Chưa xác định"}</p>
                </div>
              </div>
              <Separator />
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Chi phí dự kiến</p>
                <p className="text-2xl font-bold text-blue-600">
                  {rental.estimatedCost.toLocaleString("vi-VN")} đ
                </p>
              </div>
              {rental.actualCost && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Chi phí thực tế</p>
                  <p className="text-2xl font-bold text-green-600">
                    {rental.actualCost.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Info */}
          {contract && (
            <Card className="shadow-md">
              <CardHeader className="bg-green-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Hợp đồng điện tử
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Loại hợp đồng</span>
                  <Badge variant="outline">{contract.contractType}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Staff đã ký</span>
                  {contract.signedByStaff === 1 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Renter đã ký</span>
                  {contract.signedByRenter === 1 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                
                {/* Thông báo chờ staff ký */}
                {contract.signedByRenter === 1 && contract.signedByStaff === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Đang chờ nhân viên ký hợp đồng</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Hợp đồng cần được nhân viên xác nhận trước khi bạn có thể thanh toán tiền cọc
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payments */}
          {payments.length > 0 && (
            <Card className="shadow-md">
              <CardHeader className="bg-purple-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {depositPayment && (
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-medium text-gray-900">Tiền đặt cọc</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(depositPayment.paymentTime).toLocaleString("vi-VN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{depositPayment.amount.toLocaleString("vi-VN")} đ</p>
                        <Badge variant="outline" className="text-xs mt-1">{depositPayment.paymentMethod}</Badge>
                      </div>
                    </div>
                  )}
                  
                  {finalPayment && (
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-900">
                          {finalPayment.transactionRef?.includes("REFUND") ? "Hoàn tiền" : "Thanh toán cuối"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(finalPayment.paymentTime).toLocaleString("vi-VN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{finalPayment.amount.toLocaleString("vi-VN")} đ</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${finalPayment.status === "Paid" ? "bg-green-100" : "bg-yellow-100"}`}
                        >
                          {finalPayment.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Penalties */}
          {penalties.length > 0 && (
            <Card className="shadow-md border-l-4 border-l-red-600">
              <CardHeader className="bg-red-50 border-b">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Phí phạt
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {penalties.map((penalty) => (
                    <div key={penalty.penaltyId} className="flex justify-between items-start p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-1">
                        <p className="font-medium text-red-900">{penalty.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(penalty.issuedDate).toLocaleString("vi-VN")}
                        </p>
                      </div>
                      <p className="font-bold text-red-600 ml-4">
                        +{penalty.penaltyAmount.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold p-3 bg-red-100 rounded-lg">
                    <span className="text-gray-900">Tổng phí phạt</span>
                    <span className="text-red-600 text-xl">
                      {totalPenalties.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <Card className="shadow-md bg-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white">Hành động</CardTitle>
              <CardDescription className="text-blue-100">
                Bước tiếp theo của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Step 2: Sign Contract */}
              {rental.status === "Pending" && contract && contract.signedByRenter === 0 && (
                <Button 
                  onClick={handleSignContract}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ký hợp đồng điện tử
                </Button>
              )}

              {/* Step 3: Pay Deposit - Chỉ cho phép khi CẢ staff VÀ renter đã ký */}
              {rental.status === "Pending" && contract && !depositPayment && (
                <Button 
                  onClick={handlePayDeposit}
                  disabled={contract.signedByRenter === 0 || contract.signedByStaff === 0}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={contract.signedByStaff === 0 ? "Đang chờ nhân viên ký hợp đồng" : contract.signedByRenter === 0 ? "Vui lòng ký hợp đồng trước" : ""}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {contract.signedByStaff === 0 ? "Chờ staff ký HĐ" : "Thanh toán đặt cọc"}
                </Button>
              )}

              {/* Step 4: Check-in */}
              {rental.status === "Confirmed" && (
                <Button 
                  onClick={handleCheckin}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Nhận xe (Check-in)
                </Button>
              )}

              {/* Step 6: Check-out */}
              {rental.status === "Active" && (
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Trả xe (Check-out)
                </Button>
              )}

              {/* Step 7: Final Payment */}
              {rental.status === "Completed" && finalPayment && finalPayment.status === "Pending" && (
                <Button 
                  onClick={handleFinalPayment}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Thanh toán cuối cùng
                </Button>
              )}

              {rental.status === "Closed" && (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-white" />
                  <p className="font-medium">Đã hoàn thành!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Breakdown Card */}
          {rental.status === "Completed" && (
            <Card className="shadow-md">
              <CardHeader className="bg-orange-50 border-b">
                <CardTitle>Chi tiết chi phí</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Chi phí dự kiến</span>
                  <span className="font-medium">{rental.estimatedCost.toLocaleString("vi-VN")} đ</span>
                </div>
                {totalPenalties > 0 && (
                  <div className="flex justify-between p-3 bg-red-50 rounded-lg text-red-600">
                    <span>Phí phạt</span>
                    <span className="font-medium">+{totalPenalties.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                {depositPayment && (
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg text-blue-600">
                    <span>Đã đặt cọc</span>
                    <span className="font-medium">-{depositPayment.amount.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-bold text-gray-900">Cần thanh toán</span>
                  <span className="text-lg font-bold text-green-600">
                    {(rental.actualCost || rental.estimatedCost + totalPenalties - (depositPayment?.amount || 0)).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
