'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n, locales, Locale } from '@/i18n'
import { CartButton } from '@/components/cart/CartButton'

const languageNames: Record<Locale, string> = {
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  ru: 'RU',
}

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const navigation = [
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.wholesale'), href: '/wholesale' },
    { name: t('nav.factory'), href: '/factory' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
      {/* Top Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-orange-500 via-orange-500 to-transparent" />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-orange-500 flex items-center justify-center">
              <span className="text-white font-extrabold text-lg tracking-tighter">S</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-white tracking-tight leading-none">SUNMAY</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] leading-none mt-0.5">Outdoor</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <CartButton />

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="font-mono text-xs">{languageNames[locale]}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", langMenuOpen && "rotate-180")} />
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-neutral-800 border border-neutral-700 py-1 min-w-[80px]">
                  {locales.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLocale(lang)
                        setLangMenuOpen(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm font-mono transition-colors",
                        locale === lang
                          ? "text-orange-500 bg-neutral-700"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-700"
                      )}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/quote"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-xs font-semibold uppercase tracking-wider hover:bg-orange-600 transition-colors"
            >
              {t('nav.quote')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 uppercase tracking-wider text-sm"
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-3 border-t border-neutral-800 mt-2">
                <div className="flex flex-wrap gap-2">
                  {locales.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLocale(lang)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-mono transition-colors",
                        locale === lang
                          ? "bg-orange-500 text-white"
                          : "border border-neutral-600 text-neutral-400 hover:border-neutral-500"
                      )}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              </div>
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 text-center px-4 py-3 bg-orange-500 text-white font-semibold uppercase tracking-wider text-sm"
              >
                {t('nav.quote')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
