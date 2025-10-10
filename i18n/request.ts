import { getRequestConfig } from "next-intl/server"
import { cookies, headers } from "next/headers"
import { defaultLocale, locales } from "./config"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headersList = await headers()

  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value
  const localeHeader = headersList.get("x-locale")

  let locale = localeCookie || localeHeader || defaultLocale

  if (!locales.includes(locale as any)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
