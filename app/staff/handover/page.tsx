"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Car, Camera, CheckCircle, AlertTriangle, FileText, User } from "lucide-react"
import Link from "next/link"

export default function HandoverPage() {
  const [selectedTab, setSelectedTab] = useState("pickup")
  const [inspectionData, setInspectionData] = useState({
    exteriorCondition: "",
    interiorCondition: "",
    batteryLevel: 95,
    mileage: 12450,
    notes: "",
  })

  const pickupRequests = [
    {
      id: "PU-001",
      customer: "Nguyễn Văn A",
      phone: "0901234567",
      vehicle: "VinFast VF e34",
      plateNumber: "51A-12345",
      bookingTime: "10:00 AM",
      status: "ready",
    },
    {
      id: "PU-002",
      customer: "Phạm Văn D",
      phone: "0907654321",
      vehicle: "VinFast VF 8",
      plateNumber: "51B-67890",
      bookingTime: "11:00 AM",
      status: "scheduled",
    },
  ]

  const returnRequests = [
    {
      id: "RT-001",
      customer: "Lê Thị C",
      phone: "0903456789",
      vehicle: "VinFast VF 5",
      plateNumber: "51C-11111",
      rentalId: "RNT-045",
      status: "pending",
    },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/staff" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          <Link href="/staff">
            <Button variant="ghost">Quay lại Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Giao nhận xe</h1>
          <p className="text-muted-foreground text-lg">Quản lý quy trình bàn giao và nhận xe</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="pickup">Giao xe ({pickupRequests.length})</TabsTrigger>
            <TabsTrigger value="return">Nhận xe ({returnRequests.length})</TabsTrigger>
          </TabsList>

          {/* Pickup Tab */}
          <TabsContent value="pickup" className="space-y-6">
            <div className="grid gap-6">
              {pickupRequests.map((request) => (
                <Card key={request.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{request.customer}</CardTitle>
                        <CardDescription>Mã đặt xe: {request.id}</CardDescription>
                      </div>
                      <Badge
                        className={
                          request.status === "ready" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                        }
                      >
                        {request.status === "ready" ? "Sẵn sàng" : "Đã đặt"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Customer & Vehicle Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Thông tin khách hàng
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Họ tên:</span>
                            <span className="font-medium">{request.customer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Số điện thoại:</span>
                            <span className="font-medium">{request.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Giờ đặt:</span>
                            <span className="font-medium">{request.bookingTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Thông tin xe
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Xe:</span>
                            <span className="font-medium">{request.vehicle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Biển số:</span>
                            <span className="font-medium">{request.plateNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pin:</span>
                            <span className="font-medium text-green-600">95%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inspection Form */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold">Kiểm tra xe trước khi giao</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Mức pin (%)</Label>
                          <Input
                            type="number"
                            value={inspectionData.batteryLevel}
                            onChange={(e) =>
                              setInspectionData({ ...inspectionData, batteryLevel: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Số km hiện tại</Label>
                          <Input
                            type="number"
                            value={inspectionData.mileage}
                            onChange={(e) =>
                              setInspectionData({ ...inspectionData, mileage: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tình trạng ngoại thất</Label>
                        <Textarea
                          placeholder="Mô tả tình trạng bên ngoài xe..."
                          value={inspectionData.exteriorCondition}
                          onChange={(e) => setInspectionData({ ...inspectionData, exteriorCondition: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tình trạng nội thất</Label>
                        <Textarea
                          placeholder="Mô tả tình trạng bên trong xe..."
                          value={inspectionData.interiorCondition}
                          onChange={(e) => setInspectionData({ ...inspectionData, interiorCondition: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ghi chú thêm</Label>
                        <Textarea
                          placeholder="Các ghi chú khác..."
                          value={inspectionData.notes}
                          onChange={(e) => setInspectionData({ ...inspectionData, notes: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Chụp ảnh xe (4 góc + nội thất)</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button
                              key={i}
                              className="aspect-video border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            >
                              <Camera className="w-6 h-6 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Link href="/staff/verification" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <User className="mr-2 w-4 h-4" />
                          Xác thực khách hàng
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                        <CheckCircle className="mr-2 w-4 h-4" />
                        Hoàn tất giao xe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Return Tab */}
          <TabsContent value="return" className="space-y-6">
            <div className="grid gap-6">
              {returnRequests.map((request) => (
                <Card key={request.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{request.customer}</CardTitle>
                        <CardDescription>Mã thuê xe: {request.rentalId}</CardDescription>
                      </div>
                      <Badge className="bg-yellow-50 text-yellow-700">Đang chờ nhận</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Customer & Vehicle Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Thông tin khách hàng
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Họ tên:</span>
                            <span className="font-medium">{request.customer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Số điện thoại:</span>
                            <span className="font-medium">{request.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Thông tin xe
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Xe:</span>
                            <span className="font-medium">{request.vehicle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Biển số:</span>
                            <span className="font-medium">{request.plateNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Return Inspection */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold">Kiểm tra xe khi nhận lại</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Mức pin khi trả (%)</Label>
                          <Input type="number" placeholder="Nhập mức pin..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Số km khi trả</Label>
                          <Input type="number" placeholder="Nhập số km..." />
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Số km khi giao:</span>
                          <span className="font-bold">12,450 km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Pin khi giao:</span>
                          <span className="font-bold">95%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tình trạng xe khi trả</Label>
                        <Textarea placeholder="Mô tả tình trạng xe khi nhận lại..." rows={4} />
                      </div>

                      <div className="space-y-2">
                        <Label>Hư hỏng/Sự cố (nếu có)</Label>
                        <Textarea placeholder="Ghi chú các hư hỏng hoặc sự cố..." rows={3} />
                      </div>

                      <div className="space-y-2">
                        <Label>Chụp ảnh xe khi trả</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button
                              key={i}
                              className="aspect-video border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            >
                              <Camera className="w-6 h-6 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Damage Assessment */}
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-yellow-900 mb-1">Phát hiện hư hỏng</div>
                            <div className="text-sm text-yellow-800 mb-3">
                              Nếu phát hiện hư hỏng, vui lòng ghi chú chi tiết và tính phí bồi thường (nếu cần)
                            </div>
                            <div className="space-y-2">
                              <Label>Phí bồi thường (nếu có)</Label>
                              <Input type="number" placeholder="Nhập số tiền..." />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Link href="/staff/payment" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <FileText className="mr-2 w-4 h-4" />
                          Xử lý thanh toán
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                        <CheckCircle className="mr-2 w-4 h-4" />
                        Hoàn tất nhận xe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
