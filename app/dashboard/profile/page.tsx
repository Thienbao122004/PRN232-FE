"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, User, Upload, CheckCircle, Camera, FileText, CreditCard, Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { userService } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api-config"

// Helper để tạo full URL cho image
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Remove leading slash nếu có để tránh double slash
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${API_CONFIG.USER_SERVICE_URL}/${cleanPath}`;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  
  const [userProfile, setUserProfile] = useState({
    userId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    avatar: "",
    cccdNumber: "",
    cccdImageUrl: "",
    isVerified: false,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const response = await userService.getCurrentProfile()
      if (response.success && response.data) {
        setUserProfile({
          userId: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
          dateOfBirth: response.data.dateOfBirth || "",
          avatar: getImageUrl(response.data.avatarUrl),
          cccdNumber: response.data.cccdNumber || "",
          cccdImageUrl: getImageUrl(response.data.cccdImageUrl),
          isVerified: response.data.isVerified,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải hồ sơ",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await userService.updateProfile({
        fullName: userProfile.fullName,
        phoneNumber: userProfile.phoneNumber,
        address: userProfile.address,
        dateOfBirth: userProfile.dateOfBirth,
        cccdNumber: userProfile.cccdNumber,
      })

      if (response.success) {
        toast({
          title: "Thành công!",
          description: "Đã cập nhật hồ sơ",
        })
        setIsEditing(false)
        loadProfile()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật hồ sơ",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await userService.uploadDocument("Avatar", file)
      if (response.success) {
        toast({
          title: "Thành công!",
          description: "Đã cập nhật ảnh đại diện",
        })
        loadProfile()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải ảnh lên",
      })
    }
  }

  const handleCCCDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await userService.uploadDocument("CCCD", file)
      if (response.success) {
        toast({
          title: "Thành công!",
          description: "Đã tải lên ảnh CMND/CCCD",
        })
        loadProfile()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải ảnh lên",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
              {userProfile.avatar ? (
                <img 
                  src={userProfile.avatar}
                  alt={userProfile.fullName}
                  className="w-9 h-9 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-sm font-medium hidden md:block">{userProfile.fullName || "Người dùng"}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Hồ sơ cá nhân
                </h1>
                <p className="text-muted-foreground text-lg">Quản lý thông tin và giấy tờ của bạn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="relative inline-block mb-4">
                      {userProfile.avatar ? (
                        <img 
                          src={userProfile.avatar} 
                          alt="Avatar" 
                          className="w-24 h-24 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-background cursor-pointer hover:bg-gray-50">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    </div>

                    <h2 className="text-xl font-bold mb-1">{userProfile.fullName}</h2>
                    <p className="text-muted-foreground mb-4">{userProfile.email}</p>

                    {userProfile.isVerified ? (
                      <Badge className="bg-green-50 text-green-700 mb-4">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mb-4">
                        Chưa xác thực
                      </Badge>
                    )}

                    <div className="text-sm text-muted-foreground">
                      User ID: {userProfile.userId}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin của bạn</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="bg-transparent">
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input 
                          id="fullName" 
                          value={userProfile.fullName} 
                          onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
                          disabled={!isEditing} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input 
                          id="phoneNumber" 
                          value={userProfile.phoneNumber} 
                          onChange={(e) => setUserProfile({...userProfile, phoneNumber: e.target.value})}
                          disabled={!isEditing} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={userProfile.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input 
                        id="address" 
                        value={userProfile.address} 
                        onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                        disabled={!isEditing} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                      <Input 
                        id="dateOfBirth" 
                        type="date"
                        value={userProfile.dateOfBirth?.split('T')[0] || ''} 
                        onChange={(e) => setUserProfile({...userProfile, dateOfBirth: e.target.value})}
                        disabled={!isEditing} 
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Lưu thay đổi
                            </>
                          )}
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsEditing(false)}>
                          Hủy
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Giấy tờ xác thực</CardTitle>
                <CardDescription>Quản lý CMND/CCCD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CCCD */}
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">CMND/CCCD</div>
                        {userProfile.cccdNumber && (
                          <div className="text-sm text-muted-foreground">
                            Số: {userProfile.cccdNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    {userProfile.cccdImageUrl ? (
                      <Badge className="bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã tải lên
                      </Badge>
                    ) : (
                      <Badge variant="outline">Chưa có</Badge>
                    )}
                  </div>

                  {isEditing && (
                    <div className="space-y-2 mb-3">
                      <Label htmlFor="cccdNumber">Số CMND/CCCD</Label>
                      <Input 
                        id="cccdNumber" 
                        value={userProfile.cccdNumber} 
                        onChange={(e) => setUserProfile({...userProfile, cccdNumber: e.target.value})}
                        placeholder="Nhập số CCCD"
                      />
                    </div>
                  )}

                  {userProfile.cccdImageUrl && (
                    <img 
                      src={userProfile.cccdImageUrl} 
                      alt="CCCD" 
                      className="w-full rounded-lg mb-3"
                    />
                  )}

                  <div className="flex gap-2">
                    <label className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <span>
                          <Upload className="mr-2 w-4 h-4" />
                          {userProfile.cccdImageUrl ? "Đổi ảnh" : "Tải lên ảnh"}
                        </span>
                      </Button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleCCCDUpload}
                      />
                    </label>
                    {userProfile.cccdImageUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(userProfile.cccdImageUrl, '_blank')}
                      >
                        Xem chi tiết
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Tài khoản đã được xác thực</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Tài khoản của bạn đã được xác thực đầy đủ. Bạn có thể thuê xe tại bất kỳ điểm thuê nào.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Giấy phép lái xe
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        CMND/CCCD
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Email
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Số điện thoại
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
