'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { CartSidebar } from './CartSidebar'

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { getTotalPieces } = useCart()
  const totalPieces = getTotalPieces()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalPieces > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
            {totalPieces > 99 ? '99+' : totalPieces}
          </span>
        )}
      </button>
      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
