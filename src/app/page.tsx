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

const categories = [
  { name: 'Ski & Snowboard', icon: MountainSnow, slug: 'ski-snowboard', count: 120 },
  { name: 'Hunting & Outdoor', icon: Target, slug: 'hunting-outdoor', count: 85 },
  { name: 'Tactical & Workwear', icon: ShieldCheck, slug: 'tactical-workwear', count: 60 },
  { name: 'Urban Outdoor', icon: Building2, slug: 'urban-outdoor', count: 45 },
]

const whyUs = [
  { icon: Factory, title: '20 Years Experience', desc: 'Specialized in technical outerwear since 2006' },
  { icon: Users, title: '1,350+ Workers', desc: 'Three production bases across China and Myanmar' },
  { icon: ShieldCheck, title: 'Quality Assured', desc: 'Seam-sealing, waterproofing, breathability testing' },
  { icon: Truck, title: 'Global Shipping', desc: 'Delivered to 35+ countries worldwide' },
]

const techSpecs = [
  { icon: Droplets, label: 'Waterproof', value: '10,000mm', desc: 'Hydrostatic head rating' },
  { icon: Wind, label: 'Breathable', value: '8,000g/m²', desc: 'Moisture vapor transmission' },
  { icon: Thermometer, label: 'Insulation', value: '650-850 FP', desc: 'Down fill power options' },
]

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* AI Hero Section */}
      <AIHero
        headline="Professional Outdoor Apparel Manufacturing"
        subtitle="From Ski Slopes to Hunting Trails"
        description="MOQ 200 pieces. Seam-sealed, waterproof, breathable. 20 years of manufacturing excellence with three production bases."
        placeholderPrompt="e.g., I need 500 ski jackets, waterproof rating 10,000mm, for my outdoor brand in Germany..."
        quickActions={[
          { label: 'Ski Jackets', prompt: 'I need ski jackets for my brand...' },
          { label: 'Hunting Gear', prompt: 'Looking for hunting apparel...' },
          { label: 'Tactical Wear', prompt: 'Need tactical jackets...' },
          { label: 'Custom Design', prompt: 'I have a custom design...' },
        ]}
        primaryCta="Browse Products"
        secondaryCta="Request Custom Quote"
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
                Product Lines
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Categories
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
                <p className="text-sm text-neutral-500 font-mono">{category.count} products</p>
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
                Ready to Customize
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-orange-500 transition-colors uppercase tracking-wider"
            >
              View All <ArrowRight className="w-4 h-4" />
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
                    <span className="font-mono">MOQ {product.moq}</span>
                    <span className="w-px h-3 bg-neutral-200" />
                    <span className="font-mono">{product.colors} colors</span>
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
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 深色区块 */}
      <section className="py-16 md:py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-2">
              Why Sunmay
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Your Trusted Manufacturing Partner
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
                Production Capacity
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6">
                Three Production Bases
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Strategic locations across China and Myanmar provide flexible production capacity 
                and competitive pricing for global customers.
              </p>

              <div className="space-y-4">
                {[
                  { num: '01', name: 'Myanmar Factory', workers: '950 workers', lines: '10 production lines', note: 'Duty-free advantage for EU market' },
                  { num: '02', name: 'Jiangsu Shunyu', workers: '278 workers', lines: '7 production lines', note: 'Quick turnaround for samples' },
                  { num: '03', name: 'Jiangsu Shunhao', workers: '120 workers', lines: '3 production lines', note: 'Complex design specialist' },
                ].map((factory) => (
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
                Learn More About Our Factories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Factory Image', 'Production Line', 'Quality Control', 'Warehouse'].map((label, i) => (
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
            Ready to Start Your Order?
          </h2>
          <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
            Whether you need 200 pieces or 20,000, we have the capacity and expertise 
            to deliver quality outdoor apparel for your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-semibold uppercase tracking-wider hover:bg-orange-600 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-600 text-white font-semibold uppercase tracking-wider hover:bg-neutral-800 hover:border-neutral-500 transition-colors"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
