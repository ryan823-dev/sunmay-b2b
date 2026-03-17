import Link from 'next/link'
import { formatPrice, formatMOQ } from '@/lib/utils'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
  locale?: string
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-neutral-900 border border-neutral-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-neutral-800 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            No Image
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {product.featured && (
            <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Featured
            </span>
          )}
          <span className="ml-auto px-2 py-1 bg-neutral-800/80 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
            {product.gender}
          </span>
        </div>

        {/* Bottom Technical Specs - Visible on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-4 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-sky-500" />
              Waterproof
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500" />
              Breathable
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-[10px] text-orange-500 font-semibold uppercase tracking-widest mb-1">
          {product.categoryId}
        </div>
        
        {/* Name */}
        <h3 className="font-bold text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {/* MOQ & Colors */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
          <span className="font-mono">{formatMOQ(product.moq)}</span>
          <span className="w-px h-3 bg-neutral-700" />
          <span className="font-mono">{product.colors.length} colors</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-white font-mono">
            {formatPrice(product.priceRangeMin)}
          </span>
          <span className="text-neutral-500">-</span>
          <span className="text-lg font-bold text-white font-mono">
            {formatPrice(product.priceRangeMax)}
          </span>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-1.5 mt-4 pt-3 border-t border-neutral-700">
          {product.colors.slice(0, 6).map((color, i) => (
            <div
              key={i}
              className="w-5 h-5 border border-neutral-600 hover:border-neutral-400 transition-colors"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 6 && (
            <div className="w-5 h-5 bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
              +{product.colors.length - 6}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
