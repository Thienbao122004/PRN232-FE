"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Car,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { rentalOrderService, userService } from "@/services"
import type { RentalOrderResponse } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function SearchPage() {
  const { toast } = useToast()
  const [searchType, setSearchType] = useState<"rental" | "customer">("rental")
  const [searchQuery, setSearchQuery] = useState("")
  const [rentals, setRentals] = useState<RentalOrderResponse[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearchRentals = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập thông tin tìm kiếm",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await rentalOrderService.getAllRentals({ 
        page: 1, 
        pageSize: 100
      })

      if (response.success && response.data) {
        const allRentals = response.data.items || []
        
        // Use mock data if empty
        const dataToSearch = allRentals.length > 0 ? allRentals : getMockSearchRentals()
        
        // Filter by search query
        const filtered = dataToSearch.filter((rental: any) => 
          rental.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.renterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.vehicle?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )

        setRentals(filtered)

        if (filtered.length === 0) {
          toast({
            title: "Không tìm thấy",
            description: "Không có đơn thuê nào phù hợp",
          })
        }
      } else {
        // Fallback to mock data
        const mockData = getMockSearchRentals()
        const filtered = mockData.filter((rental: any) => 
          rental.rentalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rental.user?.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setRentals(filtered)
      }
    } catch (error) {
      console.error("Error searching rentals:", error)
      const mockData = getMockSearchRentals()
      setRentals(mockData.filter((r: any) => r.rentalId.includes(searchQuery)))
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm đơn thuê",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockSearchRentals = () => {
    const now = new Date()
    return [
      {
        rentalId: "RO001",
        renterId: "U001",
        vehicleId: "VH001",
        status: "Confirmed",
        estimatedCost: 2500000,
        startTime: now.toISOString(),
        user: { userId: "U001", fullName: "Nguyễn Văn An", phoneNumber: "0901234567" },
        vehicle: { plateNumber: "59A-123.45", typeVehicle: { typeName: "VinFast VF e34" } }
      },
      {
        rentalId: "RO002",
        renterId: "U002",
        vehicleId: "VH002",
        status: "Active",
        estimatedCost: 1800000,
        startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U002", fullName: "Trần Thị Bình", phoneNumber: "0912345678" },
        vehicle: { plateNumber: "59A-678.90", typeVehicle: { typeName: "VinFast VF 8" } }
      },
      {
        rentalId: "RO003",
        renterId: "U003",
        vehicleId: "VH003",
        status: "Completed",
        estimatedCost: 3200000,
        actualCost: 3500000,
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user: { userId: "U003", fullName: "Lê Hoàng Cường", phoneNumber: "0923456789" },
        vehicle: { plateNumber: "59A-111.22", typeVehicle: { typeName: "VinFast VF e34" } }
      }
    ]
  }

  const handleSearchCustomers = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập thông tin tìm kiếm",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      // Use mock customer data
      const mockCustomers = getMockCustomers()
      const filtered = mockCustomers.filter((customer: any) =>
        customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery)
      )
      setCustomers(filtered)
      
      if (filtered.length === 0) {
        toast({
          title: "Không tìm thấy",
          description: "Không có khách hàng nào phù hợp",
        })
      }
      setLoading(false)
      return
      
      // Since we don't have a search customer API, we'll search through rentals and get unique customers
      const response = await rentalOrderService.getAllRentals({ 
        page: 1, 
        pageSize: 100
      })

      if (response.success && response.data) {
        const allRentals = response.data.items || []
        
        // Filter rentals by customer ID
        const customerRentals = allRentals.filter((rental: RentalOrderResponse) => 
          rental.renterId.toLowerCase().includes(searchQuery.toLowerCase())
        )

        // Get unique customer IDs
        const uniqueCustomerIds = [...new Set(customerRentals.map(r => r.renterId))]
        
        // Create customer objects with their rental history
        const customerData = uniqueCustomerIds.map(customerId => {
          const customerRentalHistory = customerRentals.filter(r => r.renterId === customerId)
          return {
            userId: customerId,
            totalRentals: customerRentalHistory.length,
            activeRentals: customerRentalHistory.filter(r => r.status === "Active").length,
            totalSpent: customerRentalHistory.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost), 0),
            recentRentals: customerRentalHistory.slice(0, 5)
          }
        })

        setCustomers(customerData)

        if (customerData.length === 0) {
          toast({
            title: "Không tìm thấy",
            description: "Không có khách hàng nào phù hợp",
          })
        }
      }
    } catch (error) {
      console.error("Error searching customers:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm khách hàng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchType === "rental") {
      handleSearchRentals()
    } else {
      handleSearchCustomers()
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      "Pending": { label: "Chờ xác nhận", className: "bg-yellow-600" },
      "Confirmed": { label: "Đã xác nhận", className: "bg-blue-600" },
      "Active": { label: "Đang thuê", className: "bg-green-600" },
      "Completed": { label: "Hoàn thành", className: "bg-gray-600" },
      "Cancelled": { label: "Đã hủy", className: "bg-red-600" },
      "Closed": { label: "Đã đóng", className: "bg-purple-600" },
    }

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-600" }
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/staff">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Tìm kiếm</h1>
          <p className="text-muted-foreground">Tìm kiếm thông tin khách hàng và đơn thuê</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tìm kiếm</CardTitle>
                <CardDescription>Nhập thông tin để tìm kiếm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Loại tìm kiếm</Label>
                  <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)} className="mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="rental">
                        <FileText className="w-4 h-4 mr-2" />
                        Đơn thuê
                      </TabsTrigger>
                      <TabsTrigger value="customer">
                        <User className="w-4 h-4 mr-2" />
                        Khách hàng
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <Label htmlFor="searchQuery">
                    {searchType === "rental" ? "Mã đơn / Mã xe / Mã khách hàng" : "Mã khách hàng"}
                  </Label>
                  <Input
                    id="searchQuery"
                    placeholder={searchType === "rental" ? "Nhập mã đơn, xe hoặc khách hàng..." : "Nhập mã khách hàng..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <Button onClick={handleSearch} disabled={loading} className="w-full">
                  {loading ? (
                    "Đang tìm..."
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Tìm kiếm
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Gợi ý tìm kiếm nhanh:</div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {searchType === "rental" ? (
                      <>
                        <div>• Tìm theo mã đơn thuê</div>
                        <div>• Tìm theo biển số xe</div>
                        <div>• Tìm theo mã khách hàng</div>
                      </>
                    ) : (
                      <>
                        <div>• Tìm lịch sử thuê xe</div>
                        <div>• Xem tổng chi tiêu</div>
                        <div>• Kiểm tra xe đang thuê</div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kết quả tìm kiếm</CardTitle>
                <CardDescription>
                  {searchType === "rental" 
                    ? `Tìm thấy ${rentals.length} đơn thuê`
                    : `Tìm thấy ${customers.length} khách hàng`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchType === "rental" ? (
                  <div className="space-y-3">
                    {rentals.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Chưa có kết quả</p>
                        <p className="text-sm">Nhập thông tin và nhấn tìm kiếm</p>
                      </div>
                    ) : (
                      rentals.map((rental) => (
                        <div
                          key={rental.rentalId}
                          onClick={() => setSelectedItem(rental)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedItem?.rentalId === rental.rentalId
                              ? "border-blue-500 bg-blue-50"
                              : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="font-medium">{rental.rentalId}</div>
                                <div className="text-sm text-muted-foreground">
                                  Khách hàng: {rental.renterId}
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(rental.status)}
                          </div>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-muted-foreground" />
                              <span>Xe: {rental.vehicleId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(rental.startTime).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>{rental.estimatedCost.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {rental.endTime 
                                  ? new Date(rental.endTime).toLocaleDateString('vi-VN')
                                  : "Chưa xác định"
                                }
                              </span>
                            </div>
                          </div>

                          {selectedItem?.rentalId === rental.rentalId && (
                            <div className="mt-4 pt-4 border-t flex gap-2">
                              {rental.status === "Confirmed" && (
                                <Link href={`/staff/check-in?rentalId=${rental.rentalId}`} className="flex-1">
                                  <Button size="sm" className="w-full bg-blue-600">
                                    Bàn giao xe
                                  </Button>
                                </Link>
                              )}
                              {rental.status === "Active" && (
                                <Link href={`/staff/check-out?rentalId=${rental.rentalId}`} className="flex-1">
                                  <Button size="sm" className="w-full bg-green-600">
                                    Nhận lại xe
                                  </Button>
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customers.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Chưa có kết quả</p>
                        <p className="text-sm">Nhập mã khách hàng và nhấn tìm kiếm</p>
                      </div>
                    ) : (
                      customers.map((customer) => (
                        <div
                          key={customer.userId}
                          onClick={() => setSelectedItem(customer)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedItem?.userId === customer.userId
                              ? "border-blue-500 bg-blue-50"
                              : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="font-medium">{customer.userId}</div>
                                <div className="text-sm text-muted-foreground">
                                  Khách hàng
                                </div>
                              </div>
                            </div>
                            {customer.activeRentals > 0 && (
                              <Badge className="bg-green-600">
                                {customer.activeRentals} xe đang thuê
                              </Badge>
                            )}
                          </div>

                          <div className="grid md:grid-cols-3 gap-3 mb-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {customer.totalRentals}
                              </div>
                              <div className="text-xs text-muted-foreground">Tổng đơn thuê</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {customer.activeRentals}
                              </div>
                              <div className="text-xs text-muted-foreground">Đang thuê</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">
                                {(customer.totalSpent / 1000000).toFixed(1)}M
                              </div>
                              <div className="text-xs text-muted-foreground">Tổng chi tiêu</div>
                            </div>
                          </div>

                          {selectedItem?.userId === customer.userId && customer.recentRentals.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="text-sm font-medium mb-2">Lịch sử gần đây:</div>
                              <div className="space-y-2">
                                {customer.recentRentals.slice(0, 3).map((rental: RentalOrderResponse) => (
                                  <div key={rental.rentalId} className="flex items-center justify-between text-sm p-2 bg-white rounded">
                                    <div>
                                      <div className="font-medium">{rental.rentalId.substring(0, 8)}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(rental.startTime).toLocaleDateString('vi-VN')}
                                      </div>
                                    </div>
                                    {getStatusBadge(rental.status)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
