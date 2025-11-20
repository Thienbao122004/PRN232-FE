'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  Eye,
  Plus,
  Settings,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

export default function StaffSchedulePage() {
  const menuItems = [
    {
      title: 'Quản Lý Ca Làm Việc',
      description: 'Tạo, chỉnh sửa, xóa các ca làm việc trong hệ thống',
      icon: Clock,
      href: '/admin/staff/schedule/shifts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Phân Công Lịch Làm Việc',
      description: 'Phân công ca làm việc cho nhân viên theo chi nhánh',
      icon: Calendar,
      href: '/admin/staff/schedule/assign',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Lịch Chi Nhánh',
      description: 'Xem tổng quan lịch làm việc của toàn chi nhánh',
      icon: Building2,
      href: '/admin/staff/schedule/branch',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Lịch Nhân Viên',
      description: 'Xem lịch làm việc cụ thể của từng nhân viên',
      icon: Users,
      href: '/admin/staff/schedule/staff',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  const quickActions = [
    {
      label: 'Tạo Ca Mới',
      icon: Plus,
      href: '/admin/staff/schedule/shifts',
      variant: 'default' as const,
    },
    {
      label: 'Phân Công Ngay',
      icon: Calendar,
      href: '/admin/staff/schedule/assign',
      variant: 'secondary' as const,
    },
    {
      label: 'Xem Lịch Hôm Nay',
      icon: Eye,
      href: '/admin/staff/schedule/branch',
      variant: 'outline' as const,
    },
  ]

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
              <Button variant="outline">Về trang chủ Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Quản Lý Lịch Làm Việc</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý ca làm việc và phân công nhân viên một cách hiệu quả
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Thao Tác Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button variant={action.variant} size="lg">
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Menu Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="mt-4">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Tính Năng Chính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Quản Lý Ca Linh Hoạt</h4>
                  <p className="text-sm text-muted-foreground">
                    Tạo và quản lý các ca làm việc với thời gian tùy chỉnh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Calendar className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium">Phân Công Hàng Loạt</h4>
                  <p className="text-sm text-muted-foreground">
                    Phân công nhiều ngày làm việc cho nhân viên cùng lúc
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Building2 className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium">Quản Lý Theo Chi Nhánh</h4>
                  <p className="text-sm text-muted-foreground">
                    Xem và quản lý lịch làm việc theo từng chi nhánh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Users className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium">Theo Dõi Nhân Viên</h4>
                  <p className="text-sm text-muted-foreground">
                    Xem lịch làm việc chi tiết của từng nhân viên
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Bắt Đầu Sử Dụng</CardTitle>
            <CardDescription>
              Hướng dẫn nhanh để bắt đầu quản lý lịch làm việc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Thiết lập ca làm việc</p>
                <p className="text-sm text-muted-foreground">
                  Tạo các ca làm việc (sáng, chiều, tối) trong phần{' '}
                  <Link
                    href="/admin/staff/schedule/shifts"
                    className="text-primary hover:underline"
                  >
                    Quản Lý Ca Làm Việc
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Phân công nhân viên</p>
                <p className="text-sm text-muted-foreground">
                  Sử dụng{' '}
                  <Link
                    href="/admin/staff/schedule/assign"
                    className="text-primary hover:underline"
                  >
                    Phân Công Lịch Làm Việc
                  </Link>{' '}
                  để gán ca cho nhân viên
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Theo dõi và điều chỉnh</p>
                <p className="text-sm text-muted-foreground">
                  Xem lịch qua{' '}
                  <Link
                    href="/admin/staff/schedule/branch"
                    className="text-primary hover:underline"
                  >
                    Lịch Chi Nhánh
                  </Link>{' '}
                  và điều chỉnh khi cần
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
