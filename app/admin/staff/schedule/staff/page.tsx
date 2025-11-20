'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { branchService } from '@/services/branchService'
import type { UserProfileApiResponse } from '@/services/userService'
import { userService } from '@/services/userService'
import { workdayService } from '@/services/workforceService'
import type { StaffSchedule, UserProfile } from '@/types/workforce'
import { Calendar, Clock, MapPin, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function StaffScheduleViewPage() {
  const [schedule, setSchedule] = useState<StaffSchedule | null>(null)
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState<any[]>([])
  const [staffList, setStaffList] = useState<UserProfile[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Set default date range (current week)
  useEffect(() => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    setStartDate(monday.toISOString().split('T')[0])
    setEndDate(sunday.toISOString().split('T')[0])
  }, [])

  // Load branches
  useEffect(() => {
    loadBranches()
  }, [])

  // Load staff when branch changes
  useEffect(() => {
    if (selectedBranch) {
      loadStaffByBranch()
    }
  }, [selectedBranch])

  const loadBranches = async () => {
    try {
      const response = await branchService.getAllBranches()
      setBranches(response.data)
    } catch (error) {
      console.error('Error loading branches:', error)
      toast.error('Không thể tải danh sách chi nhánh')
    }
  }

  const loadStaffByBranch = async () => {
    try {
      const data = await userService.getUsersByRole('staff')
      // Map UserProfileApiResponse to UserProfile for consistency
      const mappedStaff: UserProfile[] = data.map(
        (user: UserProfileApiResponse) => ({
          userId: user.userId,
          email: user.email,
          userName: user.userName,
          fullName: user.fullName,
          firstName: user.fullName.split(' ')[0],
          lastName: user.fullName.split(' ').slice(1).join(' '),
          dob: user.dob,
          address: user.address,
          avatarUrl: user.avatarUrl,
          cccdUrl: user.cccdUrl,
          phoneNumber: user.phoneNumber,
          status: user.status,
          role: user.role,
        })
      )
      setStaffList(mappedStaff)
    } catch (error) {
      console.error('Error loading staff:', error)
      toast.error('Không thể tải danh sách nhân viên')
    }
  }

  const loadSchedule = async () => {
    if (!selectedStaff || !startDate || !endDate) {
      toast.error('Vui lòng chọn nhân viên và khoảng thời gian')
      return
    }

    setLoading(true)
    try {
      const data = await workdayService.getStaffSchedule(
        selectedStaff,
        startDate,
        endDate
      )
      setSchedule(data)
      toast.success('Tải lịch làm việc thành công')
    } catch (error) {
      console.error('Error loading schedule:', error)
      toast.error('Không thể tải lịch làm việc')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'active':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Hoàn thành'
      case 'active':
        return 'Đang làm'
      case 'pending':
        return 'Sắp tới'
      default:
        return status
    }
  }

  const groupWorkdaysByDate = () => {
    if (!schedule?.workdays) return {}

    return schedule.workdays.reduce((acc, workday) => {
      const date = new Date(workday.date).toLocaleDateString('vi-VN')
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(workday)
      return acc
    }, {} as Record<string, typeof schedule.workdays>)
  }

  const groupedWorkdays = groupWorkdaysByDate()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Lịch Làm Việc Nhân Viên</h1>
        <p className="text-muted-foreground mt-1">
          Xem lịch làm việc chi tiết của từng nhân viên
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm Kiếm Lịch Làm Việc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chi Nhánh</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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

            {/* Staff Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhân Viên</label>
              <Select
                value={selectedStaff}
                onValueChange={setSelectedStaff}
                disabled={!selectedBranch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((staff) => (
                    <SelectItem
                      key={staff.userId}
                      value={staff.userId.toString()}
                    >
                      {staff.fullName || staff.userName || staff.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ Ngày</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Đến Ngày</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={loadSchedule}
            disabled={loading}
            className="w-full md:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? 'Đang tải...' : 'Tìm Kiếm'}
          </Button>
        </CardContent>
      </Card>

      {/* Staff Info & Statistics */}
      {schedule && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Nhân Viên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {schedule.staffInfo?.fullName ||
                      schedule.staffInfo?.userName ||
                      'N/A'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {schedule.staffInfo?.email}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Chi Nhánh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {branches.find((b) => b.branchId === selectedBranch)
                      ?.branchName || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng Ngày Làm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {schedule.workdays?.length || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng Ca Làm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">
                    {schedule.workdays?.reduce(
                      (sum, wd) => sum + (wd.assignments?.length || 0),
                      0
                    ) || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Calendar */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Lịch Làm Việc Chi Tiết</h2>
            {Object.keys(groupedWorkdays).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Không có lịch làm việc trong khoảng thời gian này
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {Object.entries(groupedWorkdays).map(([date, workdays]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {workdays.map((workday) => (
                        <div
                          key={workday.workdayId}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <Badge
                              className={getStatusColor(
                                workday.status || 'pending'
                              )}
                            >
                              {getStatusText(workday.status || 'pending')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ID: {workday.workdayId}
                            </span>
                          </div>

                          {workday.assignments &&
                            workday.assignments.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">
                                  Ca Làm Việc:
                                </h4>
                                {workday.assignments.map((assignment) => (
                                  <div
                                    key={assignment.assignmentId}
                                    className="bg-muted/50 rounded-md p-3 space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          {assignment.shift?.shiftName || 'N/A'}
                                        </span>
                                      </div>
                                      <Badge variant="outline">
                                        {assignment.shift?.startTime?.substring(
                                          0,
                                          5
                                        )}{' '}
                                        -{' '}
                                        {assignment.shift?.endTime?.substring(
                                          0,
                                          5
                                        )}
                                      </Badge>
                                    </div>

                                    {assignment.task && (
                                      <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">
                                          Nhiệm vụ:
                                        </span>{' '}
                                        {assignment.task}
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className={getStatusColor(
                                          assignment.status || 'pending'
                                        )}
                                      >
                                        {getStatusText(
                                          assignment.status || 'pending'
                                        )}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!schedule && (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Chọn nhân viên và khoảng thời gian để xem lịch làm việc
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
