'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      {/* Top Accent Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 bg-orange-500 flex items-center justify-center">
                <span className="text-white font-extrabold text-lg tracking-tighter">S</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white tracking-tight leading-none">SUNMAY</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] leading-none mt-0.5">Outdoor</span>
              </div>
            </Link>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              {t('site.tagline')}
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:info@sunmay.com" className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 transition-colors">
                <Mail className="w-4 h-4" />
                info@sunmay.com
              </a>
              <a href="tel:+8613913996748" className="flex items-center gap-2 text-neutral-500 hover:text-orange-500 transition-colors">
                <Phone className="w-4 h-4" />
                +86 139 1399 6748
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">
              {t('footer.products')}
            </h3>
            <ul className="space-y-3 text-sm">
              {['Ski Jackets', 'Hunting Gear', 'Tactical Wear', 'Outdoor Jackets', 'Pants & Bibs'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/products/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-neutral-500 hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/factory" className="text-neutral-500 hover:text-white transition-colors">{t('nav.factory')}</Link></li>
              <li><Link href="/contact" className="text-neutral-500 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link href="/wholesale" className="text-neutral-500 hover:text-white transition-colors">{t('nav.wholesale')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/size-chart" className="text-neutral-500 hover:text-white transition-colors">{t('footer.sizeChart')}</Link></li>
              <li><Link href="/shipping" className="text-neutral-500 hover:text-white transition-colors">{t('footer.shipping')}</Link></li>
              <li><Link href="/payment" className="text-neutral-500 hover:text-white transition-colors">{t('footer.payment')}</Link></li>
              <li><Link href="/faq" className="text-neutral-500 hover:text-white transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">
              {t('contact.address')}
            </h3>
            <div className="flex items-start gap-2 text-sm text-neutral-500">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
              <div className="leading-relaxed">
                Nanjing, Jiangsu Province, China<br />
                Myanmar Factory: Yangon, Myanmar
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
