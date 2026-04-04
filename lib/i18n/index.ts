import { getRequestConfig } from "next-intl/server"
import { DEFAULT_LOCALE, type Locale } from "./locales"

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = (locale || DEFAULT_LOCALE) as Locale

  return {
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  }
})
