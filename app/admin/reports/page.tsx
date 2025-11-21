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
  reportService,
  type ReportFilterRequest,
  type UserReport,
} from '@/services/reportService'
import {
  userService,
  type UserProfileApiResponse,
} from '@/services/userService'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
  Search,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<UserReport[]>([])
  const [staffList, setStaffList] = useState<UserProfileApiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)

  const [staffId, setStaffId] = useState('')
  const [resolution, setResolution] = useState('')
  const [staffNotes, setStaffNotes] = useState('')

  useEffect(() => {
    loadReports()
    loadStaffList()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const filter: ReportFilterRequest = {
        pageNumber: 1,
        pageSize: 100,
      }
      const data = await reportService.getReports(filter)
      setReports(data.reports || [])
    } catch (error) {
      toast.error('Không thể tải danh sách báo cáo')
      console.error(error)
      setReports([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const loadStaffList = async () => {
    try {
      const staff = await userService.getUsersByRole('staff')
      setStaffList(staff)
    } catch (error) {
      console.error('Không thể tải danh sách nhân viên:', error)
      // Don't show error toast, just log it
    }
  }

  const handleViewDetail = (report: UserReport) => {
    setSelectedReport(report)
    setIsDetailDialogOpen(true)
  }

  const handleAssignReport = async () => {
    if (!selectedReport || !staffId) {
      toast.error('Vui lòng nhập Staff ID')
      return
    }

    try {
      await reportService.assignReport(selectedReport.reportId, {
        staffId,
        notes: staffNotes,
      })
      toast.success('Assign báo cáo thành công')
      setIsAssignDialogOpen(false)
      setStaffId('')
      setStaffNotes('')
      loadReports()
    } catch (error: any) {
      toast.error(error.message || 'Không thể assign báo cáo')
    }
  }

  const handleResolveReport = async () => {
    if (!selectedReport || !resolution) {
      toast.error('Vui lòng nhập giải pháp')
      return
    }

    try {
      await reportService.resolveReport(selectedReport.reportId, {
        resolution,
        staffNotes,
      })
      toast.success('Giải quyết báo cáo thành công')
      setIsResolveDialogOpen(false)
      setResolution('')
      setStaffNotes('')
      loadReports()
    } catch (error: any) {
      toast.error(error.message || 'Không thể giải quyết báo cáo')
    }
  }

  const handleCloseReport = async (reportId: string) => {
    if (!confirm('Bạn có chắc chắn muốn đóng báo cáo này?')) return

    try {
      await reportService.closeReport(reportId)
      toast.success('Đóng báo cáo thành công')
      loadReports()
    } catch (error: any) {
      toast.error(error.message || 'Không thể đóng báo cáo')
    }
  }

  const handleRejectReport = async (reportId: string) => {
    const reason = prompt('Lý do từ chối:')
    if (!reason) return

    try {
      await reportService.rejectReport(reportId, reason)
      toast.success('Từ chối báo cáo thành công')
      loadReports()
    } catch (error: any) {
      toast.error(error.message || 'Không thể từ chối báo cáo')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
        label: string
        icon: any
      }
    > = {
      pending: { variant: 'outline', label: 'Chờ xử lý', icon: Clock },
      in_progress: {
        variant: 'default',
        label: 'Đang xử lý',
        icon: AlertCircle,
      },
      resolved: {
        variant: 'default',
        label: 'Đã giải quyết',
        icon: CheckCircle,
      },
      closed: { variant: 'secondary', label: 'Đã đóng', icon: XCircle },
      rejected: { variant: 'destructive', label: 'Từ chối', icon: XCircle },
    }

    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      low: { className: 'bg-gray-500 text-white', label: 'Thấp' },
      medium: { className: 'bg-blue-500 text-white', label: 'Trung bình' },
      high: { className: 'bg-orange-500 text-white', label: 'Cao' },
      urgent: { className: 'bg-red-500 text-white', label: 'Khẩn cấp' },
    }

    const config = variants[priority] || variants.medium
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      complaint: 'Khiếu nại',
      feedback: 'Phản hồi',
      technical_issue: 'Sự cố kỹ thuật',
      suggestion: 'Đề xuất',
    }
    return <Badge variant="outline">{labels[type] || type}</Badge>
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (report.reporterName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || report.status === statusFilter
    const matchesPriority =
      priorityFilter === 'all' || report.priority === priorityFilter
    const matchesType = typeFilter === 'all' || report.reportType === typeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    inProgress: reports.filter((r) => r.status === 'in_progress').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Khiếu Nại</h1>
          <p className="text-muted-foreground">
            Xem và xử lý các báo cáo khiếu nại từ khách hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng Báo Cáo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chờ Xử Lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang Xử Lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã Giải Quyết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Báo Cáo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, mô tả, người báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="complaint">Khiếu nại</SelectItem>
                <SelectItem value="feedback">Phản hồi</SelectItem>
                <SelectItem value="technical_issue">Sự cố kỹ thuật</SelectItem>
                <SelectItem value="suggestion">Đề xuất</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="in_progress">Đang xử lý</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
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
                    <TableHead>Tiêu Đề</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Độ Ưu Tiên</TableHead>
                    <TableHead>Người Báo Cáo</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Không tìm thấy báo cáo nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.reportId}>
                        <TableCell className="font-medium max-w-[300px]">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                            <div className="truncate">{report.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(report.reportType)}</TableCell>
                        <TableCell>
                          {getPriorityBadge(report.priority)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {report.reporterName || 'N/A'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {report.reporterEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {format(
                            new Date(report.createdAt),
                            'dd/MM/yyyy HH:mm',
                            { locale: vi }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetail(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {report.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedReport(report)
                                  setIsAssignDialogOpen(true)
                                }}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            {report.status === 'in_progress' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedReport(report)
                                  setIsResolveDialogOpen(true)
                                }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Báo Cáo</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Loại báo cáo</Label>
                  <div className="mt-1">
                    {getTypeBadge(selectedReport.reportType)}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Độ ưu tiên</Label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedReport.priority)}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Tiêu đề</Label>
                <div className="mt-1 font-medium">{selectedReport.title}</div>
              </div>

              <div>
                <Label className="text-muted-foreground">Mô tả</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {selectedReport.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Người báo cáo</Label>
                  <div className="mt-1">
                    <div className="font-medium">
                      {selectedReport.reporterName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedReport.reporterEmail}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
              </div>

              {selectedReport.assignedToStaffName && (
                <div>
                  <Label className="text-muted-foreground">
                    Được assign cho
                  </Label>
                  <div className="mt-1 font-medium">
                    {selectedReport.assignedToStaffName}
                  </div>
                </div>
              )}

              {selectedReport.staffNotes && (
                <div>
                  <Label className="text-muted-foreground">
                    Ghi chú của staff
                  </Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    {selectedReport.staffNotes}
                  </div>
                </div>
              )}

              {selectedReport.resolution && (
                <div>
                  <Label className="text-muted-foreground">Giải pháp</Label>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                    {selectedReport.resolution}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Ngày tạo</Label>
                  <div className="mt-1">
                    {format(
                      new Date(selectedReport.createdAt),
                      'dd/MM/yyyy HH:mm',
                      { locale: vi }
                    )}
                  </div>
                </div>
                {selectedReport.resolvedAt && (
                  <div>
                    <Label className="text-muted-foreground">
                      Ngày giải quyết
                    </Label>
                    <div className="mt-1">
                      {format(
                        new Date(selectedReport.resolvedAt),
                        'dd/MM/yyyy HH:mm',
                        { locale: vi }
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedReport.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        setIsDetailDialogOpen(false)
                        setIsAssignDialogOpen(true)
                      }}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsDetailDialogOpen(false)
                        handleRejectReport(selectedReport.reportId)
                      }}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                {selectedReport.status === 'in_progress' && (
                  <Button
                    onClick={() => {
                      setIsDetailDialogOpen(false)
                      setIsResolveDialogOpen(true)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Giải quyết
                  </Button>
                )}
                {selectedReport.status === 'resolved' && (
                  <Button
                    onClick={() => {
                      setIsDetailDialogOpen(false)
                      handleCloseReport(selectedReport.reportId)
                    }}
                  >
                    Đóng báo cáo
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Báo Cáo</DialogTitle>
            <DialogDescription>
              Assign báo cáo cho nhân viên xử lý
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staffId">Chọn Nhân Viên *</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên xử lý" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.length === 0 ? (
                    <SelectItem value="no-staff" disabled>
                      Không có nhân viên
                    </SelectItem>
                  ) : (
                    staffList.map((staff) => (
                      <SelectItem key={staff.userId} value={staff.userId}>
                        {staff.fullName} ({staff.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignNotes">Ghi chú</Label>
              <Textarea
                id="assignNotes"
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Ghi chú cho staff..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignDialogOpen(false)
                setStaffId('')
                setStaffNotes('')
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleAssignReport}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giải Quyết Báo Cáo</DialogTitle>
            <DialogDescription>Nhập giải pháp đã thực hiện</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Giải pháp *</Label>
              <Textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Mô tả giải pháp đã thực hiện..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolveNotes">Ghi chú</Label>
              <Textarea
                id="resolveNotes"
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Ghi chú thêm..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsResolveDialogOpen(false)
                setResolution('')
                setStaffNotes('')
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleResolveReport}>Giải quyết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
