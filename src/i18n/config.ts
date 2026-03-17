// Language configuration and utilities

export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr' as const,
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr' as const,
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr' as const,
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr' as const,
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr' as const,
  },
} as const

export type Locale = keyof typeof languages

export const defaultLocale: Locale = 'en'

export const locales = Object.keys(languages) as Locale[]

// Get language from Accept-Language header
export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase())

  for (const lang of languages) {
    if (locales.includes(lang as Locale)) {
      return lang as Locale
    }
  }

  return defaultLocale
}

// Format number according to locale
export function formatNumber(value: number, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ru: 'ru-RU',
  }
  
  return new Intl.NumberFormat(localeMap[locale]).format(value)
}

// Format currency according to locale
export function formatCurrency(value: number, locale: Locale, currency: string = 'USD'): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ru: 'ru-RU',
  }
  
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format date according to locale
export function formatDate(date: Date | string, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ru: 'ru-RU',
  }
  
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}
