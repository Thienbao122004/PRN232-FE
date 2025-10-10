"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, Star, TrendingUp, MapPin, Award } from "lucide-react"
import Link from "next/link"

export default function StaffManagementPage() {
  const staff = [
    {
      id: "ST-001",
      name: "Trần Văn B",
      station: "Điểm thuê Quận 1",
      role: "Nhân viên",
      transactions: 156,
      rating: 4.9,
      performance: 95,
      status: "active",
    },
    {
      id: "ST-002",
      name: "Nguyễn Thị C",
      station: "Điểm thuê Quận 3",
      role: "Trưởng điểm",
      transactions: 142,
      rating: 4.8,
      performance: 92,
      status: "active",
    },
    {
      id: "ST-003",
      name: "Lê Văn D",
      station: "Điểm thuê Quận 7",
      role: "Nhân viên",
      transactions: 138,
      rating: 4.9,
      performance: 94,
      status: "active",
    },
    {
      id: "ST-004",
      name: "Phạm Thị E",
      station: "Điểm thuê Quận 2",
      role: "Nhân viên",
      transactions: 98,
      rating: 4.5,
      performance: 78,
      status: "active",
    },
  ]

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
          <h1 className="text-4xl font-bold mb-2 text-balance">Quản lý nhân viên</h1>
          <p className="text-muted-foreground text-lg">Theo dõi hiệu suất và đánh giá nhân viên</p>
        </div>

        <div className="space-y-6">
          {/* Top Performers */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Nhân viên xuất sắc tháng này</CardTitle>
              <CardDescription>Top 3 nhân viên có hiệu suất cao nhất</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {staff.slice(0, 3).map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold">{member.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {member.station}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{member.transactions}</div>
                      <div className="text-xs text-muted-foreground">Giao dịch</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{member.performance}%</div>
                      <div className="text-xs text-muted-foreground">Hiệu suất</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{member.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* All Staff */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Danh sách nhân viên</CardTitle>
              <CardDescription>Tất cả nhân viên trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {staff.map((member) => (
                <Card key={member.id} className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{member.name}</div>
                          <div className="text-sm text-muted-foreground">Mã: {member.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-50 text-blue-700">{member.role}</Badge>
                        <Badge className="bg-green-50 text-green-700">Đang làm việc</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-muted-foreground">Điểm làm việc</span>
                        </div>
                        <div className="font-medium text-sm">{member.station}</div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-muted-foreground">Giao dịch</span>
                        </div>
                        <div className="font-bold text-green-600">{member.transactions}</div>
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs text-muted-foreground">Đánh giá</span>
                        </div>
                        <div className="font-bold text-yellow-600">{member.rating}/5</div>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-muted-foreground">Hiệu suất</span>
                        </div>
                        <div className="font-bold text-purple-600">{member.performance}%</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Xem chi tiết
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Lịch làm việc
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Đánh giá
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
