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
  CheckCircle,
  Lock,
  Search,
  Unlock,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<UserManagementResponse[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<
    UserManagementResponse[]
  >([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Detail Dialog
  const [selectedCustomer, setSelectedCustomer] =
    useState<UserManagementResponse | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Lock Dialog
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)
  const [lockReason, setLockReason] = useState('')

  // Verify Dialog
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    locked: 0,
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, statusFilter])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await userManagementService.getUsersByRole('customer')
      setCustomers(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error loading customers:', error)
      toast.error('Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: UserManagementResponse[]) => {
    setStats({
      total: data.length,
      active: data.filter((c) => c.status === 'active').length,
      pending: data.filter((c) => c.status === 'pending').length,
      locked: data.filter((c) => c.status === 'locked').length,
    })
  }

  const filterCustomers = () => {
    let filtered = customers

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.userName.toLowerCase().includes(term) ||
          c.phoneNumber?.toLowerCase().includes(term)
      )
    }

    setFilteredCustomers(filtered)
  }

  const handleViewDetails = (customer: UserManagementResponse) => {
    setSelectedCustomer(customer)
    setIsDetailDialogOpen(true)
  }

  const handleLockCustomer = async () => {
    if (!selectedCustomer) return

    try {
      await userManagementService.lockUser(selectedCustomer.userId, lockReason)
      toast.success('Đã khóa tài khoản khách hàng')
      setIsLockDialogOpen(false)
      setLockReason('')
      loadCustomers()
    } catch (error) {
      console.error('Error locking customer:', error)
      toast.error('Không thể khóa tài khoản')
    }
  }

  const handleUnlockCustomer = async (userId: string) => {
    try {
      await userManagementService.unlockUser(userId)
      toast.success('Đã mở khóa tài khoản')
      loadCustomers()
    } catch (error) {
      console.error('Error unlocking customer:', error)
      toast.error('Không thể mở khóa tài khoản')
    }
  }

  const handleVerifyCustomer = async (status: string) => {
    if (!selectedCustomer) return

    try {
      await userManagementService.verifyUser(selectedCustomer.userId, status)
      toast.success(
        status === 'active' ? 'Đã phê duyệt tài khoản' : 'Đã từ chối tài khoản'
      )
      setIsVerifyDialogOpen(false)
      loadCustomers()
    } catch (error) {
      console.error('Error verifying customer:', error)
      toast.error('Không thể xác thực tài khoản')
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
          <h1 className="text-3xl font-bold">Quản Lý Khách Hàng</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và trạng thái khách hàng
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
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
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
          <CardTitle>
            Danh sách khách hàng ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không có khách hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.userId}>
                    <TableCell className="font-medium">
                      {customer.fullName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(customer)}
                        >
                          Chi tiết
                        </Button>

                        {customer.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsVerifyDialogOpen(true)
                            }}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Duyệt
                          </Button>
                        )}

                        {customer.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsLockDialogOpen(true)
                            }}
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            Khóa
                          </Button>
                        )}

                        {customer.status === 'locked' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleUnlockCustomer(customer.userId)
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
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của {selectedCustomer?.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-medium">{selectedCustomer.userId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedCustomer.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Họ tên</Label>
                  <p className="font-medium">{selectedCustomer.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p className="font-medium">{selectedCustomer.userName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Số điện thoại</Label>
                  <p className="font-medium">
                    {selectedCustomer.phoneNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Địa chỉ</Label>
                <p className="font-medium">
                  {selectedCustomer.address || 'N/A'}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Ngày sinh</Label>
                <p className="font-medium">{selectedCustomer.dob || 'N/A'}</p>
              </div>

              {selectedCustomer.cccdUrl && (
                <div>
                  <Label className="text-muted-foreground">CCCD</Label>
                  <img
                    src={selectedCustomer.cccdUrl}
                    alt="CCCD"
                    className="mt-2 max-h-48 rounded border"
                  />
                </div>
              )}

              {selectedCustomer.avatarUrl && (
                <div>
                  <Label className="text-muted-foreground">Avatar</Label>
                  <img
                    src={selectedCustomer.avatarUrl}
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

      {/* Lock Dialog */}
      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Khóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn khóa tài khoản {selectedCustomer?.fullName}?
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
              onClick={handleLockCustomer}
              disabled={!lockReason.trim()}
            >
              <Lock className="mr-2 h-4 w-4" />
              Khóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phê duyệt tài khoản</DialogTitle>
            <DialogDescription>
              Xác thực tài khoản cho {selectedCustomer?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p>Bạn muốn phê duyệt hay từ chối tài khoản này?</p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVerifyDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleVerifyCustomer('locked')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerifyCustomer('active')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Phê duyệt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
