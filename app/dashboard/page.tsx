"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  Battery,
  TrendingUp,
  Car,
  ChevronRight,
  Bell,
  User,
  History,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"

export default function RenterDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const activeRental = {
    id: "RNT-001",
    vehicle: "VinFast VF e34",
    station: "Điểm thuê Quận 1",
    startTime: "10:00 AM",
    endTime: "6:00 PM",
    battery: 85,
    distance: 45,
    status: "active",
  }

  const upcomingBookings = [
    {
      id: "BK-002",
      vehicle: "VinFast VF 8",
      station: "Điểm thuê Quận 3",
      date: "25/01/2025",
      time: "9:00 AM",
    },
    {
      id: "BK-003",
      vehicle: "VinFast VF 5",
      station: "Điểm thuê Quận 7",
      date: "28/01/2025",
      time: "2:00 PM",
    },
  ]

  const stats = [
    { label: "Tổng chuyến đi", value: "24", icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Quãng đường", value: "1,250 km", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Tiết kiệm CO₂", value: "180 kg", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Điểm thưởng", value: "850", icon: Battery, color: "text-green-600", bg: "bg-green-50" },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden md:block">Nguyễn Văn A</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Link href="/dashboard">
                    <Button
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("overview")}
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Tổng quan
                    </Button>
                  </Link>
                  <Link href="/dashboard/booking">
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Đặt xe
                    </Button>
                  </Link>
                  <Link href="/dashboard/history">
                    <Button variant="ghost" className="w-full justify-start">
                      <History className="w-4 h-4 mr-2" />
                      Lịch sử
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Hồ sơ
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </Button>
                  </Link>
                  <div className="pt-4 border-t">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </Button>
                    </Link>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Xin chào, Nguyễn Văn A!</h1>
              <p className="text-blue-50 mb-6">Sẵn sàng cho hành trình xanh hôm nay?</p>
              <Link href="/dashboard/booking">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Đặt xe ngay
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Active Rental */}
            {activeRental && (
              <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Chuyến đi đang diễn ra</CardTitle>
                      <CardDescription>Mã chuyến: {activeRental.id}</CardDescription>
                    </div>
                    <Badge className="bg-green-500 text-white">Đang thuê</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Xe</div>
                          <div className="font-medium">{activeRental.vehicle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Điểm thuê</div>
                          <div className="font-medium">{activeRental.station}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Thời gian</div>
                          <div className="font-medium">
                            {activeRental.startTime} - {activeRental.endTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Quãng đường</div>
                          <div className="font-medium">{activeRental.distance} km</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pin còn lại</span>
                      <span className="font-medium">{activeRental.battery}%</span>
                    </div>
                    <Progress value={activeRental.battery} className="h-2" />
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                      Xem chi tiết
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Trả xe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Bookings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Đặt chỗ sắp tới</CardTitle>
                  <Link href="/dashboard/history">
                    <Button variant="ghost" size="sm">
                      Xem tất cả
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{booking.vehicle}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {booking.station}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{booking.date}</div>
                      <div className="text-sm text-muted-foreground">{booking.time}</div>
                    </div>
                  </div>
                ))}

                <Link href="/dashboard/booking">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="mr-2 w-4 h-4" />
                    Đặt xe mới
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
