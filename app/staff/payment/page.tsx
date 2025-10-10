"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, DollarSign, CreditCard, Wallet, CheckCircle, Receipt, User, Car } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("cash")

  const rentalDetails = {
    id: "RNT-045",
    customer: "Lê Thị C",
    vehicle: "VinFast VF 5",
    plateNumber: "51C-11111",
    startDate: "20/01/2025 10:00",
    endDate: "20/01/2025 18:00",
    duration: "8 giờ",
    distance: 65,
    basePrice: 280000,
    deposit: 500000,
    additionalFees: 0,
    discount: 0,
  }

  const totalAmount = rentalDetails.basePrice + rentalDetails.additionalFees - rentalDetails.discount

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
          <h1 className="text-4xl font-bold mb-2 text-balance">Thanh toán</h1>
          <p className="text-muted-foreground text-lg">Xử lý thanh toán và hoàn cọc</p>
        </div>

        <div className="grid gap-6">
          {/* Rental Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chi tiết chuyến thuê</CardTitle>
                  <CardDescription>Mã: {rentalDetails.id}</CardDescription>
                </div>
                <Badge className="bg-blue-50 text-blue-700">Đang xử lý</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Khách hàng</span>
                  </div>
                  <div className="font-medium">{rentalDetails.customer}</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">Xe</span>
                  </div>
                  <div className="font-medium">
                    {rentalDetails.vehicle} • {rentalDetails.plateNumber}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Thời gian thuê</div>
                  <div className="font-medium">{rentalDetails.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Quãng đường</div>
                  <div className="font-medium">{rentalDetails.distance} km</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Đặt cọc</div>
                  <div className="font-medium text-blue-600">{rentalDetails.deposit.toLocaleString()}đ</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Chi tiết thanh toán</CardTitle>
              <CardDescription>Tổng hợp các khoản phí</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Phí thuê xe</span>
                  <span className="font-medium">{rentalDetails.basePrice.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Phí phát sinh</span>
                  <span className="font-medium">{rentalDetails.additionalFees.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="font-medium text-green-600">-{rentalDetails.discount.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-3xl font-bold text-blue-600">{totalAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Đã đặt cọc</span>
                  <span className="font-medium">-{rentalDetails.deposit.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-900">Hoàn lại khách hàng</span>
                  <span className="text-2xl font-bold text-green-600">
                    {(rentalDetails.deposit - totalAmount).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>Chọn cách thức hoàn tiền</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3 bg-surface">
                  <TabsTrigger value="cash">
                    <Wallet className="w-4 h-4 mr-2" />
                    Tiền mặt
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Thẻ
                  </TabsTrigger>
                  <TabsTrigger value="transfer">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Chuyển khoản
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cash" className="space-y-4 mt-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Wallet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900 mb-1">Thanh toán bằng tiền mặt</div>
                        <div className="text-sm text-blue-800">
                          Hoàn lại {(rentalDetails.deposit - totalAmount).toLocaleString()}đ tiền mặt cho khách hàng
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Số thẻ</Label>
                    <Input placeholder="Nhập 4 số cuối thẻ..." />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-blue-800">
                      Hoàn tiền về thẻ thanh toán của khách hàng trong vòng 3-5 ngày làm việc
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transfer" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Số tài khoản</Label>
                    <Input placeholder="Nhập số tài khoản..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngân hàng</Label>
                    <Input placeholder="Tên ngân hàng..." />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-blue-800">Chuyển khoản hoàn tiền trong vòng 24 giờ</div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label>Ghi chú thanh toán</Label>
                <Input placeholder="Ghi chú thêm (nếu có)..." />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Receipt className="mr-2 w-4 h-4" />
              In hóa đơn
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
              <CheckCircle className="mr-2 w-4 h-4" />
              Xác nhận thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
