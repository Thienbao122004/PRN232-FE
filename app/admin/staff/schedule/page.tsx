"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Plus,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function StaffSchedulePage() {
  const [selectedWeek, setSelectedWeek] = useState("current")
  const [selectedStation, setSelectedStation] = useState("all")

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]
  const shifts = ["Sáng (7-15h)", "Chiều (15-23h)", "Tối (23-7h)"]

  const staff = [
    { id: "ST-001", name: "Trần Văn B", station: "Quận 1", role: "Nhân viên" },
    { id: "ST-002", name: "Nguyễn Thị C", station: "Quận 1", role: "Trưởng điểm" },
    { id: "ST-003", name: "Lê Văn D", station: "Quận 3", role: "Nhân viên" },
    { id: "ST-004", name: "Phạm Thị E", station: "Quận 3", role: "Nhân viên" },
  ]

  const schedule = {
    "Quận 1": {
      "Thứ 2": {
        "Sáng (7-15h)": ["ST-001", "ST-002"],
        "Chiều (15-23h)": ["ST-002"],
        "Tối (23-7h)": ["ST-001"],
      },
      "Thứ 3": {
        "Sáng (7-15h)": ["ST-001"],
        "Chiều (15-23h)": ["ST-002"],
        "Tối (23-7h)": [],
      },
    },
    "Quận 3": {
      "Thứ 2": {
        "Sáng (7-15h)": ["ST-003", "ST-004"],
        "Chiều (15-23h)": ["ST-003"],
        "Tối (23-7h)": ["ST-004"],
      },
      "Thứ 3": {
        "Sáng (7-15h)": ["ST-003"],
        "Chiều (15-23h)": [],
        "Tối (23-7h)": ["ST-004"],
      },
    },
  }

  const alerts = [
    {
      station: "Quận 3",
      day: "Thứ 3",
      shift: "Chiều (15-23h)",
      issue: "Thiếu nhân viên",
      severity: "high",
    },
    {
      station: "Quận 1",
      day: "Thứ 3",
      shift: "Tối (23-7h)",
      issue: "Chưa phân ca",
      severity: "medium",
    },
  ]

  const getStaffName = (id: string) => {
    return staff.find((s) => s.id === id)?.name || "N/A"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/admin/staff">
              <Button variant="ghost">Quản lý nhân viên</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Quản lý ca làm việc
          </h1>
          <p className="text-gray-600 text-lg">Lập lịch và phân ca cho nhân viên tại các điểm</p>
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Tuần này</SelectItem>
                <SelectItem value="next">Tuần sau</SelectItem>
                <SelectItem value="custom">Tùy chỉnh...</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Chọn điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả điểm</SelectItem>
                <SelectItem value="Quận 1">Quận 1</SelectItem>
                <SelectItem value="Quận 3">Quận 3</SelectItem>
                <SelectItem value="Quận 7">Quận 7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white">
            <Plus className="mr-2 w-4 h-4" />
            Tạo lịch mới
          </Button>
        </motion.div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <CardTitle>Cảnh báo lịch làm việc</CardTitle>
                </div>
                <CardDescription>Các vấn đề cần xử lý</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      alert.severity === "high"
                        ? "bg-red-50 border-l-red-500"
                        : "bg-yellow-50 border-l-yellow-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="font-bold text-gray-900">{alert.station}</span>
                          <span className="text-gray-600">•</span>
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900">{alert.day}</span>
                          <span className="text-gray-600">•</span>
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900">{alert.shift}</span>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            alert.severity === "high" ? "text-red-700" : "text-yellow-700"
                          }`}
                        >
                          {alert.issue}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                      >
                        Xử lý
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Schedule Grid */}
        {Object.entries(schedule).map(([station, stationSchedule]) => {
          if (selectedStation !== "all" && selectedStation !== station) return null

          return (
            <motion.div
              key={station}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6"
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <CardTitle>Điểm thuê {station}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold text-gray-700">Ca làm việc</th>
                          {weekDays.slice(0, 2).map((day) => (
                            <th key={day} className="text-center p-3 font-semibold text-gray-700">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {shifts.map((shift) => (
                          <tr key={shift} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{shift}</span>
                              </div>
                            </td>
                            {weekDays.slice(0, 2).map((day) => {
                              const staffIds = (stationSchedule as Record<string, Record<string, string[]>>)[day]?.[shift] || []
                              return (
                                <td key={day} className="p-3">
                                  <div className="flex flex-col gap-2">
                                    {staffIds.length > 0 ? (
                                      staffIds.map((id) => (
                                        <div
                                          key={id}
                                          className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200"
                                        >
                                          <Users className="w-4 h-4 text-blue-600" />
                                          <span className="text-sm font-medium text-gray-900">
                                            {getStaffName(id)}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <button className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm text-gray-500 hover:text-blue-600">
                                        + Thêm nhân viên
                                      </button>
                                    )}
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}

        {/* Staff Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Tổng hợp nhân viên</CardTitle>
              <CardDescription>Số ca làm việc trong tuần</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {staff.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.station}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-xs text-gray-600">ca/tuần</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

