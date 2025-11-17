"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, Home, Receipt, PartyPopper, Calendar, CreditCard, Hash } from "lucide-react"
import Link from "next/link"
import { paymentService } from "@/services/paymentService"
import { rentalOrderService } from "@/services/rentalOrderService"
import { useToast } from "@/hooks/use-toast"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(true)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)

  useEffect(() => {
    processPayment()
  }, [])

  const processPayment = async () => {
    try {
      // Lấy thông tin từ localStorage
      const rentalId = localStorage.getItem('vnpay_rental_id')
      const paymentType = localStorage.getItem('vnpay_payment_type')
      const amount = localStorage.getItem('vnpay_payment_amount')
      
      // Lấy thông tin từ URL params
      const paymentCode = searchParams.get('paymentCode')
      const vnpayAmount = searchParams.get('amount')

      if (!rentalId) {
        throw new Error("Không tìm thấy thông tin đơn hàng")
      }

      // Tạo payment record
      await paymentService.createPayment({
        rentalId: rentalId,
        amount: parseFloat(amount || vnpayAmount || '0'),
        paymentMethod: "VNPAY",
        transactionRef: `${paymentType}_VNPAY_${paymentCode || Date.now()}`
      })

      // Nếu là DEPOSIT, update rental status sang Confirmed
      if (paymentType === 'DEPOSIT') {
        await rentalOrderService.updateRentalStatus(rentalId, "Confirmed")
      }
      // Nếu là FINAL_PAYMENT, update rental status sang Closed
      else if (paymentType === 'FINAL_PAYMENT') {
        await rentalOrderService.updateRentalStatus(rentalId, "Closed")
      }

      setPaymentInfo({
        rentalId,
        paymentType,
        amount: amount || vnpayAmount,
        paymentCode
      })

      // Clear localStorage
      localStorage.removeItem('vnpay_rental_id')
      localStorage.removeItem('vnpay_payment_type')
      localStorage.removeItem('vnpay_payment_amount')

      toast({
        title: "Thanh toán thành công!",
        description: paymentType === 'DEPOSIT' 
          ? "Đã xác nhận đặt cọc của bạn" 
          : "Đã hoàn tất thanh toán"
      }) 
    } catch (error) {
      console.error("Payment processing error:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xử lý thanh toán"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
              <h2 className="text-xl font-bold">Đang xử lý thanh toán...</h2>
              <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse delay-75"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-purple-200 rounded-full opacity-20 animate-pulse delay-150"></div>
        <div className="absolute bottom-20 right-40 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-2xl border-2 border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="text-center bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white rounded-t-xl pb-8 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <PartyPopper className="absolute top-4 left-4 w-6 h-6 text-yellow-300 animate-bounce" />
                  <PartyPopper className="absolute top-6 right-6 w-5 h-5 text-yellow-200 animate-bounce delay-100" />
                  <PartyPopper className="absolute bottom-4 left-1/4 w-4 h-4 text-yellow-400 animate-bounce delay-200" />
                </div>

                <div className="flex justify-center mb-6 relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-700 delay-200">
                    <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-500 delay-300" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2 animate-in fade-in slide-in-from-top duration-500 delay-100">
                  Thanh toán thành công!
                </CardTitle>
                <CardDescription className="text-green-50 text-base animate-in fade-in duration-500 delay-200">
                  Giao dịch của bạn đã được xử lý thành công
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {paymentInfo && (
                  <>
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Hash className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Mã đơn hàng</div>
                            <div className="font-mono font-semibold text-sm">{paymentInfo.rentalId}</div>
                          </div>
                        </div>
                        
                        {paymentInfo.paymentCode && (
                          <div className="flex items-center gap-3 pb-3 border-b">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Receipt className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-500 mb-1">Mã giao dịch</div>
                              <div className="font-mono font-semibold text-sm">{paymentInfo.paymentCode}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 pb-3 border-b">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Loại thanh toán</div>
                            <div className="font-medium">
                              {paymentInfo.paymentType === 'DEPOSIT' ? '💰 Đặt cọc' : '✅ Thanh toán cuối'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 pt-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">₫</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">Số tiền đã thanh toán</div>
                            <div className="text-green-600 font-bold text-2xl">
                              {parseFloat(paymentInfo.amount).toLocaleString('vi-VN')} đ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 animate-in fade-in duration-500 delay-400">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 mb-2">
                            {paymentInfo.paymentType === 'DEPOSIT' ? '🎉 Đặt cọc thành công!' : '✨ Hoàn tất thuê xe!'}
                          </p>
                          <p className="text-sm text-blue-800">
                            {paymentInfo.paymentType === 'DEPOSIT' 
                              ? 'Đơn hàng của bạn đã được xác nhận. Vui lòng đến nhận xe đúng giờ để bắt đầu hành trình!'
                              : 'Đơn thuê của bạn đã hoàn tất. Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-500 delay-500">
                  {paymentInfo?.rentalId && (
                    <Link href={`/dashboard/rental/${paymentInfo.rentalId}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 gap-2 h-12 shadow-md" size="lg">
                        <Receipt className="w-4 h-4" />
                        {paymentInfo.paymentType === 'DEPOSIT' ? 'Tiếp tục ký HĐ' : 'Xem đơn hàng'}
                      </Button>
                    </Link>
                  )}
                  
                  <Link href="/dashboard" className="block">
                    <Button variant="outline" className="w-full gap-2 h-12 border-2 hover:bg-blue-50 hover:border-blue-300" size="lg">
                      <Home className="w-4 h-4" />
                      Về trang chủ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg animate-in fade-in slide-in-from-right duration-500 delay-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thanh toán</p>
                    <p className="text-xs text-muted-foreground">Đã hoàn tất</p>
                  </div>
                </div>
                
                {paymentInfo?.paymentType === 'DEPOSIT' ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Xác nhận đơn</p>
                        <p className="text-xs text-muted-foreground">Đã xác nhận</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 opacity-50">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Nhận xe</p>
                        <p className="text-xs text-muted-foreground">Chờ thời gian</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Hoàn tất</p>
                      <p className="text-xs text-muted-foreground">Đơn đã đóng</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 animate-in fade-in slide-in-from-right duration-500 delay-400">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-amber-600" />
                  Mẹo hay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Kiểm tra email để nhận thông tin chi tiết</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Đến đúng giờ để tránh phí phạt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Liên hệ hỗ trợ nếu cần giúp đỡ</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

