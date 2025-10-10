"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, User, Upload, CheckCircle, Camera, FileText, CreditCard } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  const userProfile = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    memberSince: "01/2024",
    verificationStatus: "verified",
  }

  const documents = [
    {
      type: "Giấy phép lái xe",
      status: "verified",
      uploadDate: "15/01/2024",
      expiryDate: "15/01/2030",
      icon: CreditCard,
    },
    {
      type: "CMND/CCCD",
      status: "verified",
      uploadDate: "15/01/2024",
      expiryDate: "15/01/2035",
      icon: FileText,
    },
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
          <h1 className="text-4xl font-bold mb-2 text-balance">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground text-lg">Quản lý thông tin và giấy tờ của bạn</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-background">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
                <p className="text-muted-foreground mb-4">{userProfile.email}</p>

                <Badge className="bg-green-50 text-green-700 mb-4">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đã xác thực
                </Badge>

                <div className="text-sm text-muted-foreground">Thành viên từ {userProfile.memberSince}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin của bạn</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="bg-transparent">
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" defaultValue={userProfile.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" defaultValue={userProfile.phone} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userProfile.email} disabled={!isEditing} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" defaultValue={userProfile.address} disabled={!isEditing} />
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                      Lưu thay đổi
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Giấy tờ xác thực</CardTitle>
                <CardDescription>Quản lý giấy phép lái xe và giấy tờ tùy thân</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="p-4 bg-surface rounded-xl border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                          <doc.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{doc.type}</div>
                          <div className="text-sm text-muted-foreground">Tải lên: {doc.uploadDate}</div>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hết hạn: {doc.expiryDate}</span>
                      <Button variant="ghost" size="sm">
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="mr-2 w-4 h-4" />
                  Tải lên giấy tờ mới
                </Button>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Tài khoản đã được xác thực</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Tài khoản của bạn đã được xác thực đầy đủ. Bạn có thể thuê xe tại bất kỳ điểm thuê nào.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Giấy phép lái xe
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        CMND/CCCD
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Email
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Số điện thoại
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
