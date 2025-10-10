"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle, XCircle, Search, FileText, CreditCard } from "lucide-react"
import Link from "next/link"

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const customerData = {
    id: "CUS-001",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    memberSince: "01/2024",
    totalRentals: 24,
    verificationStatus: "verified",
    documents: {
      driverLicense: {
        number: "012345678",
        issueDate: "15/01/2020",
        expiryDate: "15/01/2030",
        status: "verified",
      },
      idCard: {
        number: "079123456789",
        issueDate: "10/05/2019",
        expiryDate: "10/05/2035",
        status: "verified",
      },
    },
  }

  const handleSearch = () => {
    // Simulate search
    setSelectedCustomer(customerData)
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Xác thực khách hàng</h1>
          <p className="text-muted-foreground text-lg">Kiểm tra giấy tờ và thông tin khách hàng</p>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Tìm kiếm khách hàng</CardTitle>
            <CardDescription>Nhập số điện thoại hoặc mã khách hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập số điện thoại hoặc mã KH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                <Search className="mr-2 w-4 h-4" />
                Tìm kiếm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                    <CardDescription>Mã KH: {selectedCustomer.id}</CardDescription>
                  </div>
                  <Badge className="bg-green-50 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Họ và tên</Label>
                    <div className="font-medium">{selectedCustomer.name}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Số điện thoại</Label>
                    <div className="font-medium">{selectedCustomer.phone}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="font-medium">{selectedCustomer.email}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Thành viên từ</Label>
                    <div className="font-medium">{selectedCustomer.memberSince}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Địa chỉ</Label>
                  <div className="font-medium">{selectedCustomer.address}</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tổng số chuyến đã thuê</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedCustomer.totalRentals}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver License */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <CardTitle>Giấy phép lái xe</CardTitle>
                  </div>
                  <Badge className="bg-green-50 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Số giấy phép</Label>
                    <div className="font-medium">{selectedCustomer.documents.driverLicense.number}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Ngày cấp</Label>
                    <div className="font-medium">{selectedCustomer.documents.driverLicense.issueDate}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Ngày hết hạn</Label>
                    <div className="font-medium">{selectedCustomer.documents.driverLicense.expiryDate}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Trạng thái</Label>
                    <Badge className="bg-green-50 text-green-700">Còn hiệu lực</Badge>
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-border rounded-xl">
                  <div className="text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Ảnh giấy phép lái xe</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Xem ảnh gốc
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent text-green-600 border-green-600">
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Xác nhận hợp lệ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ID Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <CardTitle>CMND/CCCD</CardTitle>
                  </div>
                  <Badge className="bg-green-50 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Số CMND/CCCD</Label>
                    <div className="font-medium">{selectedCustomer.documents.idCard.number}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Ngày cấp</Label>
                    <div className="font-medium">{selectedCustomer.documents.idCard.issueDate}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Ngày hết hạn</Label>
                    <div className="font-medium">{selectedCustomer.documents.idCard.expiryDate}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Trạng thái</Label>
                    <Badge className="bg-green-50 text-green-700">Còn hiệu lực</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-dashed border-border rounded-xl">
                    <div className="text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">Mặt trước</div>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-dashed border-border rounded-xl">
                    <div className="text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">Mặt sau</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Xem ảnh gốc
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent text-green-600 border-green-600">
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Xác nhận hợp lệ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verification Actions */}
            <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Khách hàng đã được xác thực đầy đủ</h3>
                    <p className="text-sm text-muted-foreground">
                      Tất cả giấy tờ đã được kiểm tra và xác nhận hợp lệ. Khách hàng có thể thuê xe.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 w-4 h-4" />
                    Từ chối xác thực
                  </Button>
                  <Link href="/staff/handover" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                      <CheckCircle className="mr-2 w-4 h-4" />
                      Xác nhận & Tiếp tục
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
