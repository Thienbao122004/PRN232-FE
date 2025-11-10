"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Zap
} from "lucide-react"
import Link from "next/link"
import { rentalOrderService } from "@/services/rentalOrderService"
import { rentalContractService } from "@/services/rentalContractService"
import { useToast } from "@/hooks/use-toast"

export default function SignContractPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const rentalId = params.id as string

  const [rental, setRental] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigning, setIsSigning] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    loadData()
  }, [rentalId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [rentalResponse, contractResponse] = await Promise.all([
        rentalOrderService.getRentalOrderById(rentalId),
        rentalContractService.getContractByRentalId(rentalId)
      ])

      if (rentalResponse.success && rentalResponse.data) {
        setRental(rentalResponse.data)
      }

      if (contractResponse.success && contractResponse.data) {
        setContract(contractResponse.data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin hợp đồng"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSign = async () => {
    if (!agreed) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng đồng ý với các điều khoản"
      })
      return
    }

    setIsSigning(true)
    try {
      await rentalContractService.signContract(contract.contractId, {
        signedByRenter: 1
      })

      toast({
        title: "Thành công!",
        description: "Bạn đã ký hợp đồng thành công"
      })

      router.push(`/dashboard/rental/${rentalId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể ký hợp đồng"
      })
    } finally {
      setIsSigning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!rental || !contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-500 mb-4">Không tìm thấy hợp đồng</p>
        <Button onClick={() => router.push(`/dashboard/rental/${rentalId}`)}>Quay lại</Button>
      </div>
    )
  }

  // Check if already signed
  if (contract.signedByRenter === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Đã ký hợp đồng</h2>
        <p className="text-gray-500 mb-6">Bạn đã ký hợp đồng này rồi</p>
        <Button onClick={() => router.push(`/dashboard/rental/${rentalId}`)}>
          Quay lại chi tiết đơn thuê
        </Button>
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
            <p className="text-sm text-gray-600">Mã đơn: <span className="font-semibold">{rentalId}</span></p>
          </div>
        </div>
      </nav>

      <div className="max-w-[1800px] mx-auto px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/dashboard/rental/${rentalId}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 bg-blue-600 rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Ký hợp đồng điện tử</h1>
              <p className="text-blue-100 text-lg">Xem và ký hợp đồng thuê xe</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
        {/* Contract Content */}
        <Card className="shadow-md">
          <CardHeader className="bg-blue-600 text-white">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <CardTitle className="text-white text-2xl">HỢP ĐỒNG THUÊ XE ĐIỆN</CardTitle>
                <CardDescription className="text-blue-100">
                  Loại: {contract.contractType}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Contract Info */}
            <div className="bg-blue-50 p-6 rounded-lg space-y-3 border border-blue-200">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Mã hợp đồng:</span>
                <span className="font-bold">{contract.contractId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Mã đơn thuê:</span>
                <span className="font-bold">{rentalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Thời gian bắt đầu:</span>
                <span className="font-bold">{new Date(rental.startTime).toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Thời gian kết thúc:</span>
                <span className="font-bold">{rental.endTime ? new Date(rental.endTime).toLocaleString("vi-VN") : "Chưa xác định"}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-blue-200">
                <span className="font-medium text-gray-700">Chi phí dự kiến:</span>
                <span className="font-bold text-blue-600 text-lg">
                  {rental.estimatedCost.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</h3>
              
              <div className="space-y-4 text-gray-700">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                    Trách nhiệm của Bên Thuê
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Sử dụng xe đúng mục đích và tuân thủ luật giao thông</li>
                    <li>Bảo quản xe cẩn thận, không cho người khác thuê lại</li>
                    <li>Thanh toán đầy đủ các khoản phí theo thỏa thuận</li>
                    <li>Chịu trách nhiệm về các vi phạm giao thông trong thời gian thuê</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                    Trách nhiệm của Bên Cho Thuê
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Cung cấp xe trong tình trạng tốt, đầy đủ giấy tờ hợp lệ</li>
                    <li>Hướng dẫn sử dụng xe và các thiết bị kèm theo</li>
                    <li>Hỗ trợ kỹ thuật khi xe gặp sự cố</li>
                    <li>Bảo mật thông tin cá nhân của khách hàng</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                    Tiền đặt cọc
                  </h4>
                  <p>
                    - Khách hàng phải đặt cọc 30% giá trị hợp đồng trước khi nhận xe<br />
                    - Tiền cọc sẽ được hoàn trả sau khi trả xe và kiểm tra không có thiệt hại<br />
                    - Trường hợp hủy đơn, tiền cọc sẽ không được hoàn lại
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                    Phí phạt
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Trả xe trễ: 100.000 đ/giờ</li>
                    <li>Pin dưới 50%: 10.000 đ/% thiếu</li>
                    <li>Xe bị hư hỏng: Chi phí sửa chữa thực tế</li>
                    <li>Mất giấy tờ xe: 5.000.000 đ</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">5</span>
                    Điều khoản khác
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Hợp đồng có hiệu lực khi cả hai bên ký xác nhận</li>
                    <li>Mọi tranh chấp sẽ được giải quyết theo pháp luật Việt Nam</li>
                    <li>Bên thuê cam kết đã đọc và hiểu rõ các điều khoản</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Signature Status */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Chữ ký xác nhận</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 border-2 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500 mb-3 font-medium">Bên cho thuê (Staff)</p>
                  {contract.signedByStaff === 1 ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-10 h-10 text-green-600 mb-2" />
                      <p className="text-sm font-medium text-green-600">Đã ký</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">Chưa ký</p>
                    </div>
                  )}
                </div>
                <div className="text-center p-6 border-2 border-blue-600 rounded-lg bg-blue-50">
                  <p className="text-sm text-gray-700 font-medium mb-3">Bên thuê (Bạn)</p>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-blue-600">Chờ ký</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement and Sign */}
        <Card className="shadow-md bg-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3 mb-6 p-4 bg-blue-700 rounded-lg">
              <Checkbox 
                id="agree" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-1 bg-white border-white"
              />
              <label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
                Tôi đã đọc, hiểu rõ và đồng ý với tất cả các điều khoản và điều kiện trong hợp đồng này.
                Tôi cam kết sử dụng xe theo đúng quy định và chịu trách nhiệm về mọi hành vi của mình
                trong thời gian thuê xe.
              </label>
            </div>
            
            <Button
              onClick={handleSign}
              disabled={!agreed || isSigning}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-6 text-lg disabled:opacity-50"
              size="lg"
            >
              {isSigning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang ký...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Ký hợp đồng điện tử
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

