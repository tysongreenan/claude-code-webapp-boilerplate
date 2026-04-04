"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"
import { DEFAULT_LOCALE, type Locale, isRTL } from "./locales"

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
}>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
})

export function useLocale() {
  return useContext(LocaleContext)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [messages, setMessages] = useState<any>(null)

  useEffect(() => {
    // Load saved locale from localStorage
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved) {
      setLocaleState(saved)
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.split("-")[0] as Locale
      const supported = Object.keys(require("./locales").LOCALES)
      if (supported.includes(browserLang)) {
        setLocaleState(browserLang)
      }
    }
  }, [])

  useEffect(() => {
    // Load messages for current locale
    import(`../../messages/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() => import("../../messages/en.json").then((mod) => setMessages(mod.default)))

    // Set dir attribute for RTL
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  if (!messages) return null

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
