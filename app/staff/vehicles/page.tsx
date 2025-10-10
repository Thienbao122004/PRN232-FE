"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Car, Battery, AlertTriangle, CheckCircle, Gauge, Wrench, Search } from "lucide-react"
import Link from "next/link"

export default function VehiclesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)

  const vehicles = [
    {
      id: "VH-001",
      name: "VinFast VF e34",
      plateNumber: "51A-12345",
      battery: 95,
      mileage: 12450,
      status: "available",
      lastMaintenance: "15/01/2025",
      nextMaintenance: "15/02/2025",
    },
    {
      id: "VH-002",
      name: "VinFast VF 8",
      plateNumber: "51B-67890",
      battery: 45,
      mileage: 8920,
      status: "charging",
      lastMaintenance: "10/01/2025",
      nextMaintenance: "10/02/2025",
    },
    {
      id: "VH-003",
      name: "VinFast VF 5",
      plateNumber: "51C-11111",
      battery: 0,
      mileage: 15680,
      status: "rented",
      lastMaintenance: "05/01/2025",
      nextMaintenance: "05/02/2025",
    },
    {
      id: "VH-004",
      name: "VinFast VF e34",
      plateNumber: "51D-22222",
      battery: 30,
      mileage: 18200,
      status: "maintenance",
      lastMaintenance: "20/12/2024",
      nextMaintenance: "20/01/2025",
      issue: "Cần thay lốp trước",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-50 text-green-700">Sẵn sàng</Badge>
      case "rented":
        return <Badge className="bg-blue-50 text-blue-700">Đang thuê</Badge>
      case "charging":
        return <Badge className="bg-yellow-50 text-yellow-700">Đang sạc</Badge>
      case "maintenance":
        return <Badge className="bg-red-50 text-red-700">Bảo trì</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

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
          <h1 className="text-4xl font-bold mb-2 text-balance">Quản lý xe</h1>
          <p className="text-muted-foreground text-lg">Cập nhật trạng thái và bảo trì xe tại điểm</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vehicle List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Danh sách xe</CardTitle>
                <CardDescription>Tất cả xe tại điểm thuê</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm xe..." className="pl-10" />
                </div>

                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVehicle?.id === vehicle.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent bg-surface hover:bg-surface-hover"
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium">{vehicle.name}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.plateNumber}</div>
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Battery className="w-3 h-3" />
                        {vehicle.battery}%
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        {vehicle.mileage.toLocaleString()} km
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Details */}
          <div className="lg:col-span-2">
            {selectedVehicle ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedVehicle.name}</CardTitle>
                        <CardDescription>Biển số: {selectedVehicle.plateNumber}</CardDescription>
                      </div>
                      {getStatusBadge(selectedVehicle.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-surface rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Mức pin</span>
                          <Battery
                            className={`w-4 h-4 ${selectedVehicle.battery > 50 ? "text-green-600" : "text-yellow-600"}`}
                          />
                        </div>
                        <div className="text-2xl font-bold mb-2">{selectedVehicle.battery}%</div>
                        <Progress value={selectedVehicle.battery} className="h-2" />
                      </div>

                      <div className="p-4 bg-surface rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Số km đã đi</span>
                          <Gauge className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold">{selectedVehicle.mileage.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">km</div>
                      </div>
                    </div>

                    {selectedVehicle.issue && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-900 mb-1">Vấn đề cần xử lý</div>
                            <div className="text-sm text-red-800">{selectedVehicle.issue}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Update Status */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Cập nhật trạng thái</CardTitle>
                    <CardDescription>Thay đổi tình trạng xe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Trạng thái xe</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant={selectedVehicle.status === "available" ? "default" : "outline"}
                          className={selectedVehicle.status !== "available" ? "bg-transparent" : ""}
                        >
                          <CheckCircle className="mr-2 w-4 h-4" />
                          Sẵn sàng
                        </Button>
                        <Button
                          variant={selectedVehicle.status === "charging" ? "default" : "outline"}
                          className={selectedVehicle.status !== "charging" ? "bg-transparent" : ""}
                        >
                          <Battery className="mr-2 w-4 h-4" />
                          Đang sạc
                        </Button>
                        <Button
                          variant={selectedVehicle.status === "maintenance" ? "default" : "outline"}
                          className={selectedVehicle.status !== "maintenance" ? "bg-transparent" : ""}
                        >
                          <Wrench className="mr-2 w-4 h-4" />
                          Bảo trì
                        </Button>
                        <Button
                          variant={selectedVehicle.status === "rented" ? "default" : "outline"}
                          className={selectedVehicle.status !== "rented" ? "bg-transparent" : ""}
                        >
                          <Car className="mr-2 w-4 h-4" />
                          Đang thuê
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Mức pin hiện tại (%)</Label>
                        <Input type="number" defaultValue={selectedVehicle.battery} />
                      </div>
                      <div className="space-y-2">
                        <Label>Số km hiện tại</Label>
                        <Input type="number" defaultValue={selectedVehicle.mileage} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ghi chú tình trạng</Label>
                      <Textarea placeholder="Mô tả tình trạng xe, vấn đề kỹ thuật (nếu có)..." rows={4} />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                      <CheckCircle className="mr-2 w-4 h-4" />
                      Cập nhật trạng thái
                    </Button>
                  </CardContent>
                </Card>

                {/* Maintenance Info */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Thông tin bảo trì</CardTitle>
                    <CardDescription>Lịch sử và kế hoạch bảo trì</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Bảo trì lần cuối</div>
                        <div className="font-bold text-blue-600">{selectedVehicle.lastMaintenance}</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Bảo trì tiếp theo</div>
                        <div className="font-bold text-green-600">{selectedVehicle.nextMaintenance}</div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      <AlertTriangle className="mr-2 w-4 h-4" />
                      Báo cáo sự cố
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-bold mb-2">Chọn xe để xem chi tiết</h3>
                  <p className="text-muted-foreground">Chọn một xe từ danh sách bên trái để cập nhật trạng thái</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
