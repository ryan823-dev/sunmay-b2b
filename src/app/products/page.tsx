import Link from 'next/link'
import { Metadata } from 'next'
import { products, categories, getCategoryBySlug } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { formatPrice } from '@/lib/utils'
import { Filter, ChevronDown, Grid, List } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products | Sunmay - Professional Outdoor Apparel',
  description: 'Browse our collection of ski jackets, hunting gear, tactical wear, and outdoor apparel. MOQ 200 pieces. Wholesale pricing available.',
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; gender?: string }
}) {
  const currentCategory = searchParams.category
  const currentGender = searchParams.gender

  // Filter products
  let filteredProducts = products
  if (currentCategory) {
    const category = getCategoryBySlug(currentCategory)
    if (category) {
      filteredProducts = products.filter(p => p.categoryId === category.id)
    }
  }
  if (currentGender) {
    filteredProducts = filteredProducts.filter(p => p.gender === currentGender || p.gender === 'unisex')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Products</h1>
          <p className="text-gray-300">
            Browse our collection of professional outdoor apparel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !currentCategory
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Products
                  <span className="ml-2 text-gray-400">({products.length})</span>
                </Link>
                {categories.map((category) => {
                  const count = products.filter(p => p.categoryId === category.id).length
                  return (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentCategory === category.slug
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-gray-400">({count})</span>
                    </Link>
                  )
                })}
              </div>

              <hr className="my-6 border-gray-200" />

              <h2 className="font-semibold text-gray-900 mb-4">Gender</h2>
              <div className="space-y-2">
                {['men', 'women', 'unisex'].map((gender) => (
                  <Link
                    key={gender}
                    href={`/products?gender=${gender}${currentCategory ? `&category=${currentCategory}` : ''}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                      currentGender === gender
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {gender}
                  </Link>
                ))}
              </div>

              <hr className="my-6 border-gray-200" />

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Need Custom Order?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  We offer custom designs, private labeling, and special packaging.
                </p>
                <Link
                  href="/quote"
                  className="block text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> products
              </p>
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Link
                  href="/products"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </Link>
              </div>
            )}

            {/* MOQ Notice */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2">Minimum Order Quantity</h3>
              <p className="text-amber-800 text-sm">
                All products have a MOQ of 200 pieces per style/color. Mix sizes within the same style/color combination.
                For smaller orders or custom requirements, please <Link href="/quote" className="underline">request a quote</Link>.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
