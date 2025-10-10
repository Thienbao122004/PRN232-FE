"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Search, User, AlertTriangle, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const customers = [
    {
      id: "CUS-001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      totalRentals: 24,
      totalSpent: 8400000,
      status: "active",
      rating: 4.9,
      riskLevel: "low",
    },
    {
      id: "CUS-002",
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0907654321",
      totalRentals: 18,
      totalSpent: 6300000,
      status: "active",
      rating: 4.8,
      riskLevel: "low",
    },
    {
      id: "CUS-003",
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0903456789",
      totalRentals: 5,
      totalSpent: 1750000,
      status: "active",
      rating: 3.2,
      riskLevel: "high",
      issues: "2 lần trả xe muộn, 1 lần hư hỏng xe",
    },
  ]

  const complaints = [
    {
      id: "CP-001",
      customer: "Phạm Văn D",
      issue: "Xe giao không đúng pin như mô tả",
      date: "22/01/2025",
      status: "pending",
      priority: "high",
    },
    {
      id: "CP-002",
      customer: "Hoàng Thị E",
      issue: "Nhân viên thái độ không tốt",
      date: "21/01/2025",
      status: "resolved",
      priority: "medium",
    },
  ]

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-50 text-green-700">Tin cậy</Badge>
      case "medium":
        return <Badge className="bg-yellow-50 text-yellow-700">Cảnh báo</Badge>
      case "high":
        return <Badge className="bg-red-50 text-red-700">Rủi ro cao</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
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
          <h1 className="text-4xl font-bold mb-2 text-balance">Quản lý khách hàng</h1>
          <p className="text-muted-foreground text-lg">Hồ sơ, lịch sử và xử lý khiếu nại</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-border">
            <TabsTrigger value="all">Tất cả ({customers.length})</TabsTrigger>
            <TabsTrigger value="risk">Rủi ro cao (1)</TabsTrigger>
            <TabsTrigger value="complaints">Khiếu nại ({complaints.length})</TabsTrigger>
          </TabsList>

          {/* All Customers Tab */}
          <TabsContent value="all" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Danh sách khách hàng</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm khách hàng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {customers.map((customer) => (
                  <Card key={customer.id} className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">Mã: {customer.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRiskBadge(customer.riskLevel)}
                          <Badge className="bg-blue-50 text-blue-700">
                            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {customer.rating}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div className="font-medium">{customer.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Số điện thoại</div>
                          <div className="font-medium">{customer.phone}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Tổng chuyến</div>
                          <div className="font-medium">{customer.totalRentals}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
                          <div className="font-medium text-green-600">
                            {(customer.totalSpent / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>

                      {customer.issues && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-800">{customer.issues}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Xem chi tiết
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Lịch sử thuê
                        </Button>
                        {customer.riskLevel === "high" && (
                          <Button variant="outline" size="sm" className="bg-transparent text-red-600 border-red-600">
                            Xử lý cảnh báo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Customers Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Khách hàng có rủi ro</CardTitle>
                <CardDescription>Danh sách khách hàng thường vi phạm hoặc gây hư hỏng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customers
                  .filter((c) => c.riskLevel === "high")
                  .map((customer) => (
                    <Card key={customer.id} className="border-2 border-red-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <div className="font-bold text-lg">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">Mã: {customer.id}</div>
                            </div>
                          </div>
                          <Badge className="bg-red-50 text-red-700">Rủi ro cao</Badge>
                        </div>

                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                          <div className="font-medium text-red-900 mb-2">Vấn đề ghi nhận:</div>
                          <div className="text-sm text-red-800">{customer.issues}</div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Tổng chuyến</div>
                            <div className="font-medium">{customer.totalRentals}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Đánh giá</div>
                            <div className="font-medium text-red-600">{customer.rating}/5</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
                            <div className="font-medium">{(customer.totalSpent / 1000000).toFixed(1)}M</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Tạm khóa tài khoản
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Gửi cảnh báo
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Khiếu nại từ khách hàng</CardTitle>
                <CardDescription>Xử lý và theo dõi khiếu nại</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaints.map((complaint) => (
                  <Card
                    key={complaint.id}
                    className={`border shadow-sm ${complaint.status === "pending" ? "border-l-4 border-l-yellow-500" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-bold text-lg mb-1">{complaint.customer}</div>
                          <div className="text-sm text-muted-foreground">Mã: {complaint.id}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              complaint.priority === "high" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                            }
                          >
                            {complaint.priority === "high" ? "Ưu tiên cao" : "Ưu tiên TB"}
                          </Badge>
                          <Badge
                            className={
                              complaint.status === "pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-green-50 text-green-700"
                            }
                          >
                            {complaint.status === "pending" ? "Đang xử lý" : "Đã giải quyết"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-surface rounded-xl mb-4">
                        <div className="text-sm text-muted-foreground mb-1">Nội dung khiếu nại:</div>
                        <div className="font-medium">{complaint.issue}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Ngày: {complaint.date}</div>
                        <div className="flex gap-2">
                          {complaint.status === "pending" ? (
                            <>
                              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                <CheckCircle className="mr-2 w-4 h-4" />
                                Giải quyết
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                Chi tiết
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Xem giải pháp
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
