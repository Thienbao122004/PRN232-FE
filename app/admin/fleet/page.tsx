"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Car,
  MapPin,
  Battery,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FleetManagementPage() {
  const [selectedStation, setSelectedStation] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const stations = [
    {
      id: "1",
      name: "Quận 1",
      total: 25,
      available: 12,
      rented: 8,
      charging: 3,
      maintenance: 2,
      demand: 92,
    },
    {
      id: "2",
      name: "Quận 3",
      total: 20,
      available: 8,
      rented: 10,
      charging: 1,
      maintenance: 1,
      demand: 95,
    },
    {
      id: "3",
      name: "Quận 7",
      total: 22,
      available: 15,
      rented: 5,
      charging: 2,
      maintenance: 0,
      demand: 68,
    },
    {
      id: "4",
      name: "Quận 2",
      total: 18,
      available: 6,
      rented: 9,
      charging: 2,
      maintenance: 1,
      demand: 88,
    },
  ]

  const vehicles = [
    {
      id: "VH-001",
      name: "VinFast VF e34",
      plate: "51A-12345",
      station: "Quận 1",
      battery: 95,
      mileage: 12450,
      status: "available",
    },
    {
      id: "VH-002",
      name: "VinFast VF 8",
      plate: "51B-67890",
      station: "Quận 3",
      battery: 45,
      mileage: 8920,
      status: "charging",
    },
    {
      id: "VH-003",
      name: "VinFast VF 5",
      plate: "51C-11111",
      station: "Quận 7",
      battery: 0,
      mileage: 15680,
      status: "rented",
    },
    {
      id: "VH-004",
      name: "VinFast VF e34",
      plate: "51D-22222",
      station: "Quận 2",
      battery: 30,
      mileage: 18200,
      status: "maintenance",
    },
  ]

  const transferSuggestions = [
    {
      from: "Quận 7",
      to: "Quận 3",
      vehicles: 3,
      reason: "Nhu cầu cao tại Quận 3 (95%)",
      priority: "high",
    },
    {
      from: "Quận 7",
      to: "Quận 2",
      vehicles: 2,
      reason: "Cân bằng đội xe",
      priority: "medium",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Sẵn sàng</Badge>
      case "rented":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Đang thuê</Badge>
      case "charging":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang sạc</Badge>
      case "maintenance":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Bảo trì</Badge>
      default:
        return <Badge>Không rõ</Badge>
    }
  }

  const getDemandBadge = (demand: number) => {
    if (demand >= 90)
      return <Badge className="bg-red-50 text-red-700 border-red-200">Rất cao</Badge>
    if (demand >= 75)
      return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Cao</Badge>
    if (demand >= 50)
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Trung bình</Badge>
    return <Badge className="bg-green-50 text-green-700 border-green-200">Thấp</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          <Link href="/admin">
            <Button variant="ghost">Quay lại Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Quản lý đội xe & Điều phối
          </h1>
          <p className="text-gray-600 text-lg">Giám sát và điều chỉnh phân bổ xe giữa các điểm</p>
        </motion.div>

        {/* Station Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
            <CardHeader>
              <CardTitle>Tổng quan theo điểm thuê</CardTitle>
              <CardDescription>Phân bổ xe và nhu cầu tại từng điểm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stations.map((station, index) => (
                  <motion.div
                    key={station.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="border-2 hover:border-blue-300 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-gray-900">{station.name}</span>
                          </div>
                          {getDemandBadge(station.demand)}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tổng xe</span>
                            <span className="font-bold">{station.total}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Sẵn sàng</span>
                            <span className="font-bold text-green-600">{station.available}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Đang thuê</span>
                            <span className="font-bold text-blue-600">{station.rented}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Nhu cầu</span>
                            <span className="font-bold text-orange-600">{station.demand}%</span>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                station.demand >= 90
                                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                                  : station.demand >= 75
                                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                                    : "bg-gradient-to-r from-blue-500 to-green-500"
                              }`}
                              style={{ width: `${station.demand}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transfer Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                <div>
                  <CardTitle className="text-white">Đề xuất điều phối từ AI</CardTitle>
                  <CardDescription className="text-blue-100">
                    Dựa trên phân tích nhu cầu và tồn kho
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {transferSuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  className="p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-lg font-bold">
                        <MapPin className="w-5 h-5" />
                        {suggestion.from}
                        <ArrowRight className="w-5 h-5" />
                        <MapPin className="w-5 h-5" />
                        {suggestion.to}
                      </div>
                    </div>
                    <Badge
                      className={
                        suggestion.priority === "high"
                          ? "bg-red-500 text-white border-0"
                          : "bg-yellow-500 text-white border-0"
                      }
                    >
                      {suggestion.priority === "high" ? "Ưu tiên cao" : "Ưu tiên TB"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-blue-100 text-sm mb-1">{suggestion.reason}</div>
                      <div className="text-white font-semibold">Đề xuất: {suggestion.vehicles} xe</div>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <CheckCircle className="mr-2 w-4 h-4" />
                      Thực hiện
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Danh sách xe</CardTitle>
                  <CardDescription>Tất cả xe trong hệ thống</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedStation} onValueChange={setSelectedStation}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Điểm thuê" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả điểm</SelectItem>
                      {stations.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="available">Sẵn sàng</SelectItem>
                      <SelectItem value="rented">Đang thuê</SelectItem>
                      <SelectItem value="charging">Đang sạc</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                >
                  <Card className="border hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="font-bold text-gray-900">{vehicle.name}</div>
                            <div className="text-sm text-gray-600">{vehicle.plate}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">{vehicle.station}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <Battery className="w-4 h-4" />
                                <span>Pin</span>
                              </div>
                              <div className="font-bold text-green-600">{vehicle.battery}%</div>
                            </div>

                            <div className="text-center">
                              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <Gauge className="w-4 h-4" />
                                <span>Km</span>
                              </div>
                              <div className="font-bold text-blue-600">{vehicle.mileage.toLocaleString()}</div>
                            </div>
                          </div>

                          {getStatusBadge(vehicle.status)}
                        </div>

                        <Button variant="outline" size="sm" className="ml-4">
                          Điều phối
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

