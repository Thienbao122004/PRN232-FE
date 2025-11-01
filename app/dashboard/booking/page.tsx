"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, MapPin, Search, Filter, Battery, Users, Gauge, ChevronRight, Star, Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { userService, type UserProfileResponse } from "@/services/userService"
import { API_CONFIG } from "@/lib/api-config"

// Helper để tạo full URL cho image
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_CONFIG.USER_SERVICE_URL}/${cleanPath}`;
}

export default function BookingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await userService.getCurrentProfile()
      if (response.success && response.data) {
        setUserProfile(response.data)
      }
    } catch (error) {
      console.error("Load profile error:", error)
    }
  }

  const getDisplayName = () => {
    return userProfile?.fullName || "Người dùng"
  }

  const getAvatarInitials = () => {
    const name = userProfile?.fullName || "U"
    const words = name.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  const stations = [
    { id: "1", name: "Điểm thuê Quận 1", address: "123 Nguyễn Huệ, Q1", available: 12, distance: "2.5 km" },
    { id: "2", name: "Điểm thuê Quận 3", address: "456 Võ Văn Tần, Q3", available: 8, distance: "3.8 km" },
    { id: "3", name: "Điểm thuê Quận 7", address: "789 Nguyễn Văn Linh, Q7", available: 15, distance: "5.2 km" },
  ]

  const vehicles = [
    {
      id: "1",
      name: "VinFast VF e34",
      type: "SUV Compact",
      battery: 95,
      seats: 5,
      range: 285,
      price: 350000,
      rating: 4.8,
      image: "/vinfast-vf-e34-electric-suv.jpg",
      features: ["Tự động", "Camera 360", "Cảm biến lùi"],
    },
    {
      id: "2",
      name: "VinFast VF 8",
      type: "SUV",
      battery: 100,
      seats: 5,
      range: 420,
      price: 450000,
      rating: 4.9,
      image: "/vinfast-vf-8-electric-suv.jpg",
      features: ["Tự động", "Hệ thống ADAS", "Sạc nhanh"],
    },
    {
      id: "3",
      name: "VinFast VF 5",
      type: "Hatchback",
      battery: 90,
      seats: 5,
      range: 250,
      price: 280000,
      rating: 4.7,
      image: "/vinfast-vf-5-electric-hatchback.jpg",
      features: ["Số tự động", "Màn hình cảm ứng", "Bluetooth"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
              {userProfile?.avatarUrl ? (
                <img 
                  src={getImageUrl(userProfile.avatarUrl)}
                  alt={getDisplayName()}
                  className="w-9 h-9 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">{getAvatarInitials()}</span>
                </div>
              )}
              <span className="text-sm font-medium hidden md:block">{getDisplayName()}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Đặt xe điện
                </h1>
                <p className="text-muted-foreground text-lg">Tìm và đặt xe điện tại điểm thuê gần bạn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tìm kiếm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Vị trí</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm điểm thuê..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ngày thuê</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Giờ thuê</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="time" className="pl-10" />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                  <Search className="mr-2 w-4 h-4" />
                  Tìm kiếm
                </Button>
              </CardContent>
            </Card>

            {/* Stations List */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Điểm thuê gần bạn</CardTitle>
                <CardDescription>Chọn điểm thuê để xem xe có sẵn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStation === station.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent bg-surface hover:bg-surface-hover"
                    }`}
                    onClick={() => setSelectedStation(station.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium">{station.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {station.address}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {station.available} xe
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{station.distance}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Vehicles List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Xe có sẵn</h2>
                <p className="text-muted-foreground">
                  {selectedStation ? "Tại điểm thuê đã chọn" : "Chọn điểm thuê để xem xe"}
                </p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <Filter className="mr-2 w-4 h-4" />
                Bộ lọc
              </Button>
            </div>

            <div className="grid gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-5 gap-6">
                      {/* Vehicle Image */}
                      <div className="md:col-span-2 relative">
                        <img
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          className="w-full h-full object-cover rounded-l-xl"
                        />
                        <Badge className="absolute top-4 right-4 bg-white text-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {vehicle.rating}
                        </Badge>
                      </div>

                      {/* Vehicle Info */}
                      <div className="md:col-span-3 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold">{vehicle.name}</h3>
                              <p className="text-muted-foreground">{vehicle.type}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{vehicle.price.toLocaleString()}đ</div>
                              <div className="text-sm text-muted-foreground">/ ngày</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Battery className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="text-xs text-muted-foreground">Pin</div>
                                <div className="text-sm font-medium">{vehicle.battery}%</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <div>
                                <div className="text-xs text-muted-foreground">Chỗ ngồi</div>
                                <div className="text-sm font-medium">{vehicle.seats} người</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Gauge className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="text-xs text-muted-foreground">Tầm xa</div>
                                <div className="text-sm font-medium">{vehicle.range} km</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {vehicle.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link href={`/dashboard/booking/${vehicle.id}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                              Đặt xe ngay
                              <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" className="bg-transparent">
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
