import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { products, categories, getProductBySlug, getProductsByCategory } from '@/data/products'
import { formatPrice, formatMOQ } from '@/lib/utils'
import { ProductCard } from '@/components/product/ProductCard'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found | Sunmay',
    }
  }

  return {
    title: `${product.name} | Sunmay - Professional Outdoor Apparel`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const category = categories.find(c => c.id === product.categoryId)
  const relatedProducts = getProductsByCategory(category?.slug || '')
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Sunmay',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: product.priceRangeMin,
      highPrice: product.priceRangeMax,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Nanjing Sunmay Co., Ltd.',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
              <span className="text-gray-400">/</span>
              {category && (
                <>
                  <Link href={`/products?category=${category.slug}`} className="text-gray-500 hover:text-gray-700">
                    {category.name}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              )}
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 relative"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 12vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.featured && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full uppercase">
                  {product.gender}
                </span>
                {category && (
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200"
                  >
                    {category.name}
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Short Description */}
              <p className="text-gray-600 mb-6">
                {product.shortDescription}
              </p>

              {/* Price Range */}
              <div className="mb-6">
                <span className="text-sm text-gray-500">Price Range</span>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.priceRangeMin)} - {formatPrice(product.priceRangeMax)}
                  <span className="text-sm font-normal text-gray-500 ml-2">USD/piece</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Final price depends on quantity, customization, and shipping terms
                </p>
              </div>

              {/* MOQ */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50 rounded-lg">
                <div>
                  <span className="text-sm text-amber-700">Minimum Order</span>
                  <div className="text-lg font-bold text-amber-900">{formatMOQ(product.moq)}</div>
                </div>
                <div className="text-sm text-amber-700">
                  per style/color combination
                </div>
              </div>

              {/* Color Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Available Colors ({product.colors.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm text-gray-700">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <div
                      key={size}
                      className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer text-sm font-medium"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/quote"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Quote
                </Link>
                <Link
                  href="/wholesale"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Start Wholesale Order
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">20+ Years</div>
                    <div className="text-xs text-gray-500">Experience</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">1.5M Pieces</div>
                    <div className="text-xs text-gray-500">Annual Capacity</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">35+ Countries</div>
                    <div className="text-xs text-gray-500">Shipped To</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="flex gap-8">
                <button className="px-1 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Description
                </button>
                <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Specifications
                </button>
                <button className="px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Size Chart
                </button>
              </nav>
            </div>

            <div className="py-8">
              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <div className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <dl className="divide-y divide-gray-200">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex px-4 py-3">
                        <dt className="w-1/3 text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="w-2/3 text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
