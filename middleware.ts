import { type NextRequest, NextResponse } from "next/server"
import { defaultLocale, locales } from "./i18n/config"

export function middleware(request: NextRequest) {
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value
  const acceptLanguage = request.headers.get("Accept-Language")

  let locale = localeCookie || defaultLocale

  // If no cookie, try to detect from Accept-Language header
  if (!localeCookie && acceptLanguage) {
    const preferredLocale = acceptLanguage.split(",")[0].split("-")[0]
    if (locales.includes(preferredLocale as any)) {
      locale = preferredLocale
    }
  }

  const response = NextResponse.next()
  response.headers.set("x-locale", locale)

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
