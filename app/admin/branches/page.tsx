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
  branchService,
  type Branch,
  type BranchCreateRequest,
  type BranchUpdateRequest,
} from '@/services/branchService'
import {
  Building2,
  Car,
  Clock,
  Edit,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [formData, setFormData] = useState<BranchCreateRequest>({
    branchName: '',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    contactNumber: '',
    workingHours: '',
  })

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const data = await branchService.getAllBranches()
      setBranches(data)
    } catch (error) {
      toast.error('Không thể tải danh sách chi nhánh')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await branchService.createBranch(formData)
      toast.success('Tạo chi nhánh thành công')
      setIsCreateDialogOpen(false)
      resetForm()
      loadBranches()
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo chi nhánh')
    }
  }

  const handleUpdate = async () => {
    if (!selectedBranch) return

    try {
      const updateData: BranchUpdateRequest = {
        branchName: formData.branchName,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contactNumber: formData.contactNumber,
        workingHours: formData.workingHours,
      }

      await branchService.updateBranch(selectedBranch.branchId, updateData)
      toast.success('Cập nhật chi nhánh thành công')
      setIsEditDialogOpen(false)
      resetForm()
      loadBranches()
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật chi nhánh')
    }
  }

  const handleDelete = async (branchId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chi nhánh này?')) return

    try {
      await branchService.deleteBranch(branchId)
      toast.success('Xóa chi nhánh thành công')
      loadBranches()
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa chi nhánh')
    }
  }

  const openEditDialog = (branch: Branch) => {
    setSelectedBranch(branch)
    setFormData({
      branchName: branch.branchName,
      address: branch.address,
      city: branch.city,
      latitude: branch.latitude,
      longitude: branch.longitude,
      contactNumber: branch.contactNumber,
      workingHours: branch.workingHours,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      branchName: '',
      address: '',
      city: '',
      latitude: 0,
      longitude: 0,
      contactNumber: '',
      workingHours: '',
    })
    setSelectedBranch(null)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        label: string
      }
    > = {
      Active: { variant: 'default', label: 'Hoạt động' },
      Inactive: { variant: 'secondary', label: 'Ngừng hoạt động' },
      Maintenance: { variant: 'outline', label: 'Bảo trì' },
    }

    const config = variants[status] || {
      variant: 'outline' as const,
      label: status,
    }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      (branch.branchName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (branch.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.city || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || branch.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: branches.length,
    active: branches.filter((b) => b.status === 'Active').length,
    totalVehicles: branches.reduce((sum, b) => sum + (b.totalVehicles || 0), 0),
    availableVehicles: branches.reduce(
      (sum, b) => sum + (b.availableVehicles || 0),
      0
    ),
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Điểm Thuê</h1>
          <p className="text-muted-foreground">
            Quản lý các chi nhánh và điểm thuê xe
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Chi Nhánh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang Hoạt Động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Xe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalVehicles}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Xe Sẵn Sàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.availableVehicles}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh Sách Chi Nhánh</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Chi Nhánh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, địa chỉ, thành phố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                <SelectItem value="Maintenance">Bảo trì</SelectItem>
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
                    <TableHead>Tên Chi Nhánh</TableHead>
                    <TableHead>Địa Chỉ</TableHead>
                    <TableHead>Thành Phố</TableHead>
                    <TableHead>Liên Hệ</TableHead>
                    <TableHead>Giờ Làm Việc</TableHead>
                    <TableHead>Số Xe</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Không tìm thấy chi nhánh nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBranches.map((branch) => (
                      <TableRow key={branch.branchId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {branch.branchName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {branch.address}
                          </div>
                        </TableCell>
                        <TableCell>{branch.city || 'N/A'}</TableCell>
                        <TableCell>
                          {branch.contactNumber ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {branch.contactNumber}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {branch.workingHours ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {branch.workingHours}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            {branch.availableVehicles}/{branch.totalVehicles}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(branch.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(branch)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(branch.branchId)}
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
            <DialogTitle>Thêm Chi Nhánh Mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi nhánh mới</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchName">Tên Chi Nhánh *</Label>
                <Input
                  id="branchName"
                  value={formData.branchName}
                  onChange={(e) =>
                    setFormData({ ...formData, branchName: e.target.value })
                  }
                  placeholder="Chi nhánh Quận 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Thành Phố</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Hồ Chí Minh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa Chỉ *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Nguyễn Huệ, Quận 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Vĩ Độ *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                  placeholder="10.762622"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Kinh Độ *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                  placeholder="106.660172"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Số Điện Thoại</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  placeholder="028 1234 5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Giờ Làm Việc</Label>
                <Input
                  id="workingHours"
                  value={formData.workingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, workingHours: e.target.value })
                  }
                  placeholder="8:00 - 20:00"
                />
              </div>
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
            <Button onClick={handleCreate}>Tạo Chi Nhánh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Chi Nhánh</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi nhánh {selectedBranch?.branchName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-branchName">Tên Chi Nhánh *</Label>
                <Input
                  id="edit-branchName"
                  value={formData.branchName}
                  onChange={(e) =>
                    setFormData({ ...formData, branchName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-city">Thành Phố</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Địa Chỉ *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-latitude">Vĩ Độ *</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-longitude">Kinh Độ *</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contactNumber">Số Điện Thoại</Label>
                <Input
                  id="edit-contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-workingHours">Giờ Làm Việc</Label>
                <Input
                  id="edit-workingHours"
                  value={formData.workingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, workingHours: e.target.value })
                  }
                />
              </div>
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
