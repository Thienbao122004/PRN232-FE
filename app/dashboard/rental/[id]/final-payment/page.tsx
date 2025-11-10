"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  AlertTriangle,
  MinusCircle,
  PlusCircle,
  Zap
} from "lucide-react"
import Link from "next/link"
import { rentalOrderService } from "@/services/rentalOrderService"
import { paymentService } from "@/services/paymentService"
import { penaltyService } from "@/services/penaltyService"
import { useToast } from "@/hooks/use-toast"

const PAYMENT_METHODS = [
  { value: "MoMo", label: "Ví MoMo", icon: Wallet, color: "bg-pink-500" },
  { value: "ZaloPay", label: "ZaloPay", icon: Smartphone, color: "bg-blue-500" },
  { value: "CreditCard", label: "Thẻ tín dụng", icon: CreditCard, color: "bg-green-500" },
  { value: "DebitCard", label: "Thẻ ghi nợ", icon: CreditCard, color: "bg-purple-500" },
  { value: "Cash", label: "Tiền mặt", icon: Wallet, color: "bg-orange-500" }
]

export default function FinalPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const rentalId = params.id as string

  const [rental, setRental] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [penalties, setPenalties] = useState<any[]>([])
  const [finalPayment, setFinalPayment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("MoMo")

  useEffect(() => {
    loadData()
  }, [rentalId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const rentalResponse = await rentalOrderService.getRentalOrderById(rentalId)

      if (!rentalResponse.success || !rentalResponse.data) {
        throw new Error("Không thể tải thông tin đơn thuê")
      }

      setRental(rentalResponse.data)

      try {
        const paymentResponse = await paymentService.getPaymentsByRentalId(rentalId, { page: 1, pageSize: 10 })

        if (paymentResponse.success && paymentResponse.data) {
          const allPayments = Array.isArray(paymentResponse.data) 
            ? paymentResponse.data 
            : (paymentResponse.data.data || [])
          
          setPayments(allPayments)
          
          const final = allPayments.find(p => 
            (p.transactionRef?.includes("FINAL_PAYMENT") || 
             p.transactionRef?.includes("REFUND") ||
             p.transactionRef?.includes("NO_ADDITIONAL_PAYMENT")) &&
            p.status === "Pending"
          )
          setFinalPayment(final)
        }
      } catch (paymentError) {
        // Non-critical error
      }

      try {
        const penaltyResponse = await penaltyService.getPenaltiesByRentalId(rentalId, { page: 1, pageSize: 10 })

        if (penaltyResponse.success && penaltyResponse.data) {
          const allPenalties = Array.isArray(penaltyResponse.data) 
            ? penaltyResponse.data 
            : (penaltyResponse.data.data || [])
          
          setPenalties(allPenalties)
        }
      } catch (penaltyError) {
        setPenalties([])
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message || "Không thể tải thông tin thanh toán"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const depositPayment = payments.find(p => p.transactionRef?.includes("DEPOSIT") && p.status === "Paid")
  const totalPenalties = penalties.reduce((sum, p) => sum + p.penaltyAmount, 0)
  const depositAmount = depositPayment?.amount || 0
  const estimatedCost = rental?.estimatedCost || 0
  const actualCost = rental?.actualCost || (estimatedCost + totalPenalties)
  const finalAmount = actualCost - depositAmount
  const isRefund = finalAmount < 0

  const handlePayment = async () => {
    if (!finalPayment) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy thông tin thanh toán"
      })
      return
    }

    setIsPaying(true)
    try {
      // Update payment status to Paid
      await paymentService.createPayment({
        rentalId: rentalId,
        amount: Math.abs(finalAmount),
        paymentMethod: paymentMethod,
        transactionRef: isRefund ? `REFUND_COMPLETED_${Date.now()}` : `FINAL_PAID_${Date.now()}`
      })

      // Update rental status to Closed
      await rentalOrderService.updateRentalStatus(rentalId, "Closed")

      toast({
        title: "Thành công!",
        description: isRefund ? "Đã xử lý hoàn tiền" : "Đã thanh toán thành công"
      })

      router.push(`/dashboard/rental/${rentalId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thanh toán"
      })
    } finally {
      setIsPaying(false)
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin đơn thuê</h2>
            <p className="text-gray-500 mb-4">Rental ID: {rentalId}</p>
            <p className="text-sm text-gray-400 mb-4">
              Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ
            </p>
            <Button onClick={() => router.push("/dashboard")}>Quay lại Dashboard</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (rental.status !== "Completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa đến bước thanh toán cuối</h2>
        <p className="text-gray-500 mb-4">Vui lòng trả xe (checkout) trước</p>
        <Button onClick={() => router.push(`/dashboard/rental/${rentalId}`)}>Quay lại</Button>
      </div>
    )
  }

  if (!finalPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã thanh toán xong!</h2>
        <p className="text-gray-500 mb-4">Không có khoản thanh toán nào đang chờ</p>
        <Button onClick={() => router.push(`/dashboard/rental/${rentalId}`)}>Xem chi tiết đơn</Button>
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
            <Link href={`/dashboard/rental/${rentalId}`}>
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
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {isRefund ? "Hoàn tiền" : "Thanh toán cuối cùng"}
              </h1>
              <p className="text-blue-100 text-lg">Mã đơn: {rentalId}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Cost Breakdown */}
          <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              <CardTitle className="text-white">Chi tiết chi phí</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Estimated Cost */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Chi phí thuê xe</p>
                <p className="text-xs text-gray-500">
                  {new Date(rental.startTime).toLocaleDateString("vi-VN")} - {rental.endTime ? new Date(rental.endTime).toLocaleDateString("vi-VN") : "Chưa xác định"}
                </p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {estimatedCost.toLocaleString("vi-VN")} đ
              </p>
            </div>

            {/* Penalties */}
            {penalties.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <p className="font-medium text-red-900">Phí phạt</p>
                  </div>
                  {penalties.map((penalty) => (
                    <div key={penalty.penaltyId} className="flex justify-between items-start ml-6 mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{penalty.reason}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(penalty.issuedDate).toLocaleString("vi-VN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <PlusCircle className="w-3 h-3" />
                        <p className="text-sm font-medium">
                          {penalty.penaltyAmount.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center ml-6 mt-2 pt-2 border-t">
                    <p className="text-sm font-medium text-red-900">Tổng phí phạt</p>
                    <p className="font-bold text-red-600">
                      +{totalPenalties.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Deposit */}
            {depositAmount > 0 && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MinusCircle className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">Tiền đặt cọc</p>
                      <p className="text-xs text-gray-500">Đã thanh toán trước</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    -{depositAmount.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </>
            )}

            <Separator className="my-4" />

            {/* Final Amount */}
            <div className={`
              p-4 rounded-lg
              ${isRefund ? 'bg-green-50' : 'bg-blue-50'}
            `}>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">
                  {isRefund ? "Số tiền được hoàn lại" : "Cần thanh toán"}
                </p>
                <p className={`
                  text-3xl font-bold
                  ${isRefund ? 'text-green-600' : 'text-blue-600'}
                `}>
                  {Math.abs(finalAmount).toLocaleString("vi-VN")} đ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method (only if not refund) */}
        {!isRefund && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>
                Chọn phương thức thanh toán phù hợp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    return (
                      <div
                        key={method.value}
                        className={`
                          flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${paymentMethod === method.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <RadioGroupItem value={method.value} id={method.value} />
                        <div className={`${method.color} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <Label htmlFor={method.value} className="flex-1 cursor-pointer font-medium">
                          {method.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Payment Button */}
        <Card className={`
          border-0 shadow-xl
          ${isRefund 
            ? 'bg-gradient-to-br from-green-500 to-green-600' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600'}
          text-white
        `}>
          <CardContent className="p-6">
            <Button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full bg-white hover:bg-gray-50 font-bold py-6 text-lg"
              style={{ color: isRefund ? '#16a34a' : '#2563eb' }}
              size="lg"
            >
              {isPaying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : isRefund ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Xác nhận hoàn tiền {Math.abs(finalAmount).toLocaleString("vi-VN")} đ
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Thanh toán {finalAmount.toLocaleString("vi-VN")} đ
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
      