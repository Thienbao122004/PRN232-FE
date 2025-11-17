"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, Home, RefreshCcw, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TransactionFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<any>(null)

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const rentalId = localStorage.getItem('vnpay_rental_id')
    const paymentType = localStorage.getItem('vnpay_payment_type')
    const amount = localStorage.getItem('vnpay_payment_amount')
    const responseCode = searchParams.get('responseCode')
    const message = searchParams.get('message')

    setPaymentInfo({
      rentalId,
      paymentType,
      amount,
      responseCode,
      message
    })

    // Clear localStorage sau 5 phút
    setTimeout(() => {
      localStorage.removeItem('vnpay_rental_id')
      localStorage.removeItem('vnpay_payment_type')
      localStorage.removeItem('vnpay_payment_amount')
    }, 300000) // 5 minutes
  }, [])

  const getErrorMessage = (code?: string) => {
    switch(code) {
      case '07': return 'Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)'
      case '09': return 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking'
      case '10': return 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần'
      case '11': return 'Đã hết hạn chờ thanh toán'
      case '12': return 'Thẻ/Tài khoản bị khóa'
      case '13': return 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)'
      case '24': return 'Khách hàng hủy giao dịch'
      case '51': return 'Tài khoản không đủ số dư'
      case '65': return 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày'
      case '75': return 'Ngân hàng thanh toán đang bảo trì'
      case '79': return 'KH nhập sai mật khẩu thanh toán quá số lần quy định'
      default: return message || 'Giao dịch không thành công. Vui lòng thử lại sau.'
    }
  }

  const handleRetry = () => {
    if (paymentInfo?.rentalId && paymentInfo?.paymentType === 'DEPOSIT') {
      router.push(`/dashboard/rental/${paymentInfo.rentalId}/pay-deposit`)
    } else if (paymentInfo?.rentalId && paymentInfo?.paymentType === 'FINAL_PAYMENT') {
      router.push(`/dashboard/rental/${paymentInfo.rentalId}/final-payment`)
    } else if (paymentInfo?.rentalId) {
      router.push(`/dashboard/rental/${paymentInfo.rentalId}`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Thanh toán thất bại
          </CardTitle>
          <CardDescription className="text-red-50">
            Giao dịch của bạn không thể hoàn tất
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-1">Lý do</p>
                <p className="text-sm text-red-700">
                  {getErrorMessage(paymentInfo?.responseCode)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {paymentInfo && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {paymentInfo.rentalId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng</span>
                    <span className="font-medium">{paymentInfo.rentalId}</span>
                  </div>
                )}
                
                {paymentInfo.paymentType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại thanh toán</span>
                    <span className="font-medium">
                      {paymentInfo.paymentType === 'DEPOSIT' ? 'Đặt cọc' : 'Thanh toán cuối'}
                    </span>
                  </div>
                )}
                
                {paymentInfo.amount && (
                  <div className="pt-3 border-t flex justify-between">
                    <span className="text-gray-900 font-medium">Số tiền</span>
                    <span className="text-gray-900 font-bold text-lg">
                      {parseFloat(paymentInfo.amount).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}

                {paymentInfo.responseCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mã lỗi</span>
                    <span className="text-gray-700 font-mono">{paymentInfo.responseCode}</span>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-2">Gợi ý:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Kiểm tra lại số dư tài khoản</li>
                  <li>Đảm bảo thẻ/tài khoản đã kích hoạt thanh toán online</li>
                  <li>Thử lại với phương thức thanh toán khác</li>
                  <li>Liên hệ ngân hàng nếu vấn đề tiếp tục</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 gap-2" 
              size="lg"
            >
              <RefreshCcw className="w-4 h-4" />
              Thử lại thanh toán
            </Button>
            
            {paymentInfo?.rentalId && (
              <Link href={`/dashboard/rental/${paymentInfo.rentalId}`} className="block">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại đơn hàng
                </Button>
              </Link>
            )}
            
            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="w-full gap-2" size="lg">
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Cần hỗ trợ? Liên hệ{" "}
              <a href="mailto:support@evstation.com" className="text-blue-600 hover:underline">
                support@evstation.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

