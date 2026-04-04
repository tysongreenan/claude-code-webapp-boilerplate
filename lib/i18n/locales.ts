/**
 * Supported locales — top 10 global languages
 */

export const LOCALES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
} as const

export type Locale = keyof typeof LOCALES
export const DEFAULT_LOCALE: Locale = "en"
export const RTL_LOCALES: Locale[] = ["ar"]

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale)
}
