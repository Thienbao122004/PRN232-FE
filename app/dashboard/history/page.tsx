"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, MapPin, Calendar, Clock, TrendingUp, Car, Download, Filter, Battery, DollarSign } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  const rentalHistory = [
    {
      id: "RNT-024",
      vehicle: "VinFast VF e34",
      station: "Điểm thuê Quận 1",
      date: "20/01/2025",
      duration: "8 giờ",
      distance: 65,
      cost: 350000,
      status: "completed",
    },
    {
      id: "RNT-023",
      vehicle: "VinFast VF 5",
      station: "Điểm thuê Quận 3",
      date: "15/01/2025",
      duration: "5 giờ",
      distance: 42,
      cost: 280000,
      status: "completed",
    },
    {
      id: "RNT-022",
      vehicle: "VinFast VF 8",
      station: "Điểm thuê Quận 7",
      date: "10/01/2025",
      duration: "12 giờ",
      distance: 95,
      cost: 450000,
      status: "completed",
    },
    {
      id: "RNT-021",
      vehicle: "VinFast VF e34",
      station: "Điểm thuê Quận 1",
      date: "05/01/2025",
      duration: "6 giờ",
      distance: 38,
      cost: 350000,
      status: "completed",
    },
  ]

  const analytics = {
    totalTrips: 24,
    totalDistance: 1250,
    totalCost: 8400000,
    avgTripDistance: 52,
    co2Saved: 180,
    peakHours: "9:00 - 11:00 AM",
    favoriteStation: "Điểm thuê Quận 1",
    favoriteVehicle: "VinFast VF e34",
  }

  const monthlyStats = [
    { month: "T1", trips: 8, distance: 420 },
    { month: "T12", trips: 6, distance: 310 },
    { month: "T11", trips: 5, distance: 260 },
    { month: "T10", trips: 5, distance: 260 },
  ]

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
          <Link href="/dashboard">
            <Button variant="ghost">Quay lại Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Lịch sử & Phân tích</h1>
          <p className="text-muted-foreground text-lg">Xem lại các chuyến đi và thống kê cá nhân</p>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="history">Lịch sử thuê xe</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích cá nhân</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedPeriod === "all" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("all")}
                  className={selectedPeriod !== "all" ? "bg-transparent" : ""}
                >
                  Tất cả
                </Button>
                <Button
                  variant={selectedPeriod === "month" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("month")}
                  className={selectedPeriod !== "month" ? "bg-transparent" : ""}
                >
                  Tháng này
                </Button>
                <Button
                  variant={selectedPeriod === "year" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("year")}
                  className={selectedPeriod !== "year" ? "bg-transparent" : ""}
                >
                  Năm nay
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent">
                  <Filter className="mr-2 w-4 h-4" />
                  Bộ lọc
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Download className="mr-2 w-4 h-4" />
                  Xuất file
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {rentalHistory.map((rental) => (
                <Card key={rental.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{rental.vehicle}</div>
                          <div className="text-sm text-muted-foreground">Mã: {rental.id}</div>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700">Hoàn thành</Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Điểm thuê</div>
                          <div className="text-sm font-medium">{rental.station}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Ngày thuê</div>
                          <div className="text-sm font-medium">{rental.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Thời gian</div>
                          <div className="text-sm font-medium">{rental.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">Quãng đường</div>
                          <div className="text-sm font-medium">{rental.distance} km</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-2xl font-bold text-blue-600">{rental.cost.toLocaleString()}đ</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Xem chi tiết
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="mr-2 w-4 h-4" />
                          Hóa đơn
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">{analytics.totalTrips}</div>
                  <div className="text-sm text-muted-foreground">Tổng chuyến đi</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">{analytics.totalDistance}</div>
                  <div className="text-sm text-muted-foreground">Tổng km đã đi</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">{(analytics.totalCost / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-muted-foreground">Tổng chi phí</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Battery className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">{analytics.co2Saved}</div>
                  <div className="text-sm text-muted-foreground">kg CO₂ tiết kiệm</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Thống kê theo tháng</CardTitle>
                  <CardDescription>Số chuyến đi và quãng đường</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyStats.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{stat.month}</span>
                          <span className="text-muted-foreground">
                            {stat.trips} chuyến • {stat.distance} km
                          </span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                            style={{ width: `${(stat.distance / 500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Thói quen thuê xe</CardTitle>
                  <CardDescription>Phân tích hành vi của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Giờ thuê thường xuyên</div>
                    <div className="font-bold text-blue-600">{analytics.peakHours}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Điểm thuê yêu thích</div>
                    <div className="font-bold text-green-600">{analytics.favoriteStation}</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Xe yêu thích</div>
                    <div className="font-bold text-blue-600">{analytics.favoriteVehicle}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Quãng đường trung bình</div>
                    <div className="font-bold text-green-600">{analytics.avgTripDistance} km/chuyến</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
