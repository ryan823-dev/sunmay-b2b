import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Package, Truck, ShieldCheck, Clock, 
  CheckCircle, ArrowRight, Calculator
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wholesale Program | Sunmay - Professional Outdoor Apparel',
  description: 'Join our wholesale program for outdoor apparel. MOQ 200 pieces, competitive pricing, custom branding options. Start your wholesale order today.',
}

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Wholesale Program
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Premium outdoor apparel at competitive wholesale prices. 
              Start with just 200 pieces per style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100"
              >
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10"
              >
                Request Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Sunmay Wholesale?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make it easy to source professional outdoor apparel for your brand
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: 'Low MOQ',
                desc: 'Start with just 200 pieces per style/color. Perfect for testing new products.',
              },
              {
                icon: Calculator,
                title: 'Competitive Pricing',
                desc: 'Direct factory pricing with volume discounts up to 40% off.',
              },
              {
                icon: ShieldCheck,
                title: 'Quality Guaranteed',
                desc: 'Strict QC process. We stand behind every product we make.',
              },
              {
                icon: Truck,
                title: 'Global Shipping',
                desc: 'We ship to 35+ countries. FOB, CIF, DDP terms available.',
              },
            ].map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Browse Products', desc: 'Explore our catalog of professional outdoor apparel' },
              { step: 2, title: 'Select & Customize', desc: 'Choose styles, colors, and add your branding' },
              { step: 3, title: 'Place Order', desc: 'Submit your order with secure payment' },
              { step: 4, title: 'Receive & Sell', desc: 'Production, shipping, and delivery to your door' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Volume Pricing
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The more you order, the more you save. Our tiered pricing rewards larger orders.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { qty: '200-500', discount: 'Base Price', label: 'Starter' },
              { qty: '500-2,000', discount: '10-15% Off', label: 'Growing', featured: true },
              { qty: '2,000+', discount: '20-40% Off', label: 'Enterprise' },
            ].map((tier, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 text-center ${
                  tier.featured
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${tier.featured ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tier.label}
                </div>
                <div className={`text-2xl font-bold mb-2 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.qty}
                </div>
                <div className={`text-sm mb-4 ${tier.featured ? 'text-blue-100' : 'text-gray-500'}`}>
                  pieces per order
                </div>
                <div className={`text-lg font-semibold ${tier.featured ? 'text-white' : 'text-blue-600'}`}>
                  {tier.discount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Product Categories
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Ski & Snowboard', count: 120, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400' },
              { name: 'Hunting & Outdoor', count: 85, image: 'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=400' },
              { name: 'Tactical & Workwear', count: 60, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Down & Insulated', count: 45, image: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=400' },
              { name: 'Pants & Bibs', count: 55, image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400' },
              { name: 'Custom Designs', count: '∞', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
            ].map((category, i) => (
              <Link
                key={i}
                href={category.name === 'Custom Designs' ? '/quote' : `/products?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="group relative rounded-xl overflow-hidden aspect-video"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Customization Options
              </h2>
              <p className="text-gray-300 mb-8">
                Make our products your own with comprehensive branding and customization services.
              </p>
              <ul className="space-y-4">
                {[
                  'Private label with your brand',
                  'Custom hang tags and care labels',
                  'Branded packaging and polybags',
                  'Custom color development',
                  'Design modifications',
                  'Size chart adjustments',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Discuss Customization
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">3</div>
                <div className="text-gray-400">Production Bases</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">1,350+</div>
                <div className="text-gray-400">Workers</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">20</div>
                <div className="text-gray-400">Production Lines</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">1.5M</div>
                <div className="text-gray-400">Pieces/Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Wholesale Order?
          </h2>
          <p className="text-gray-600 mb-8">
            Browse our products or contact us to discuss your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
