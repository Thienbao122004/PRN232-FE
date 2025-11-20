'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea'
import type { BranchResponse } from '@/services/branchService'
import { branchService } from '@/services/branchService'
import type { UserProfileApiResponse } from '@/services/userService'
import { userService } from '@/services/userService'
import { assignmentService, shiftService } from '@/services/workforceService'
import type { BulkAssignmentRequest, Shift } from '@/types/workforce'
import { Building2, Calendar, Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Branch {
  branchId: string
  branchName: string
}

interface Staff {
  userId: string
  fullName: string
  email: string
}

export default function StaffSchedulePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shifts, setShifts] = useState<Shift[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])

  const [formData, setFormData] = useState<BulkAssignmentRequest>({
    staffId: '',
    branchId: '',
    startDate: '',
    endDate: '',
    shiftIds: [],
    task: '',
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [shiftsData, branchesResponse] = await Promise.all([
        shiftService.getAllShifts(),
        branchService.getAllBranches(),
      ])
      setShifts(shiftsData)
      // Map BranchResponse to Branch interface
      const mappedBranches: Branch[] = branchesResponse.data.map(
        (b: BranchResponse) => ({
          branchId: b.branchId,
          branchName: b.branchName,
        })
      )
      setBranches(mappedBranches)
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
      console.error(error)
    }
  }

  const loadStaffByBranch = async (branchId: string) => {
    try {
      const staffData = await userService.getUsersByRole('staff')
      // Map UserProfileApiResponse to Staff interface
      const mappedStaff: Staff[] = staffData.map(
        (user: UserProfileApiResponse) => ({
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
        })
      )
      setStaffList(mappedStaff)
    } catch (error) {
      console.error('Failed to load staff:', error)
      toast.error('Không thể tải danh sách nhân viên')
    }
  }

  const handleBranchChange = (branchId: string) => {
    setFormData({ ...formData, branchId })
    loadStaffByBranch(branchId)
  }

  const toggleShift = (shiftId: string) => {
    setSelectedShifts((prev) =>
      prev.includes(shiftId)
        ? prev.filter((id) => id !== shiftId)
        : [...prev, shiftId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedShifts.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ca làm việc')
      return
    }

    const requestData: BulkAssignmentRequest = {
      ...formData,
      shiftIds: selectedShifts,
    }

    try {
      setLoading(true)
      await assignmentService.createBulkAssignments(requestData)
      toast.success('Phân công lịch làm việc thành công!')
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(error.message || 'Không thể phân công lịch làm việc')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      staffId: '',
      branchId: '',
      startDate: '',
      endDate: '',
      shiftIds: [],
      task: '',
    })
    setSelectedShifts([])
    setStaffList([])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Phân Công Lịch Làm Việc</h1>
          <p className="text-muted-foreground">
            Phân công ca làm việc cho nhân viên
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Phân Công Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Phân Công Lịch Làm Việc</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Branch Selection */}
              <div>
                <Label htmlFor="branch">Chi Nhánh *</Label>
                <Select
                  value={formData.branchId}
                  onValueChange={handleBranchChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.branchId} value={branch.branchId}>
                        {branch.branchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Selection */}
              <div>
                <Label htmlFor="staff">Nhân Viên *</Label>
                <Select
                  value={formData.staffId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, staffId: value })
                  }
                  required
                  disabled={!formData.branchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.userId} value={staff.userId}>
                        {staff.fullName} ({staff.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Từ Ngày *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Đến Ngày *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Shift Selection */}
              <div>
                <Label>Ca Làm Việc * (Chọn nhiều)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {shifts.map((shift) => {
                    const isSelected = selectedShifts.includes(shift.shiftId)
                    return (
                      <Card
                        key={shift.shiftId}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => toggleShift(shift.shiftId)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{shift.shiftName}</p>
                              <p className="text-sm text-muted-foreground">
                                {shift.startTime.substring(0, 5)} -{' '}
                                {shift.endTime.substring(0, 5)}
                              </p>
                            </div>
                            {isSelected && <Badge variant="default">✓</Badge>}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Task Description */}
              <div>
                <Label htmlFor="task">Công Việc</Label>
                <Textarea
                  id="task"
                  value={formData.task}
                  onChange={(e) =>
                    setFormData({ ...formData, task: e.target.value })
                  }
                  placeholder="Mô tả công việc cần làm..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Phân Công'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Ca Làm Việc
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.length}</div>
            <p className="text-xs text-muted-foreground">Ca đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi Nhánh</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">Trên toàn hệ thống</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Phân Công Hôm Nay
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Đang cập nhật</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng Dẫn Sử Dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge className="mt-1">1</Badge>
            <p className="text-sm">
              Nhấn <strong>"Phân Công Mới"</strong> để bắt đầu
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-1">2</Badge>
            <p className="text-sm">
              Chọn <strong>Chi nhánh</strong> và <strong>Nhân viên</strong>
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-1">3</Badge>
            <p className="text-sm">
              Chọn <strong>khoảng thời gian</strong> cần phân công
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-1">4</Badge>
            <p className="text-sm">
              Chọn <strong>các ca làm việc</strong> (có thể chọn nhiều ca)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="mt-1">5</Badge>
            <p className="text-sm">
              Nhập mô tả công việc và nhấn <strong>"Phân Công"</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
