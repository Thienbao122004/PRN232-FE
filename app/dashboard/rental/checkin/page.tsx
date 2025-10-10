"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Zap,
  Car,
  Battery,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Camera,
  AlertTriangle,
  FileText,
  User,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CheckInPage() {
  const [inspectionChecklist, setInspectionChecklist] = useState({
    exterior: false,
    interior: false,
    battery: false,
    documents: false,
    photos: false,
  })
  const [notes, setNotes] = useState("")
  const [agreed, setAgreed] = useState(false)

  const rentalDetails = {
    id: "RNT-001",
    vehicle: "VinFast VF e34",
    plateNumber: "51A-12345",
    station: "Điểm thuê Quận 1",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    startDate: "25/01/2025",
    startTime: "9:00 AM",
    endTime: "6:00 PM",
    battery: 95,
    mileage: 12450,
    price: 350000,
  }

  const staffInfo = {
    name: "Trần Văn B",
    phone: "0901234567",
  }

  const allChecked = Object.values(inspectionChecklist).every((v) => v) && agreed

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 shadow-sm mb-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Bước 1: Check-in nhận xe</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Nhận xe điện
          </h1>
          <p className="text-gray-600 text-lg">Xác nhận tình trạng xe trước khi khởi hành</p>
        </motion.div>

        {/* Rental Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Thông tin chuyến thuê</CardTitle>
                  <CardDescription>Mã: {rentalDetails.id}</CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
                  Đang chờ nhận
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <Car className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Xe</div>
                      <div className="font-bold text-gray-900">{rentalDetails.vehicle}</div>
                      <div className="text-sm text-gray-600">Biển số: {rentalDetails.plateNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Điểm thuê</div>
                      <div className="font-bold text-gray-900">{rentalDetails.station}</div>
                      <div className="text-sm text-gray-600">{rentalDetails.address}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">Thời gian</div>
                      <div className="font-bold text-gray-900">{rentalDetails.startDate}</div>
                      <div className="text-sm text-gray-600">
                        {rentalDetails.startTime} - {rentalDetails.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl text-white">
                    <div className="text-sm text-blue-100 mb-1">Chi phí</div>
                    <div className="text-3xl font-bold">{rentalDetails.price.toLocaleString()}đ</div>
                  </div>
                </div>
              </div>

              {/* Vehicle Status */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Mức pin hiện tại</span>
                    <Battery className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{rentalDetails.battery}%</div>
                  <Progress value={rentalDetails.battery} className="h-2" />
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Số km hiện tại</span>
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{rentalDetails.mileage.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">km</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Staff Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Nhân viên hỗ trợ</div>
                  <div className="text-sm text-gray-600">{staffInfo.name}</div>
                </div>
                <a href={`tel:${staffInfo.phone}`}>
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                    <Phone className="mr-2 w-4 h-4" />
                    Liên hệ
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inspection Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <CardTitle>Kiểm tra xe</CardTitle>
              <CardDescription>Vui lòng xác nhận các mục sau trước khi nhận xe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id="exterior"
                    checked={inspectionChecklist.exterior}
                    onCheckedChange={(checked) =>
                      setInspectionChecklist({ ...inspectionChecklist, exterior: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="exterior" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Ngoại thất xe</div>
                    <div className="text-sm text-gray-600">
                      Kiểm tra các vết xước, móp méo, đèn, gương, bánh xe
                    </div>
                  </label>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id="interior"
                    checked={inspectionChecklist.interior}
                    onCheckedChange={(checked) =>
                      setInspectionChecklist({ ...inspectionChecklist, interior: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="interior" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Nội thất xe</div>
                    <div className="text-sm text-gray-600">
                      Kiểm tra ghế ngồi, vô lăng, màn hình, điều hòa, các tính năng
                    </div>
                  </label>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id="battery"
                    checked={inspectionChecklist.battery}
                    onCheckedChange={(checked) =>
                      setInspectionChecklist({ ...inspectionChecklist, battery: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="battery" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Mức pin và số km</div>
                    <div className="text-sm text-gray-600">
                      Xác nhận pin {rentalDetails.battery}% và {rentalDetails.mileage.toLocaleString()} km
                    </div>
                  </label>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id="documents"
                    checked={inspectionChecklist.documents}
                    onCheckedChange={(checked) =>
                      setInspectionChecklist({ ...inspectionChecklist, documents: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="documents" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Giấy tờ xe</div>
                    <div className="text-sm text-gray-600">Kiểm tra đăng ký xe, bảo hiểm trong cốp</div>
                  </label>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <Checkbox
                    id="photos"
                    checked={inspectionChecklist.photos}
                    onCheckedChange={(checked) =>
                      setInspectionChecklist({ ...inspectionChecklist, photos: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="photos" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">Chụp ảnh xe</div>
                    <div className="text-sm text-gray-600">Đã chụp 4 góc xe + nội thất cùng nhân viên</div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ghi chú thêm (nếu có)</label>
                <Textarea
                  placeholder="Ghi chú các vấn đề hoặc hư hỏng đã được ghi nhận..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} className="mt-1" />
                <label htmlFor="agree" className="flex-1 cursor-pointer">
                  <div className="font-medium text-gray-900 mb-2">Điều khoản & Hợp đồng thuê xe</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      ✓ Tôi xác nhận đã kiểm tra kỹ xe và đồng ý với tình trạng xe hiện tại
                    </p>
                    <p>
                      ✓ Tôi cam kết trả xe đúng thời gian và địa điểm đã thỏa thuận
                    </p>
                    <p>
                      ✓ Tôi chịu trách nhiệm với các hư hỏng xảy ra trong thời gian thuê
                    </p>
                    <p className="pt-2">
                      <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Xem đầy đủ điều khoản
                      </Link>
                    </p>
                  </div>
                </label>
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
          <Link href="/dashboard/booking" className="flex-1">
            <Button variant="outline" className="w-full h-14 text-base bg-white hover:bg-gray-50">
              Hủy
            </Button>
          </Link>
          <Button
            disabled={!allChecked}
            className="flex-1 h-14 text-base bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:from-blue-700 hover:via-blue-600 hover:to-green-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
          >
            <CheckCircle className="mr-2 w-5 h-5" />
            Xác nhận nhận xe
          </Button>
        </motion.div>

        {!allChecked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                Vui lòng hoàn thành tất cả các bước kiểm tra và đồng ý với điều khoản để tiếp tục
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

