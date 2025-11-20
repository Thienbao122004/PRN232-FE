import { type NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales } from './i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Locale handling
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  const acceptLanguage = request.headers.get('Accept-Language')

  let locale = localeCookie || defaultLocale

  // If no cookie, try to detect from Accept-Language header
  if (!localeCookie && acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0]
    if (locales.includes(preferredLocale as any)) {
      locale = preferredLocale
    }
  }

  // Role-based access control
  const token = request.cookies.get('token')?.value
  const userInfoCookie = request.cookies.get('user')?.value

  let userRole: string | null = null
  if (userInfoCookie) {
    try {
      const userInfo = JSON.parse(decodeURIComponent(userInfoCookie))
      userRole = userInfo.role ? userInfo.role.toLowerCase() : null
    } catch (e) {
      // Invalid user info
    }
  }

  // Check if accessing protected admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (userRole !== 'manager' && userRole !== 'admin') {
      // Not authorized, redirect to appropriate dashboard
      const redirectPath = userRole === 'staff' ? '/staff' : '/dashboard'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // Check if accessing protected staff routes
  if (pathname.startsWith('/staff')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (
      userRole !== 'staff' &&
      userRole !== 'manager' &&
      userRole !== 'admin'
    ) {
      const redirectPath =
        userRole === 'manager' || userRole === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-locale', locale)

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
