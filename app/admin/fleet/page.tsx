'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  fleetService,
  type Vehicle,
  type VehicleCreateRequest,
  type VehicleType,
} from '@/services/fleetService'
import {
  AlertCircle,
  Battery,
  Car,
  CheckCircle,
  Clock,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function FleetManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<VehicleCreateRequest>({
    plateNumber: '',
    chassisNumber: '',
    batteryCapacity: 100,
    typeId: '',
    manufactureYear: new Date().getFullYear(),
    color: '',
    qrCode: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [vehiclesData, typesData] = await Promise.all([
        fleetService.getAllVehicles(),
        fleetService.getAllVehicleTypes(),
      ])
      setVehicles(vehiclesData)
      setVehicleTypes(typesData)
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await fleetService.createVehicle(formData)
      toast.success('Tạo xe thành công!')
      setIsCreateDialogOpen(false)
      resetForm()
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo xe')
    }
  }

  const handleUpdate = async () => {
    if (!selectedVehicle) return

    try {
      await fleetService.updateVehicle(selectedVehicle.vehicleId, formData)
      toast.success('Cập nhật xe thành công!')
      setIsEditDialogOpen(false)
      resetForm()
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật xe')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa xe này?')) return

    try {
      await fleetService.deleteVehicle(id)
      toast.success('Xóa xe thành công!')
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa xe')
    }
  }

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      plateNumber: vehicle.plateNumber,
      chassisNumber: vehicle.chassisNumber || '',
      batteryCapacity: vehicle.batteryCapacity,
      typeId: vehicle.typeId,
      manufactureYear: vehicle.manufactureYear,
      color: vehicle.color || '',
      qrCode: vehicle.qrCode || '',
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      chassisNumber: '',
      batteryCapacity: 100,
      typeId: '',
      manufactureYear: new Date().getFullYear(),
      color: '',
      qrCode: '',
    })
    setSelectedVehicle(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      Available: {
        label: 'Sẵn sàng',
        className: 'bg-green-500 text-white',
        icon: CheckCircle,
      },
      Rented: {
        label: 'Đang thuê',
        className: 'bg-blue-500 text-white',
        icon: Car,
      },
      Charging: {
        label: 'Đang sạc',
        className: 'bg-yellow-500 text-white',
        icon: Battery,
      },
      Maintenance: {
        label: 'Bảo trì',
        className: 'bg-orange-500 text-white',
        icon: Clock,
      },
      OutOfService: {
        label: 'Ngừng hoạt động',
        className: 'bg-red-500 text-white',
        icon: AlertCircle,
      },
    }

    const config = statusConfig[status] || statusConfig.Available
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      (vehicle.plateNumber || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (vehicle.typeName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (vehicle.color || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || vehicle.status === statusFilter

    const matchesType = typeFilter === 'all' || vehicle.typeId === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === 'Available').length,
    rented: vehicles.filter((v) => v.status === 'Rented').length,
    maintenance: vehicles.filter((v) => v.status === 'Maintenance').length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản Lý Đội Xe</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý toàn bộ đội xe trong hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Số Xe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sẵn Sàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang Thuê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.rented}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bảo Trì
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.maintenance}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh Sách Xe</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Xe Mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo biển số, loại xe, màu sắc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc theo loại xe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại xe</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.typeId} value={type.typeId}>
                    {type.typeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Available">Sẵn sàng</SelectItem>
                <SelectItem value="Rented">Đang thuê</SelectItem>
                <SelectItem value="Charging">Đang sạc</SelectItem>
                <SelectItem value="Maintenance">Bảo trì</SelectItem>
                <SelectItem value="OutOfService">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biển Số</TableHead>
                    <TableHead>Loại Xe</TableHead>
                    <TableHead>Số Khung</TableHead>
                    <TableHead>Năm SX</TableHead>
                    <TableHead>Màu</TableHead>
                    <TableHead>Pin (kWh)</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Không tìm thấy xe nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.vehicleId}>
                        <TableCell className="font-medium">
                          {vehicle.plateNumber}
                        </TableCell>
                        <TableCell>{vehicle.typeName || 'N/A'}</TableCell>
                        <TableCell>{vehicle.chassisNumber || 'N/A'}</TableCell>
                        <TableCell>{vehicle.manufactureYear}</TableCell>
                        <TableCell>{vehicle.color || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-green-600" />
                            {vehicle.batteryCapacity} kWh
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(vehicle)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(vehicle.vehicleId)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm Xe Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết của xe
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Biển Số *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, plateNumber: e.target.value })
                  }
                  placeholder="29A-12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeId">Loại Xe *</Label>
                <Select
                  value={formData.typeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.typeId} value={type.typeId}>
                        {type.typeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chassisNumber">Số Khung</Label>
                <Input
                  id="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, chassisNumber: e.target.value })
                  }
                  placeholder="VF8ABC123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufactureYear">Năm Sản Xuất *</Label>
                <Input
                  id="manufactureYear"
                  type="number"
                  value={formData.manufactureYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manufactureYear: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Màu Sắc</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="Trắng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batteryCapacity">Dung Lượng Pin (kWh) *</Label>
                <Input
                  id="batteryCapacity"
                  type="number"
                  value={formData.batteryCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      batteryCapacity: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qrCode">Mã QR</Label>
              <Input
                id="qrCode"
                value={formData.qrCode}
                onChange={(e) =>
                  setFormData({ ...formData, qrCode: e.target.value })
                }
                placeholder="QR-VEH-001"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate}>Tạo Xe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Xe</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin xe {selectedVehicle?.plateNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plateNumber">Biển Số *</Label>
                <Input
                  id="edit-plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, plateNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-typeId">Loại Xe *</Label>
                <Select
                  value={formData.typeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.typeId} value={type.typeId}>
                        {type.typeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-chassisNumber">Số Khung</Label>
                <Input
                  id="edit-chassisNumber"
                  value={formData.chassisNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, chassisNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-manufactureYear">Năm Sản Xuất *</Label>
                <Input
                  id="edit-manufactureYear"
                  type="number"
                  value={formData.manufactureYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manufactureYear: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-color">Màu Sắc</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-color">Màu Sắc *</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-batteryCapacity">
                  Dung Lượng Pin (kWh) *
                </Label>
                <Input
                  id="edit-batteryCapacity"
                  type="number"
                  value={formData.batteryCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      batteryCapacity: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-qrCode">Mã QR</Label>
              <Input
                id="edit-qrCode"
                value={formData.qrCode}
                onChange={(e) =>
                  setFormData({ ...formData, qrCode: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdate}>Cập Nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
