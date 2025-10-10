"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, TrendingDown, DollarSign, Car, Users, Clock, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const monthlyRevenue = [
    { month: "T7", revenue: 98 },
    { month: "T8", revenue: 105 },
    { month: "T9", revenue: 112 },
    { month: "T10", revenue: 108 },
    { month: "T11", revenue: 118 },
    { month: "T12", revenue: 125 },
  ]

  const peakHours = [
    { hour: "7-9h", percentage: 85, rentals: 156 },
    { hour: "9-11h", percentage: 92, rentals: 168 },
    { hour: "11-13h", percentage: 65, rentals: 119 },
    { hour: "13-15h", percentage: 58, rentals: 106 },
    { hour: "15-17h", percentage: 78, rentals: 142 },
    { hour: "17-19h", percentage: 95, rentals: 174 },
  ]

  const vehicleUtilization = [
    { type: "VinFast VF e34", utilization: 78, avgRental: 4.2 },
    { type: "VinFast VF 8", utilization: 82, avgRental: 5.1 },
    { type: "VinFast VF 5", utilization: 71, avgRental: 3.8 },
  ]

  const aiPredictions = {
    nextWeekDemand: "+18%",
    recommendedFleetSize: 145,
    suggestedPricing: "Tăng 5% vào cuối tuần",
    peakDays: ["Thứ 6", "Thứ 7", "Chủ nhật"],
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Phân tích & Báo cáo</h1>
          <p className="text-muted-foreground text-lg">Thống kê chi tiết và dự báo AI</p>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="utilization">Tỷ lệ sử dụng</TabsTrigger>
            <TabsTrigger value="peak-hours">Giờ cao điểm</TabsTrigger>
            <TabsTrigger value="ai-forecast">Dự báo AI</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">125M</div>
                  <div className="text-sm text-muted-foreground">Doanh thu tháng này</div>
                  <div className="text-xs text-green-600 mt-1">+12.5% so với tháng trước</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Car className="w-8 h-8 text-blue-600" />
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold">1,250</div>
                  <div className="text-sm text-muted-foreground">Chuyến thuê</div>
                  <div className="text-xs text-blue-600 mt-1">+8.3% so với tháng trước</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-green-600" />
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold">100K</div>
                  <div className="text-sm text-muted-foreground">Doanh thu/chuyến TB</div>
                  <div className="text-xs text-green-600 mt-1">+3.8% so với tháng trước</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Xu hướng doanh thu 6 tháng</CardTitle>
                <CardDescription>Doanh thu theo tháng (triệu đồng)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyRevenue.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{data.month}</span>
                        <span className="font-bold text-blue-600">{data.revenue}M</span>
                      </div>
                      <div className="h-3 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                          style={{ width: `${(data.revenue / 125) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilization Tab */}
          <TabsContent value="utilization" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tỷ lệ sử dụng xe theo loại</CardTitle>
                <CardDescription>Hiệu suất sử dụng đội xe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {vehicleUtilization.map((vehicle, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{vehicle.type}</div>
                        <div className="text-sm text-muted-foreground">
                          Trung bình {vehicle.avgRental} chuyến/xe/ngày
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{vehicle.utilization}%</div>
                        <div className="text-xs text-muted-foreground">Tỷ lệ sử dụng</div>
                      </div>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                        style={{ width: `${vehicle.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Hiệu suất tổng thể</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Tỷ lệ sử dụng trung bình</div>
                    <div className="text-3xl font-bold text-green-600">77%</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-muted-foreground mb-1">Thời gian chờ trung bình</div>
                    <div className="text-3xl font-bold text-blue-600">2.3h</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Khuyến nghị</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="font-medium text-blue-900 mb-1">Tăng đội xe VF 8</div>
                    <div className="text-sm text-blue-800">Tỷ lệ sử dụng cao (82%), nên bổ sung thêm 5-8 xe</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="font-medium text-yellow-900 mb-1">Tối ưu VF 5</div>
                    <div className="text-sm text-yellow-800">
                      Tỷ lệ sử dụng thấp (71%), xem xét điều chỉnh giá hoặc marketing
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Peak Hours Tab */}
          <TabsContent value="peak-hours" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Phân tích giờ cao điểm</CardTitle>
                <CardDescription>Nhu cầu thuê xe theo khung giờ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {peakHours.map((hour, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{hour.hour}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">{hour.percentage}%</span>
                        <span className="text-muted-foreground ml-2">({hour.rentals} chuyến)</span>
                      </div>
                    </div>
                    <div className="h-3 bg-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          hour.percentage >= 90
                            ? "bg-gradient-to-r from-red-500 to-orange-500"
                            : hour.percentage >= 75
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-blue-500 to-green-500"
                        }`}
                        style={{ width: `${hour.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Giờ cao điểm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-900">17:00 - 19:00</span>
                    </div>
                    <div className="text-sm text-red-800">Nhu cầu cao nhất (95%)</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-900">9:00 - 11:00</span>
                    </div>
                    <div className="text-sm text-orange-800">Nhu cầu cao (92%)</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Giờ thấp điểm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">13:00 - 15:00</span>
                    </div>
                    <div className="text-sm text-green-800">Nhu cầu thấp nhất (58%)</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="font-medium text-blue-900 mb-1">Khuyến nghị</div>
                    <div className="text-sm text-blue-800">Áp dụng giá ưu đãi giờ thấp điểm để tăng tỷ lệ sử dụng</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Forecast Tab */}
          <TabsContent value="ai-forecast" className="space-y-6">
            <Card className="border-0 shadow-lg border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <div>
                    <CardTitle>Dự báo AI - Tuần tới</CardTitle>
                    <CardDescription>Phân tích dựa trên dữ liệu lịch sử và xu hướng</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-muted-foreground">Dự báo nhu cầu</span>
                    </div>
                    <div className="text-4xl font-bold text-purple-600 mb-1">{aiPredictions.nextWeekDemand}</div>
                    <div className="text-sm text-purple-800">Tăng so với tuần này</div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Đội xe khuyến nghị</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-600 mb-1">{aiPredictions.recommendedFleetSize}</div>
                    <div className="text-sm text-blue-800">xe để đáp ứng nhu cầu</div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Chiến lược giá</span>
                  </div>
                  <div className="text-lg font-medium text-green-800 mb-2">{aiPredictions.suggestedPricing}</div>
                  <div className="text-sm text-green-700">Dự kiến tăng doanh thu 8-12%</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Ngày cao điểm dự kiến</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiPredictions.peakDays.map((day, index) => (
                      <Badge key={index} className="bg-orange-100 text-orange-700">
                        {day}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-orange-700 mt-2">Chuẩn bị thêm xe và nhân viên</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Khuyến nghị hành động</CardTitle>
                <CardDescription>Các bước cần thực hiện dựa trên dự báo AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Tăng cường đội xe</div>
                    <div className="text-sm text-blue-800">
                      Bổ sung 20 xe vào các điểm thuê Quận 1, 3, 7 để đáp ứng nhu cầu tăng cao
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-green-900 mb-1">Điều chỉnh giá linh hoạt</div>
                    <div className="text-sm text-green-800">
                      Áp dụng giá động: tăng 5% cuối tuần, giảm 10% giờ thấp điểm
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-purple-900 mb-1">Tăng cường nhân sự</div>
                    <div className="text-sm text-purple-800">
                      Bố trí thêm 2-3 nhân viên mỗi điểm vào cuối tuần để xử lý nhu cầu cao
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
