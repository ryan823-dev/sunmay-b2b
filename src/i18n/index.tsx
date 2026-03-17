'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from './locales/en.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import ru from './locales/ru.json'

type Locale = 'en' | 'de' | 'fr' | 'es' | 'ru'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const locales: Locale[] = ['en', 'de', 'fr', 'es', 'ru']

// Helper to extract translations from JSON (handles both formats)
function extractTranslations(data: unknown, locale: Locale): Record<string, unknown> {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>
    // If file has outer language key, extract it
    if (obj[locale] && typeof obj[locale] === 'object') {
      return obj[locale] as Record<string, unknown>
    }
    // Otherwise use the file directly
    return obj
  }
  return {}
}

// Static translations
const translations: Record<Locale, Record<string, unknown>> = {
  en: extractTranslations(en, 'en'),
  de: extractTranslations(de, 'de'),
  fr: extractTranslations(fr, 'fr'),
  es: extractTranslations(es, 'es'),
  ru: extractTranslations(ru, 'ru'),
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Return the key if not found
    }
  }
  
  return typeof current === 'string' ? current : path
}

export function I18nProvider({ children, defaultLocale = 'en' }: { children: ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Check localStorage for saved locale
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && locales.includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string): string => {
    const translation = getNestedValue(translations[locale], key)
    if (translation !== key) return translation
    
    // Fallback to English
    return getNestedValue(translations.en, key)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export { locales }
export type { Locale }
