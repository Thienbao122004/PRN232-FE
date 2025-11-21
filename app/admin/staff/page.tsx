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
import { Textarea } from '@/components/ui/textarea'
import {
  type UserManagementResponse,
  userManagementService,
} from '@/services/userManagementService'
import {
  Lock,
  Search,
  Shield,
  Unlock,
  UserCheck,
  UserCog,
  Users,
  UserX,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function StaffPage() {
  const [staff, setStaff] = useState<UserManagementResponse[]>([])
  const [filteredStaff, setFilteredStaff] = useState<UserManagementResponse[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Detail Dialog
  const [selectedStaff, setSelectedStaff] =
    useState<UserManagementResponse | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Change Role Dialog
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState('')

  // Lock Dialog
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)
  const [lockReason, setLockReason] = useState('')

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    locked: 0,
    managers: 0,
  })

  useEffect(() => {
    loadStaff()
  }, [])

  useEffect(() => {
    filterStaff()
  }, [staff, searchTerm, statusFilter])

  const loadStaff = async () => {
    try {
      setLoading(true)
      const data = await userManagementService.getUsersByRole('staff')
      setStaff(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error loading staff:', error)
      toast.error('Không thể tải danh sách nhân viên')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: UserManagementResponse[]) => {
    setStats({
      total: data.length,
      active: data.filter((s) => s.status === 'active').length,
      locked: data.filter((s) => s.status === 'locked').length,
      managers: data.filter((s) => s.role === 'manager').length,
    })
  }

  const filterStaff = () => {
    let filtered = staff

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.userName.toLowerCase().includes(term) ||
          s.phoneNumber?.toLowerCase().includes(term)
      )
    }

    setFilteredStaff(filtered)
  }

  const handleViewDetails = (staffMember: UserManagementResponse) => {
    setSelectedStaff(staffMember)
    setIsDetailDialogOpen(true)
  }

  const handleChangeRole = async () => {
    if (!selectedStaff || !newRole) return

    try {
      await userManagementService.changeUserRole(selectedStaff.userId, newRole)
      toast.success('Đã thay đổi quyền nhân viên')
      setIsChangeRoleDialogOpen(false)
      setNewRole('')
      loadStaff()
    } catch (error) {
      console.error('Error changing role:', error)
      toast.error('Không thể thay đổi quyền')
    }
  }

  const handleLockStaff = async () => {
    if (!selectedStaff) return

    try {
      await userManagementService.lockUser(selectedStaff.userId, lockReason)
      toast.success('Đã khóa tài khoản nhân viên')
      setIsLockDialogOpen(false)
      setLockReason('')
      loadStaff()
    } catch (error) {
      console.error('Error locking staff:', error)
      toast.error('Không thể khóa tài khoản')
    }
  }

  const handleUnlockStaff = async (userId: string) => {
    try {
      await userManagementService.unlockUser(userId)
      toast.success('Đã mở khóa tài khoản')
      loadStaff()
    } catch (error) {
      console.error('Error unlocking staff:', error)
      toast.error('Không thể mở khóa tài khoản')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        label: string
      }
    > = {
      active: { variant: 'default', label: 'Hoạt động' },
      pending: { variant: 'secondary', label: 'Chờ duyệt' },
      locked: { variant: 'destructive', label: 'Đã khóa' },
    }

    const config = variants[status] || {
      variant: 'outline' as const,
      label: status,
    }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<
      string,
      { className: string; icon: any; label: string }
    > = {
      manager: {
        className: 'bg-purple-50 text-purple-700',
        icon: Shield,
        label: 'Quản lý',
      },
      staff: {
        className: 'bg-blue-50 text-blue-700',
        icon: UserCheck,
        label: 'Nhân viên',
      },
    }

    const config = variants[role] || {
      className: 'bg-gray-50 text-gray-700',
      icon: Users,
      label: role,
    }
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Nhân Viên</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin, quyền hạn và trạng thái nhân viên
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản lý</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.managers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã khóa</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.locked}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email, SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="locked">Đã khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Quyền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Không có nhân viên nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staffMember) => (
                  <TableRow key={staffMember.userId}>
                    <TableCell className="font-medium">
                      {staffMember.fullName}
                    </TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>{getRoleBadge(staffMember.role)}</TableCell>
                    <TableCell>{getStatusBadge(staffMember.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(staffMember)}
                        >
                          Chi tiết
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedStaff(staffMember)
                            setNewRole(staffMember.role)
                            setIsChangeRoleDialogOpen(true)
                          }}
                        >
                          <UserCog className="h-4 w-4 mr-1" />
                          Quyền
                        </Button>

                        {staffMember.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedStaff(staffMember)
                              setIsLockDialogOpen(true)
                            }}
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            Khóa
                          </Button>
                        )}

                        {staffMember.status === 'locked' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleUnlockStaff(staffMember.userId)
                            }
                          >
                            <Unlock className="h-4 w-4 mr-1" />
                            Mở khóa
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết nhân viên</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của {selectedStaff?.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-medium">{selectedStaff.userId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedStaff.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Họ tên</Label>
                  <p className="font-medium">{selectedStaff.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p className="font-medium">{selectedStaff.userName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Số điện thoại</Label>
                  <p className="font-medium">
                    {selectedStaff.phoneNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Quyền</Label>
                  <div className="mt-1">{getRoleBadge(selectedStaff.role)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày sinh</Label>
                  <p className="font-medium">{selectedStaff.dob || 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Địa chỉ</Label>
                <p className="font-medium">{selectedStaff.address || 'N/A'}</p>
              </div>

              {selectedStaff.avatarUrl && (
                <div>
                  <Label className="text-muted-foreground">Avatar</Label>
                  <img
                    src={selectedStaff.avatarUrl}
                    alt="Avatar"
                    className="mt-2 h-24 w-24 rounded-full border"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={isChangeRoleDialogOpen}
        onOpenChange={setIsChangeRoleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi quyền</DialogTitle>
            <DialogDescription>
              Thay đổi quyền hạn cho {selectedStaff?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newRole">Quyền mới *</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quyền" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Nhân viên</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Thay đổi quyền sẽ ảnh hưởng đến khả năng truy cập của người
                dùng
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsChangeRoleDialogOpen(false)
                setNewRole('')
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleChangeRole}
              disabled={!newRole || newRole === selectedStaff?.role}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Thay đổi quyền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock Dialog */}
      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Khóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn khóa tài khoản {selectedStaff?.fullName}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lockReason">Lý do khóa *</Label>
              <Textarea
                id="lockReason"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="Nhập lý do khóa tài khoản..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsLockDialogOpen(false)
                setLockReason('')
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleLockStaff}
              disabled={!lockReason.trim()}
            >
              <Lock className="mr-2 h-4 w-4" />
              Khóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
