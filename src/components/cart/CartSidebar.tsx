'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, removeItem, updateItem, getTotalPieces, getSubtotal, meetsMOQ } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = (productId: string, color: string, sizes: { size: string; quantity: number }[], newSize: string, delta: number) => {
    const newSizes = sizes.map(s => {
      if (s.size === newSize) {
        return { ...s, quantity: Math.max(0, s.quantity + delta) }
      }
      return s
    }).filter(s => s.quantity > 0)
    
    if (newSizes.length === 0) {
      removeItem(productId, color)
    } else {
      updateItem(productId, color, newSizes)
    }
  }

  const totalPieces = getTotalPieces()
  const subtotal = getSubtotal()
  const moqMet = meetsMOQ(200)

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Wholesale Cart</h2>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
              {totalPieces} pieces
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 200px)' }}>
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/products"
                onClick={onClose}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Products →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={`${item.productId}-${item.color}`} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={onClose}
                        className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span className="text-sm text-gray-600">{item.color}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.unitPrice)}/piece
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.color)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Size quantities */}
                  <div className="mt-3 space-y-2">
                    {item.sizes.map((sizeItem) => (
                      <div key={sizeItem.size} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 w-12">{sizeItem.size}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId,
                              item.color,
                              item.sizes,
                              sizeItem.size,
                              -10
                            )}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center text-sm font-medium">
                            {sizeItem.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId,
                              item.color,
                              item.sizes,
                              sizeItem.size,
                              10
                            )}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Item total */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                    <span className="text-sm text-gray-600">
                      {item.sizes.reduce((sum, s) => sum + s.quantity, 0)} pieces
                    </span>
                    <span className="text-sm font-medium">
                      {formatPrice(item.sizes.reduce((sum, s) => sum + s.quantity, 0) * item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            {!moqMet && (
              <div className="mb-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                Minimum order is 200 pieces per product style
              </div>
            )}
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal ({totalPieces} pieces)</span>
              <span className="text-lg font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/products"
                onClick={onClose}
                className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
              <Link
                href="/checkout"
                onClick={(e) => {
                  if (!moqMet) {
                    e.preventDefault()
                  } else {
                    onClose()
                  }
                }}
                className={cn(
                  "flex-1 text-center px-4 py-3 rounded-lg font-medium",
                  moqMet
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
