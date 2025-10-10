"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Zap,
  Car,
  Battery,
  MapPin,
  CheckCircle,
  Camera,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  Receipt,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ReturnPage() {
  const [returnData, setReturnData] = useState({
    battery: 65,
    mileage: 12520,
    damageNotes: "",
    cleanlinessRating: 5,
  })
  const [photos, setPhotos] = useState<number[]>([])

  const rentalDetails = {
    id: "RNT-001",
    vehicle: "VinFast VF e34",
    plateNumber: "51A-12345",
    station: "Điểm thuê Quận 1",
    startDate: "25/01/2025 9:00 AM",
    endDate: "25/01/2025 6:00 PM",
    startBattery: 95,
    startMileage: 12450,
    basePrice: 350000,
    deposit: 500000,
  }

  const distance = returnData.mileage - rentalDetails.startMileage
  const batteryUsed = rentalDetails.startBattery - returnData.battery
  const additionalFees = 0 // Tính phí phát sinh nếu có
  const totalCost = rentalDetails.basePrice + additionalFees
  const refund = rentalDetails.deposit - totalCost

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Quay lại Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 shadow-sm mb-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Bước cuối: Trả xe</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Trả xe điện
          </h1>
          <p className="text-gray-600 text-lg">Xác nhận tình trạng xe và hoàn tất chuyến thuê</p>
        </motion.div>

        {/* Trip Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Tổng kết chuyến đi</CardTitle>
                  <CardDescription>Mã: {rentalDetails.id}</CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                  Hoàn thành
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Quãng đường</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{distance}</div>
                  <div className="text-xs text-gray-600 mt-1">km</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Pin sử dụng</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{batteryUsed}%</div>
                  <div className="text-xs text-gray-600 mt-1">của tổng dung lượng</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Thời gian thuê</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">9</div>
                  <div className="text-xs text-gray-600 mt-1">giờ</div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5" />
                  <span className="text-sm text-blue-100">Tiết kiệm CO₂</span>
                </div>
                <div className="text-3xl font-bold mb-1">{(distance * 0.12).toFixed(1)} kg</div>
                <div className="text-sm text-blue-100">So với xe xăng cùng quãng đường</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Status Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <CardTitle>So sánh tình trạng xe</CardTitle>
              <CardDescription>Khi nhận và khi trả</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Battery Comparison */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Mức pin</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="text-sm text-gray-600 mb-2">Khi nhận</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{rentalDetails.startBattery}%</div>
                    <Progress value={rentalDetails.startBattery} className="h-2" />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-300">
                    <div className="text-sm text-gray-600 mb-2">Khi trả</div>
                    <div className="text-3xl font-bold text-gray-600 mb-2">{returnData.battery}%</div>
                    <Progress value={returnData.battery} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Mileage Comparison */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Số km</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Khi nhận</div>
                    <div className="text-3xl font-bold text-blue-600">{rentalDetails.startMileage.toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-300">
                    <div className="text-sm text-gray-600 mb-1">Khi trả</div>
                    <div className="text-3xl font-bold text-gray-600">{returnData.mileage.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Return Inspection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <CardTitle>Kiểm tra khi trả xe</CardTitle>
              <CardDescription>Xác nhận tình trạng xe cùng nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mức pin khi trả (%)</Label>
                  <Input
                    type="number"
                    value={returnData.battery}
                    onChange={(e) => setReturnData({ ...returnData, battery: Number.parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Số km khi trả</Label>
                  <Input
                    type="number"
                    value={returnData.mileage}
                    onChange={(e) => setReturnData({ ...returnData, mileage: Number.parseInt(e.target.value) })}
                    className="h-12 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tình trạng xe & Ghi chú hư hỏng (nếu có)</Label>
                <Textarea
                  placeholder="Mô tả tình trạng xe khi trả: sạch sẽ, hư hỏng, vấn đề..."
                  value={returnData.damageNotes}
                  onChange={(e) => setReturnData({ ...returnData, damageNotes: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Chụp ảnh xe khi trả (4 góc + nội thất)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setPhotos([...photos, i])}
                      className={`aspect-video border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${
                        photos.includes(i)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                    >
                      {photos.includes(i) ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">Đã chụp {photos.length}/5 ảnh</p>
              </div>

              {returnData.damageNotes && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-900 mb-1">Đã ghi nhận hư hỏng</div>
                      <div className="text-sm text-yellow-800">
                        Nhân viên sẽ kiểm tra và đánh giá mức độ hư hỏng. Phí bồi thường (nếu có) sẽ được trừ vào tiền
                        cọc.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <CardTitle>Chi tiết thanh toán</CardTitle>
              <CardDescription>Tổng hợp chi phí chuyến đi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Phí thuê xe</span>
                  <span className="font-medium">{rentalDetails.basePrice.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Phí phát sinh</span>
                  <span className="font-medium">{additionalFees.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Đã đặt cọc</span>
                  <span className="font-medium text-blue-600">-{rentalDetails.deposit.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-3xl font-bold text-blue-600">{totalCost.toLocaleString()}đ</span>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      <span className="font-medium text-lg">Hoàn lại cho bạn</span>
                    </div>
                    <span className="text-3xl font-bold">{refund.toLocaleString()}đ</span>
                  </div>
                  <div className="text-sm text-blue-100 mt-2">Sẽ được hoàn trong 24 giờ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-4"
        >
          <Button variant="outline" className="flex-1 h-14 text-base bg-white hover:bg-gray-50">
            <Receipt className="mr-2 w-5 h-5" />
            Xem hóa đơn
          </Button>
          <Button className="flex-1 h-14 text-base bg-gradient-to-r from-green-600 via-green-500 to-blue-500 hover:from-green-700 hover:via-green-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
            <CheckCircle className="mr-2 w-5 h-5" />
            Xác nhận trả xe
          </Button>
        </motion.div>

        {photos.length < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                Vui lòng chụp đủ 5 ảnh xe (4 góc + nội thất) cùng nhân viên để hoàn tất trả xe
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

