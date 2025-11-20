'use client'

import { GoogleLoginButton } from '@/components/google-login-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { authToken, userInfo } from '@/lib/auth'
import { authService } from '@/services/authService'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'

export default function LoginPage() {
  const t = useTranslations('login')
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })

      if (response.success && response.token) {
        authToken.set(response.token)

        // Get role from JWT token
        const role = authToken.getRole()

        userInfo.set({
          userId: response.userId,
          userName: response.userName,
          email: response.email,
          role: role,
        })

        toast({
          title: 'Đăng nhập thành công!',
          description: `Chào mừng ${response.userName || response.email}`,
          variant: 'success',
        })

        // Redirect theo role (case-insensitive)
        const userRole = (role || '').toLowerCase()
        const redirectPath =
          userRole === 'manager' || userRole === 'admin'
            ? '/admin'
            : userRole === 'staff'
            ? '/staff'
            : '/dashboard'

        setTimeout(() => {
          router.push(redirectPath)
        }, 500)
      } else {
        toast({
          title: 'Đăng nhập thất bại',
          description: 'Vui lòng kiểm tra lại thông tin đăng nhập',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Lỗi đăng nhập',
        description: err.message || 'Có lỗi xảy ra khi đăng nhập',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: 'Mật khẩu không khớp',
        description: 'Vui lòng kiểm tra lại mật khẩu xác nhận',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(' ')
      const lastName = lastNameParts.join(' ') || firstName

      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        phone,
      })

      if (response.success && response.token) {
        authToken.set(response.token)

        // Get role from JWT token
        const role = authToken.getRole()

        userInfo.set({
          userId: response.userId,
          userName: response.userName,
          email: response.email,
          role: role,
        })

        toast({
          title: 'Đăng ký thành công!',
          description: 'Tài khoản của bạn đã được tạo thành công',
          variant: 'success',
        })

        // Redirect theo role (mặc định user mới là Customer)
        const userRole = (role || '').toLowerCase()
        const redirectPath =
          userRole === 'manager' || userRole === 'admin'
            ? '/admin'
            : userRole === 'staff'
            ? '/staff'
            : '/dashboard'

        setTimeout(() => {
          router.push(redirectPath)
        }, 500)
      } else {
        toast({
          title: 'Đăng ký thất bại',
          description: 'Vui lòng kiểm tra lại thông tin đăng ký',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      toast({
        title: 'Lỗi đăng ký',
        description: err.message || 'Có lỗi xảy ra khi đăng ký',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="hidden lg:flex lg:w-[55%] relative p-12 flex-col justify-between">
        {/* Background with vehicle images */}
        <div className="absolute inset-0">
          <Image
            src="/vinfast-vf-8-electric-suv.jpg"
            alt="VinFast VF 8"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-green-900/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t('backToHome')}</span>
          </Link>

          <div className="space-y-6 max-w-xl">
            <div className="flex gap-2 items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Sparkles className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium text-white">
                  {t('badge')}
                </span>
              </div>
            </div>

            <h1 className="text-6xl font-bold text-white leading-tight tracking-tight">
              {t('welcome')}
              <br />
              <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                EV Station
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all">
            <Clock className="w-8 h-8 text-green-300 mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {t('features.quickBooking.time')}
            </div>
            <div className="text-sm text-blue-100">
              {t('features.quickBooking.label')}
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all">
            <Zap className="w-8 h-8 text-yellow-300 mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {t('features.vehicles.count')}
            </div>
            <div className="text-sm text-blue-100">
              {t('features.vehicles.label')}
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all">
            <Shield className="w-8 h-8 text-blue-300 mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {t('features.support.time')}
            </div>
            <div className="text-sm text-blue-100">
              {t('features.support.label')}
            </div>
          </Card>
        </div>

        <div className="absolute top-1/4 right-12 w-72 h-72 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-1 lg:pt-2 relative z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-100/20 rounded-full blur-2xl" />
        </div>

        <div className="w-full max-w-2xl relative">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                EV Station
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-green-100/50 rounded-full blur-2xl -translate-y-16 translate-x-16" />

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        {activeTab === 'login' ? t('title') : t('signUp')}
                      </span>
                    </span>
                    <span className="mt-2 block h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-green-500" />
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-gray-600"
                  >
                    {t('description')}
                  </motion.p>
                </div>

                {/* Tabs */}
                <Tabs
                  defaultValue="login"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="login" className="flex-1">
                      {t('signIn')}
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex-1">
                      {t('signUp')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-4 space-y-6">
                    <motion.form
                      onSubmit={handleLogin}
                      className="space-y-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t('email')}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-14 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t('password')}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-14 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-base"
                            required
                          />
                          <button
                            type="button"
                            aria-label={
                              showPassword
                                ? t('hidePassword')
                                : t('showPassword')
                            }
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-3.5 p-2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="remember"
                            className="text-sm text-gray-700 font-medium"
                          >
                            {t('remember')}
                          </label>
                        </div>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          {t('forgotPassword')}
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:from-blue-700 hover:via-blue-600 hover:to-green-600 text-white font-semibold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-[1.02]"
                        disabled={isLoading}
                      >
                        {isLoading ? t('signingIn') : t('signIn')}
                      </Button>
                    </motion.form>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500 font-medium">
                          {t('orContinueWith')}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <GoogleLoginButton />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="register" className="mt-4 space-y-6">
                    <motion.form
                      onSubmit={handleRegister}
                      className="space-y-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t('fullName')}
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="Nguyen Van A"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-14"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="emailReg"
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t('email')}
                        </Label>
                        <Input
                          id="emailReg"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-14"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Số điện thoại
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0123456789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-14"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="passwordReg"
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t('password')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="passwordReg"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 pr-12"
                            required
                          />
                          <button
                            type="button"
                            aria-label={
                              showPassword
                                ? t('hidePassword')
                                : t('showPassword')
                            }
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-3.5 p-2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-semibold text-gray-700"
                        >
                          {t('confirmPassword')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-14 pr-12"
                            required
                          />
                          <button
                            type="button"
                            aria-label={
                              showConfirmPassword
                                ? t('hidePassword')
                                : t('showPassword')
                            }
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-3.5 p-2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-base shadow-lg transition-all hover:scale-[1.02]"
                        disabled={isLoading}
                      >
                        {isLoading ? t('signingUp') : t('signUp')}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
