"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle, XCircle, Search, FileText, CreditCard, Loader2, User } from "lucide-react"
import Link from "next/link"
import { userService, type UserProfileResponse, type VerificationStatusResponse } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api-config"

// Helper để tạo full URL cho image
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_CONFIG.USER_SERVICE_URL}/${path}`;
}

export default function VerificationPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatusResponse | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập User ID",
      })
      return
    }

    setIsSearching(true)
    try {
      const profileResponse = await userService.getProfileById(searchQuery)
      if (profileResponse.success && profileResponse.data) {
        setUserProfile(profileResponse.data)
      }

      const statusResponse = await userService.getVerificationStatus(searchQuery)
      if (statusResponse.success && statusResponse.data) {
        setVerificationStatus(statusResponse.data)
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tìm người dùng",
      })
      setUserProfile(null)
      setVerificationStatus(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleVerify = async () => {
    if (!searchQuery) return

    if (!confirm("Bạn có chắc muốn xác thực người dùng này?")) return

    setIsVerifying(true)
    try {
      await userService.verifyUser(searchQuery)
      
      toast({
        title: "Thành công!",
        description: "Đã xác thực người dùng",
      })
      
      const statusResponse = await userService.getVerificationStatus(searchQuery)
      if (statusResponse.success && statusResponse.data) {
        setVerificationStatus(statusResponse.data)
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xác thực người dùng",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/staff" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EV Station
            </span>
          </Link>
          <Link href="/staff">
            <Button variant="ghost">Quay lại Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Xác thực khách hàng</h1>
          <p className="text-muted-foreground text-lg">Kiểm tra giấy tờ và thông tin khách hàng</p>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Tìm kiếm khách hàng</CardTitle>
            <CardDescription>Nhập User ID để xác thực</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập User ID (GUID)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 w-4 h-4" />
                    Tìm kiếm
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        {userProfile && (
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin khách hàng</CardTitle>
                    <CardDescription>User ID: {userProfile.userId}</CardDescription>
                  </div>
                  <Badge className={userProfile.isVerified ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                    {userProfile.isVerified ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã xác thực
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Chưa xác thực
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Họ và tên</Label>
                    <div className="font-medium">{userProfile.fullName}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Số điện thoại</Label>
                    <div className="font-medium">{userProfile.phoneNumber || "N/A"}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="font-medium">{userProfile.email}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Ngày sinh</Label>
                    <div className="font-medium">{formatDate(userProfile.dateOfBirth)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Địa chỉ</Label>
                  <div className="font-medium">{userProfile.address || "N/A"}</div>
                </div>

                {/* <div className="space-y-2">
                  <Label className="text-muted-foreground">Ngày đăng ký</Label>
                  <div className="font-medium">{formatDate(userProfile.createdAt)}</div>
                </div> */}
              </CardContent>
            </Card>

            {/* ID Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <CardTitle>CMND/CCCD</CardTitle>
                  </div>
                  {verificationStatus?.cccdVerified ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã xác thực
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white">
                      <XCircle className="w-3 h-3 mr-1" />
                      Chưa xác thực
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Số CMND/CCCD</Label>
                  <div className="font-medium">{userProfile.cccdNumber || "Chưa cung cấp"}</div>
                </div>

                {userProfile.cccdImageUrl ? (
                  <div className="space-y-3">
                    <img 
                      src={userProfile.cccdImageUrl} 
                      alt="ID Card" 
                      className="w-full rounded-lg border"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(userProfile.cccdImageUrl, '_blank')}
                    >
                      Xem ảnh gốc
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Chưa có ảnh CMND/CCCD</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Actions */}
            <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Khách hàng đã được xác thực đầy đủ</h3>
                    <p className="text-sm text-muted-foreground">
                      Tất cả giấy tờ đã được kiểm tra và xác nhận hợp lệ. Khách hàng có thể thuê xe.
                    </p>
                  </div>
                </div>

                {!userProfile.isVerified && (
                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      onClick={handleVerify}
                      disabled={isVerifying || !userProfile.cccdNumber}
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                    >
                      <CheckCircle className="mr-2 w-4 h-4" />
                      {isVerifying ? "Đang xác thực..." : "Xác thực người dùng"}
                    </Button>
                  </div>
                )}
                
                {userProfile.isVerified && verificationStatus && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Đã xác thực</span>
                    </div>
                    {verificationStatus.verifiedAt && (
                      <div className="text-sm text-muted-foreground">
                        Xác thực lúc: {formatDate(verificationStatus.verifiedAt)}
                      </div>
                    )}
                    {verificationStatus.verifiedBy && (
                      <div className="text-sm text-muted-foreground">
                        Xác thực bởi: {verificationStatus.verifiedBy}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
