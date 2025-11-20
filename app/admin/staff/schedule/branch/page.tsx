'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BranchResponse } from '@/services/branchService'
import { branchService } from '@/services/branchService'
import { workdayService } from '@/services/workforceService'
import type { BranchSchedule, Workday } from '@/types/workforce'
import { Building2, Calendar, Clock, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Branch {
  branchId: string
  branchName: string
}

export default function BranchSchedulePage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [schedule, setSchedule] = useState<BranchSchedule | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBranches()
    // Set default dates (current week)
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    setStartDate(monday.toISOString().split('T')[0])
    setEndDate(sunday.toISOString().split('T')[0])
  }, [])

  const loadBranches = async () => {
    try {
      const response = await branchService.getAllBranches()
      // Map BranchResponse to Branch interface
      const mappedBranches: Branch[] = response.data.map(
        (b: BranchResponse) => ({
          branchId: b.branchId,
          branchName: b.branchName,
        })
      )
      setBranches(mappedBranches)
      if (mappedBranches.length > 0) {
        setSelectedBranch(mappedBranches[0].branchId)
      }
    } catch (error) {
      toast.error('Không thể tải danh sách chi nhánh')
      console.error(error)
    }
  }

  const loadSchedule = async () => {
    if (!selectedBranch || !startDate || !endDate) {
      toast.error('Vui lòng chọn đầy đủ thông tin')
      return
    }

    try {
      setLoading(true)
      const data = await workdayService.getBranchSchedule(
        selectedBranch,
        startDate,
        endDate
      )
      setSchedule(data)
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải lịch làm việc')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Group workdays by date
  const groupedByDate = (schedule?.workdays || []).reduce((acc, workday) => {
    const date = workday.date.split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(workday)
    return acc
  }, {} as Record<string, Workday[]>)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lịch Làm Việc Chi Nhánh</h1>
        <p className="text-muted-foreground">
          Xem lịch làm việc của tất cả nhân viên trong chi nhánh
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bộ Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="branch">Chi Nhánh</Label>
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

            <div>
              <Label htmlFor="startDate">Từ Ngày</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Đến Ngày</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={loadSchedule}
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Xem Lịch'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {schedule && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Ngày Làm Việc
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedule.workdays.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Trong khoảng thời gian đã chọn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Nhân Viên
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(schedule.workdays.map((w) => w.staffId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Nhân viên được phân công
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng Ca Làm Việc
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedule.workdays.reduce(
                  (sum, w) => sum + (w.assignments?.length || 0),
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">Ca đã phân công</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule by Date */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Đang tải lịch làm việc...</p>
          </CardContent>
        </Card>
      ) : schedule && groupedByDate ? (
        <div className="space-y-4">
          {Object.keys(groupedByDate)
            .sort()
            .map((date) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {formatDate(date)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {groupedByDate[date].map((workday) => (
                      <Card
                        key={workday.workdayId}
                        className="border-l-4 border-l-primary"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {workday.staffInfo?.fullName || 'N/A'}
                                </span>
                                <Badge variant="outline">
                                  {workday.staffInfo?.role || 'staff'}
                                </Badge>
                              </div>
                              {workday.assignments &&
                                workday.assignments.length > 0 && (
                                  <div className="flex flex-wrap gap-2 ml-6">
                                    {workday.assignments.map((assignment) => (
                                      <Badge
                                        key={assignment.assignmentId}
                                        variant="secondary"
                                      >
                                        <Clock className="h-3 w-3 mr-1" />
                                        {assignment.shift?.shiftName || 'N/A'} (
                                        {assignment.shift?.startTime.substring(
                                          0,
                                          5
                                        )}{' '}
                                        -{' '}
                                        {assignment.shift?.endTime.substring(
                                          0,
                                          5
                                        )}
                                        )
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              {workday.assignments?.[0]?.task && (
                                <p className="text-sm text-muted-foreground ml-6">
                                  Công việc: {workday.assignments[0].task}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                workday.status === 'Completed'
                                  ? 'default'
                                  : workday.status === 'Active'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {workday.status || 'Pending'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Vui lòng chọn chi nhánh và khoảng thời gian để xem lịch làm việc
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
