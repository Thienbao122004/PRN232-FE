"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react"
import Link from "next/link"
import { rentalOrderService } from "@/services/rentalOrderService"
import { paymentService } from "@/services/paymentService"
import { useToast } from "@/hooks/use-toast"

const PAYMENT_METHODS = [
  { value: "VNPAY", label: "VNPAY", icon: CreditCard, color: "bg-blue-600" },
  { value: "Cash", label: "Tiền mặt", icon: Wallet, color: "bg-orange-500" }
]

const DEPOSIT_PERCENTAGE = 0.3 // 30%

export default function PayDepositPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const rentalId = params.id as string

  const [rental, setRental] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("VNPAY")

  useEffect(() => {
    loadData()
  }, [rentalId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const rentalResponse = await rentalOrderService.getRentalOrderById(rentalId)
      if (rentalResponse.success && rentalResponse.data) {
        setRental(rentalResponse.data)
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

  const depositAmount = rental ? Math.round(rental.estimatedCost * DEPOSIT_PERCENTAGE) : 0

  const handlePayment = async () => {
    setIsPaying(true)
    try {
      if (paymentMethod === "VNPAY") {
        const vnpayResponse = await paymentService.createVNPAYPaymentURL({
          rentalId: rentalId,
          amount: depositAmount
        })

        if (vnpayResponse.success && vnpayResponse.data?.paymentUrl) {
          localStorage.setItem('vnpay_rental_id', rentalId)
          localStorage.setItem('vnpay_payment_type', 'DEPOSIT')
          localStorage.setItem('vnpay_payment_amount', depositAmount.toString())
          
          window.location.href = vnpayResponse.data.paymentUrl
          return
        }
      } else {
        await paymentService.createPayment({
          rentalId: rentalId,
          amount: depositAmount,
          paymentMethod: paymentMethod,
          transactionRef: `DEPOSIT_${rentalId}_${Date.now()}`
        })

        // Update rental status to Confirmed
        await rentalOrderService.updateRentalStatus(rentalId, "Confirmed")

        toast({
          title: "Thành công!",
          description: "Đã thanh toán đặt cọc thành công"
        })

        router.push(`/dashboard/rental/${rentalId}`)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thanh toán"
      })
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-500 mb-4">Không tìm thấy đơn thuê</p>
        <Button onClick={() => router.push(`/dashboard/rental/${rentalId}`)}>Quay lại</Button>
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
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Thanh toán đặt cọc</h1>
              <p className="text-blue-100 text-lg">Mã đơn: {rentalId}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Rental Summary */}
          <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
            <CardTitle className="text-white">Thông tin đơn thuê</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian bắt đầu</span>
              <span className="font-medium">{new Date(rental.startTime).toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian kết thúc</span>
              <span className="font-medium">{rental.endTime ? new Date(rental.endTime).toLocaleString("vi-VN") : "Chưa xác định"}</span>
            </div>
            <div className="h-px bg-gray-200 my-4" />
            <div className="flex justify-between text-lg">
              <span className="font-medium text-gray-900">Tổng chi phí dự kiến</span>
              <span className="font-bold text-blue-600">
                {rental.estimatedCost.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Amount */}
        <Card className="border-0 shadow-xl border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Số tiền đặt cọc</CardTitle>
            <CardDescription>
              30% tổng giá trị đơn hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Cần thanh toán</p>
              <p className="text-4xl font-bold text-blue-600">
                {depositAmount.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Số tiền này sẽ được trừ vào tổng thanh toán cuối
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
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

        {/* Payment Button */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-sm text-white/90 mb-2">Lưu ý</p>
                <ul className="text-sm space-y-1 text-white/80">
                  <li>• Tiền cọc sẽ được hoàn trả sau khi trả xe</li>
                  <li>• Không hoàn cọc nếu hủy đơn</li>
                  <li>• Cần thanh toán đủ cọc trước khi nhận xe</li>
                </ul>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-6 text-lg"
                size="lg"
              >
                {isPaying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Thanh toán {depositAmount.toLocaleString("vi-VN")} đ
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

