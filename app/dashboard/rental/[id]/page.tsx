"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Zap, 
  ArrowLeft, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Loader2,
  XCircle,
  CheckCircle,
  Star
} from "lucide-react"
import Link from "next/link"
import { rentalOrderService, type RentalOrderResponse } from "@/services/rentalOrderService"
import { paymentService } from "@/services/paymentService"
import { feedbackService } from "@/services/feedbackService"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function RentalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const rentalId = params.id as string

  const [rental, setRental] = useState<RentalOrderResponse | null>(null)
  const [payment, setPayment] = useState<any>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    loadRentalDetails()
  }, [rentalId])

  const loadRentalDetails = async () => {
    setIsLoading(true)
    try {
      // Load rental
      const rentalResponse = await rentalOrderService.getRentalOrderById(rentalId)
      if (rentalResponse.success && rentalResponse.data) {
        setRental(rentalResponse.data)
      }

      // Load payment
      try {
        const paymentResponse = await paymentService.getPaymentsByRentalId(rentalId, { page: 1, pageSize: 1 })
        if (paymentResponse.success && paymentResponse.data && paymentResponse.data.data.length > 0) {
          setPayment(paymentResponse.data.data[0])
        }
      } catch (error) {
        console.log("No payment found")
      }

      // Load feedback (if completed)
      if (rentalResponse.data?.status === "Completed") {
        try {
          const feedbackResponse = await feedbackService.getFeedbacksByRentalId(rentalId, { page: 1, pageSize: 1 })
          if (feedbackResponse.success && feedbackResponse.data && feedbackResponse.data.data.length > 0) {
            setFeedback(feedbackResponse.data.data[0])
          }
        } catch (error) {
          console.log("No feedback found")
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

  const handleCancel = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn thuê này?")) return

    setIsCancelling(true)
    try {
      await rentalOrderService.cancelRentalOrder(rentalId)
      toast({
        title: "Thành công!",
        description: "Đã hủy đơn thuê",
      })
      loadRentalDetails()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể hủy đơn thuê",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.comment.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập nhận xét",
      })
      return
    }

    if (!rental) return

    const getUserId = () => {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.userId || user.id
      }
      return null
    }

    const userId = getUserId()
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng đăng nhập lại",
      })
      return
    }

    setIsSubmittingFeedback(true)
    try {
      await feedbackService.createFeedback({
        rentalId: rentalId,
        renterId: userId,
        rating: feedbackForm.rating,
        comment: feedbackForm.comment,
      })
      
      toast({
        title: "Cảm ơn đánh giá của bạn!",
        description: "Đánh giá đã được gửi thành công",
      })
      loadRentalDetails()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể gửi đánh giá",
      })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      Pending: { label: "Chờ xử lý", className: "bg-yellow-500 text-white" },
      Active: { label: "Đang thuê", className: "bg-green-500 text-white" },
      Completed: { label: "Hoàn thành", className: "bg-blue-500 text-white" },
      Cancelled: { label: "Đã hủy", className: "bg-red-500 text-white" },
    }
    return statusMap[status] || { label: status, className: "bg-gray-500 text-white" }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!rental) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Không tìm thấy đơn thuê</h2>
            <Link href="/dashboard/history">
              <Button className="mt-4">Quay lại lịch sử</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusBadge(rental.status)

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          <Link href="/dashboard/history">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Chi tiết đơn thuê</h1>
            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
          </div>
          <p className="text-muted-foreground">Mã đơn: {rental.rentalId}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rental Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Thông tin thuê xe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Xe</div>
                      <div className="font-medium">ID: {rental.vehicleId}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Điểm nhận</div>
                      <div className="font-medium">Branch: {rental.branchStartId}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Điểm trả</div>
                      <div className="font-medium">Branch: {rental.branchEndId}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Nhân viên xử lý</div>
                      <div className="font-medium">{rental.staffId || "Chưa có"}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Thời gian nhận</div>
                      <div className="font-medium">{formatDate(rental.startTime)}</div>
                    </div>
                  </div>
                  {rental.endTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Thời gian trả</div>
                        <div className="font-medium">{formatDate(rental.endTime)}</div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Chi phí dự kiến</div>
                      <div className="font-medium text-lg">{formatCurrency(rental.estimatedCost)}</div>
                    </div>
                  </div>
                  {rental.actualCost && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Chi phí thực tế</div>
                        <div className="font-medium text-lg">{formatCurrency(rental.actualCost)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            {payment && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã thanh toán:</span>
                    <span className="font-medium">{payment.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tiền:</span>
                    <span className="font-bold text-lg">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <span className="font-medium">{payment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <Badge className={payment.paymentStatus === "Completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                      {payment.paymentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback Section */}
            {rental.status === "Completed" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Đánh giá</CardTitle>
                  <CardDescription>Chia sẻ trải nghiệm của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {feedback ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-5 h-5 ${star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{feedback.comment}</p>
                      <p className="text-sm text-muted-foreground">
                        Đánh giá lúc: {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Đánh giá sao</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${star <= feedbackForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nhận xét</label>
                        <Textarea 
                          placeholder="Chia sẻ trải nghiệm của bạn..."
                          value={feedbackForm.comment}
                          onChange={(e) => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitFeedback}
                        disabled={isSubmittingFeedback}
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          "Gửi đánh giá"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rental.status === "Pending" && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang hủy...
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Hủy đơn
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  In hóa đơn
                </Button>
                
                <Link href="/dashboard/history">
                  <Button variant="ghost" className="w-full">
                    Xem lịch sử
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Cần hỗ trợ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào
                </p>
                <Button className="w-full">Liên hệ hỗ trợ</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
