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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { shiftService } from '@/services/workforceService'
import type { CreateShiftRequest, Shift } from '@/types/workforce'
import { Clock, Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ShiftManagementPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [formData, setFormData] = useState<CreateShiftRequest>({
    shiftName: '',
    startTime: '',
    endTime: '',
  })

  useEffect(() => {
    loadShifts()
  }, [])

  const loadShifts = async () => {
    try {
      setLoading(true)
      const data = await shiftService.getAllShifts()
      setShifts(data)
    } catch (error) {
      toast.error('Không thể tải danh sách ca làm việc')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await shiftService.createShift(formData)
      toast.success('Tạo ca làm việc thành công')
      setIsCreateDialogOpen(false)
      setFormData({ shiftName: '', startTime: '', endTime: '' })
      loadShifts()
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo ca làm việc')
    }
  }

  const handleUpdateShift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShift) return

    try {
      await shiftService.updateShift(editingShift.shiftId, formData)
      toast.success('Cập nhật ca làm việc thành công')
      setEditingShift(null)
      setFormData({ shiftName: '', startTime: '', endTime: '' })
      loadShifts()
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật ca làm việc')
    }
  }

  const handleDeleteShift = async (shiftId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ca làm việc này?')) return

    try {
      await shiftService.deleteShift(shiftId)
      toast.success('Xóa ca làm việc thành công')
      loadShifts()
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa ca làm việc')
    }
  }

  const openEditDialog = (shift: Shift) => {
    setEditingShift(shift)
    setFormData({
      shiftName: shift.shiftName,
      startTime: shift.startTime,
      endTime: shift.endTime,
    })
  }

  const formatTime = (time: string) => {
    // Convert "HH:mm:ss" to "HH:mm"
    return time.substring(0, 5)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Ca Làm Việc</h1>
          <p className="text-muted-foreground">
            Quản lý các ca làm việc trong hệ thống
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Ca Mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo Ca Làm Việc Mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateShift} className="space-y-4">
              <div>
                <Label htmlFor="shiftName">Tên Ca *</Label>
                <Input
                  id="shiftName"
                  value={formData.shiftName}
                  onChange={(e) =>
                    setFormData({ ...formData, shiftName: e.target.value })
                  }
                  placeholder="VD: Ca Sáng"
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Giờ Bắt Đầu *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startTime: e.target.value + ':00',
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Giờ Kết Thúc *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endTime: e.target.value + ':00',
                    })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Tạo Ca Làm Việc
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingShift}
        onOpenChange={(open) => !open && setEditingShift(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Ca Làm Việc</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateShift} className="space-y-4">
            <div>
              <Label htmlFor="edit-shiftName">Tên Ca *</Label>
              <Input
                id="edit-shiftName"
                value={formData.shiftName}
                onChange={(e) =>
                  setFormData({ ...formData, shiftName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-startTime">Giờ Bắt Đầu *</Label>
              <Input
                id="edit-startTime"
                type="time"
                value={formatTime(formData.startTime)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startTime: e.target.value + ':00',
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-endTime">Giờ Kết Thúc *</Label>
              <Input
                id="edit-endTime"
                type="time"
                value={formatTime(formData.endTime)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endTime: e.target.value + ':00',
                  })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Cập Nhật
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Danh Sách Ca Làm Việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có ca làm việc nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Ca</TableHead>
                  <TableHead>Giờ Bắt Đầu</TableHead>
                  <TableHead>Giờ Kết Thúc</TableHead>
                  <TableHead>Thời Lượng</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => {
                  const duration = calculateDuration(
                    shift.startTime,
                    shift.endTime
                  )
                  return (
                    <TableRow key={shift.shiftId}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{shift.shiftName}</Badge>
                      </TableCell>
                      <TableCell>{formatTime(shift.startTime)}</TableCell>
                      <TableCell>{formatTime(shift.endTime)}</TableCell>
                      <TableCell>{duration}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(shift)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteShift(shift.shiftId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function calculateDuration(startTime: string, endTime: string): string {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  const duration = endMinutes - startMinutes

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
}
