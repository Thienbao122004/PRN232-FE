"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Zap, 
  Car, 
  Battery, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  ArrowLeft,
  Settings,
  Wrench,
  Power,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authToken, userInfo } from "@/lib/auth"
import { vehicleService } from "@/services"
import type { VehicleResponse } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function VehiclesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleResponse[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  // Update form
  const [updateForm, setUpdateForm] = useState({
    status: "",
    notes: "",
  })

  useEffect(() => {
    const currentUser = userInfo.get()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadVehicles()
  }, [])

  useEffect(() => {
    filterVehicles()
  }, [vehicles, searchQuery, statusFilter])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      const response = await vehicleService.getAllVehicles()

      if (response.success && response.data) {
        const vehicleData = response.data.length > 0 ? response.data : getMockVehicles()
        setVehicles(vehicleData)
        setFilteredVehicles(vehicleData)
      } else {
        const mockData = getMockVehicles()
        setVehicles(mockData)
        setFilteredVehicles(mockData)
      }
    } catch (error) {
      console.error("Error loading vehicles:", error)
      const mockData = getMockVehicles()
      setVehicles(mockData)
      setFilteredVehicles(mockData)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách xe",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockVehicles = (): VehicleResponse[] => {
    return [
      {
        vehicleId: "VH001",
        plateNumber: "59A-123.45",
        chassisNumber: "CHASSIS-001",
        color: "Đỏ",
        batteryCapacity: 85,
        manufactureYear: 2023,
        typeId: "T1",
        status: "Available",
        typeVehicle: { 
          typeId: "T1", 
          typeName: "VinFast VF e34", 
          brand: "VinFast",
          model: "VF e34",
          defaultBattery: 42,
          basePrice: 690000000,
          description: "SUV điện" 
        }
      },
      {
        vehicleId: "VH002",
        plateNumber: "59A-678.90",
        chassisNumber: "CHASSIS-002",
        color: "Xanh",
        batteryCapacity: 60,
        manufactureYear: 2023,
        typeId: "T2",
        status: "Rented",
        typeVehicle: { 
          typeId: "T2", 
          typeName: "VinFast VF 8", 
          brand: "VinFast",
          model: "VF 8",
          defaultBattery: 87.7,
          basePrice: 1200000000,
          description: "SUV cao cấp" 
        }
      },
      {
        vehicleId: "VH003",
        plateNumber: "59A-111.22",
        chassisNumber: "CHASSIS-003",
        color: "Trắng",
        batteryCapacity: 90,
        manufactureYear: 2024,
        typeId: "T1",
        status: "Available",
        typeVehicle: { 
          typeId: "T1", 
          typeName: "VinFast VF e34", 
          brand: "VinFast",
          model: "VF e34",
          defaultBattery: 42,
          basePrice: 690000000,
          description: "SUV điện" 
        }
      },
      {
        vehicleId: "VH004",
        plateNumber: "59A-333.44",
        chassisNumber: "CHASSIS-004",
        color: "Đen",
        batteryCapacity: 45,
        manufactureYear: 2022,
        typeId: "T3",
        status: "Maintenance",
        typeVehicle: { 
          typeId: "T3", 
          typeName: "VinFast VF 5", 
          brand: "VinFast",
          model: "VF 5",
          defaultBattery: 37.23,
          basePrice: 458000000,
          description: "Xe nhỏ gọn" 
        }
      },
      {
        vehicleId: "VH005",
        plateNumber: "59A-555.66",
        chassisNumber: "CHASSIS-005",
        color: "Xám",
        batteryCapacity: 75,
        manufactureYear: 2023,
        typeId: "T2",
        status: "Available",
        typeVehicle: { 
          typeId: "T2", 
          typeName: "VinFast VF 8", 
          brand: "VinFast",
          model: "VF 8",
          defaultBattery: 87.7,
          basePrice: 1200000000,
          description: "SUV cao cấp" 
        }
      },
    ]
  }

  const filterVehicles = () => {
    let filtered = vehicles

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(v => v.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(v => 
        v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.typeVehicle?.typeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredVehicles(filtered)
  }

  const handleUpdateStatus = async () => {
    if (!selectedVehicle || !updateForm.status) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn trạng thái mới",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await vehicleService.updateVehicleStatus(
        selectedVehicle.vehicleId,
        updateForm.status as any
      )

      if (response.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái xe",
        })

        setShowUpdateModal(false)
        setSelectedVehicle(null)
        setUpdateForm({ status: "", notes: "" })
        loadVehicles()
      }
    } catch (error: any) {
      console.error("Error updating vehicle status:", error)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái xe",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: any } } = {
      "Available": { label: "Sẵn sàng", className: "bg-green-600", icon: CheckCircle },
      "Rented": { label: "Đang thuê", className: "bg-blue-600", icon: Car },
      "Maintenance": { label: "Bảo trì", className: "bg-orange-600", icon: Wrench },
      "Unavailable": { label: "Không khả dụng", className: "bg-red-600", icon: AlertTriangle },
    }

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-600", icon: Settings }
    const Icon = statusInfo.icon

    return (
      <Badge className={statusInfo.className}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    )
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
          <h1 className="text-3xl font-bold">Quản lý xe</h1>
          <p className="text-muted-foreground">Cập nhật trạng thái và theo dõi tình trạng xe</p>
        </div>

        {/* Filters and Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tổng số xe</span>
                <Car className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Sẵn sàng</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === "Available").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Đang thuê</span>
                <Car className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {vehicles.filter(v => v.status === "Rented").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Bảo trì</span>
                <Wrench className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {vehicles.filter(v => v.status === "Maintenance").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo biển số, mã xe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="available">Sẵn sàng</SelectItem>
                  <SelectItem value="rented">Đang thuê</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                  <SelectItem value="unavailable">Không khả dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Grid */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Đang tải danh sách xe...
            </CardContent>
          </Card>
        ) : filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Car className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy xe</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Chưa có xe nào trong hệ thống"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <Card 
                key={vehicle.vehicleId} 
                className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedVehicle(vehicle)
                  setShowUpdateModal(true)
                  setUpdateForm({ status: vehicle.status, notes: "" })
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">
                        {vehicle.typeVehicle?.typeName || "Xe điện"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Biển số: {vehicle.plateNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Mã xe: {vehicle.vehicleId}
                      </div>
                    </div>
                    {getStatusBadge(vehicle.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Pin</div>
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-600">
                          {vehicle.batteryCapacity}%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Năm SX</div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-600">
                          {vehicle.manufactureYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Màu: {vehicle.color} | Số khung: {vehicle.chassisNumber}
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedVehicle(vehicle)
                      setShowUpdateModal(true)
                      setUpdateForm({ status: vehicle.status, notes: "" })
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Cập nhật trạng thái
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader>
                <CardTitle>Cập nhật trạng thái xe</CardTitle>
                <CardDescription>
                  {selectedVehicle.typeVehicle?.typeName} - {selectedVehicle.plateNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Info */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium mb-2">Thông tin hiện tại</div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trạng thái: </span>
                      {getStatusBadge(selectedVehicle.status)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pin: </span>
                      <span className="font-medium">{selectedVehicle.batteryCapacity}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Số khung: </span>
                      <span className="font-medium">{selectedVehicle.chassisNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Màu: </span>
                      <span className="font-medium">{selectedVehicle.color}</span>
                    </div>
                  </div>
                </div>

                {/* Update Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">
                      Trạng thái mới <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={updateForm.status} 
                      onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
                    >
                      <SelectTrigger id="status" className="bg-white">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Available">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Sẵn sàng
                          </div>
                        </SelectItem>
                        <SelectItem value="Maintenance">
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-orange-600" />
                            Bảo trì
                          </div>
                        </SelectItem>
                        <SelectItem value="Unavailable">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            Không khả dụng
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lưu ý: Xe đang thuê sẽ tự động chuyển về "Đang thuê"
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ghi chú về trạng thái xe (sự cố, bảo trì...)"
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Quick Status Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUpdateForm({ ...updateForm, status: "Maintenance", notes: "Cần bảo trì định kỳ" })}
                      className="justify-start"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Bảo trì định kỳ
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUpdateForm({ ...updateForm, status: "Maintenance", notes: "Đang sạc pin" })}
                      className="justify-start"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      Đang sạc
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowUpdateModal(false)
                      setSelectedVehicle(null)
                      setUpdateForm({ status: "", notes: "" })
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleUpdateStatus}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cập nhật
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
