'use client'

import { useState } from 'react'
import { Heart, Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/database'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '')
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({})
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleSizeChange = (size: string, quantity: number) => {
    setSelectedSizes(prev => ({
      ...prev,
      [size]: quantity,
    }))
  }

  const totalPieces = Object.values(selectedSizes).reduce((sum, qty) => sum + qty, 0)
  const meetsMOQ = totalPieces >= product.moq

  return (
    <div className="lg:sticky lg:top-24">
      {/* Color Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Select Color: <span className="text-gray-600">{selectedColor}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 border rounded-lg transition-all",
                selectedColor === color.name
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm text-gray-700">{color.name}</span>
              {selectedColor === color.name && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size & Quantity Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Select Sizes & Quantities
        </h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="space-y-3">
            {product.sizes.map((size) => (
              <div key={size} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{size}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSizeChange(size, Math.max(0, (selectedSizes[size] || 0) - 10))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedSizes[size] || 0}
                    onChange={(e) => handleSizeChange(size, Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 h-8 text-center border border-gray-300 rounded-lg"
                    min="0"
                    step="10"
                  />
                  <button
                    onClick={() => handleSizeChange(size, (selectedSizes[size] || 0) + 10)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Pieces</span>
              <span className={cn(
                "text-lg font-bold",
                meetsMOQ ? "text-green-600" : "text-gray-900"
              )}>
                {totalPieces}
              </span>
            </div>
            {!meetsMOQ && totalPieces > 0 && (
              <p className="text-sm text-amber-600 mt-2">
                Add {product.moq - totalPieces} more pieces to meet MOQ
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          disabled={!meetsMOQ}
          className={cn(
            "flex-1 py-3 rounded-lg font-medium transition-colors",
            meetsMOQ
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          )}
        >
          {meetsMOQ ? "Add to Cart" : `Min. ${product.moq} pieces`}
        </button>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn(
            "p-3 border rounded-lg transition-colors",
            isWishlisted
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
        </button>
        <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
