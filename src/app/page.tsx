'use client'

import Link from 'next/link'
import { AIHero } from '@/components/ai/AIHero'
import { useI18n } from '@/i18n'
import { 
  Factory, Users, ShieldCheck, Truck, 
  MountainSnow, Target, Building2, ArrowRight,
  Droplets, Wind, Thermometer
} from 'lucide-react'

const sampleProducts = [
  {
    id: '1',
    name: 'Pro Mountain Ski Jacket',
    slug: 'pro-mountain-ski-jacket',
    category: 'Ski Jackets',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75f7846?w=400',
    moq: 200,
    colors: 8,
  },
  {
    id: '2',
    name: 'Tactical Hunting Jacket',
    slug: 'tactical-hunting-jacket',
    category: 'Hunting Gear',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
    moq: 200,
    colors: 6,
  },
  {
    id: '3',
    name: 'Waterproof Snow Pants',
    slug: 'waterproof-snow-pants',
    category: 'Pants & Bibs',
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400',
    moq: 200,
    colors: 5,
  },
  {
    id: '4',
    name: 'Insulated Down Jacket',
    slug: 'insulated-down-jacket',
    category: 'Down Jackets',
    image: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=400',
    moq: 200,
    colors: 10,
  },
]

export default function HomePage() {
  const { t } = useI18n()

  const categories = [
    { name: t('home.categories.ski'), icon: MountainSnow, slug: 'ski-snowboard', count: 120 },
    { name: t('home.categories.hunting'), icon: Target, slug: 'hunting-outdoor', count: 85 },
    { name: t('home.categories.tactical'), icon: ShieldCheck, slug: 'tactical-workwear', count: 60 },
    { name: t('home.categories.urban'), icon: Building2, slug: 'urban-outdoor', count: 45 },
  ]

  const whyUs = [
    { icon: Factory, title: t('home.whyUs.experienceTitle'), desc: t('home.whyUs.experienceDesc') },
    { icon: Users, title: t('home.whyUs.workersTitle'), desc: t('home.whyUs.workersDesc') },
    { icon: ShieldCheck, title: t('home.whyUs.qualityTitle'), desc: t('home.whyUs.qualityDesc') },
    { icon: Truck, title: t('home.whyUs.shippingTitle'), desc: t('home.whyUs.shippingDesc') },
  ]

  const techSpecs = [
    { icon: Droplets, label: t('home.techSpecs.waterproofLabel'), value: t('home.techSpecs.waterproofValue'), desc: t('home.techSpecs.waterproofDesc') },
    { icon: Wind, label: t('home.techSpecs.breathableLabel'), value: t('home.techSpecs.breathableValue'), desc: t('home.techSpecs.breathableDesc') },
    { icon: Thermometer, label: t('home.techSpecs.insulationLabel'), value: t('home.techSpecs.insulationValue'), desc: t('home.techSpecs.insulationDesc') },
  ]

  const factories = [
    { num: '01', name: t('home.factory.myanmarName'), workers: t('home.factory.myanmarWorkers'), lines: t('home.factory.myanmarLines'), note: t('home.factory.myanmarNote') },
    { num: '02', name: t('home.factory.jiangsu1Name'), workers: t('home.factory.jiangsu1Workers'), lines: t('home.factory.jiangsu1Lines'), note: t('home.factory.jiangsu1Note') },
    { num: '03', name: t('home.factory.jiangsu2Name'), workers: t('home.factory.jiangsu2Workers'), lines: t('home.factory.jiangsu2Lines'), note: t('home.factory.jiangsu2Note') },
  ]

  const factoryImages = [
    t('home.factory.factoryImage'),
    t('home.factory.productionLine'),
    t('home.factory.qualityControl'),
    t('home.factory.warehouse'),
  ]

  return (
    <div className="bg-white">
      {/* AI Hero Section */}
      <AIHero
        headline={t('home.hero.headline')}
        subtitle={t('home.hero.subtitle')}
        description={t('home.hero.description')}
        placeholderPrompt={t('home.hero.placeholderPrompt')}
        quickActions={[
          { label: t('home.hero.quickActionSki'), prompt: 'I need ski jackets for my brand...' },
          { label: t('home.hero.quickActionHunting'), prompt: 'Looking for hunting apparel...' },
          { label: t('home.hero.quickActionTactical'), prompt: 'Need tactical jackets...' },
          { label: t('home.hero.quickActionCustom'), prompt: 'I have a custom design...' },
        ]}
        primaryCta={t('home.hero.primaryCta')}
        secondaryCta={t('home.hero.secondaryCta')}
      />

      {/* Technical Capabilities Bar */}
      <section className="bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            {techSpecs.map((spec, index) => (
              <div key={index} className="flex items-center gap-4 py-6 px-4 md:px-8">
                <div className="w-12 h-12 bg-neutral-800 flex items-center justify-center">
                  <spec.icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{spec.label}</div>
                  <div className="text-xl font-bold text-white font-mono">{spec.value}</div>
                  <div className="text-xs text-neutral-400">{spec.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - 深色区块 */}
      <section className="py-16 md:py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-2">
                {t('home.categories.label')}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                {t('home.categories.title')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="group bg-neutral-800 border border-neutral-700 p-6 hover:border-orange-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-neutral-700 flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-colors">
                  <category.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-neutral-500 font-mono">{category.count} {t('home.categories.products')}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - 浅色区块 */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-2">
                {t('home.featured.label')}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
                {t('home.featured.title')}
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-orange-500 transition-colors uppercase tracking-wider"
            >
              {t('home.featured.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sampleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white border border-neutral-200 overflow-hidden hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-mono">{t('home.featured.moq')} {product.moq}</span>
                    <span className="w-px h-3 bg-neutral-200" />
                    <span className="font-mono">{product.colors} {t('home.featured.colors')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 uppercase tracking-wider"
            >
              {t('home.featured.viewAllProducts')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 深色区块 */}
      <section className="py-16 md:py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-2">
              {t('home.whyUs.label')}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              {t('home.whyUs.title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whyUs.map((item, index) => (
              <div key={index} className="text-center p-6 border border-neutral-700 hover:border-orange-500/30 transition-colors">
                <div className="w-12 h-12 bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory Section - 浅色区块 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-2">
                {t('home.factory.label')}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6">
                {t('home.factory.title')}
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                {t('home.factory.description')}
              </p>

              <div className="space-y-4">
                {factories.map((factory) => (
                  <div key={factory.num} className="flex gap-4 p-4 bg-neutral-50 border-l-2 border-orange-500">
                    <div className="text-2xl font-bold text-orange-500 font-mono">
                      {factory.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{factory.name}</h3>
                      <p className="text-sm text-neutral-600">{factory.workers} · {factory.lines}</p>
                      <p className="text-xs text-neutral-400">{factory.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/factory"
                className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-neutral-900 hover:text-orange-500 transition-colors uppercase tracking-wider"
              >
                {t('home.factory.learnMore')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {factoryImages.map((label, i) => (
                <div key={i} className="bg-neutral-100 aspect-square flex items-center justify-center">
                  <span className="text-neutral-400 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - 深色区块 */}
      <section className="py-16 md:py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
            {t('home.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-semibold uppercase tracking-wider hover:bg-orange-600 transition-colors"
            >
              {t('home.cta.browseProducts')}
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-600 text-white font-semibold uppercase tracking-wider hover:bg-neutral-800 hover:border-neutral-500 transition-colors"
            >
              {t('home.cta.requestQuote')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}