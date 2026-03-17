'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { Product } from '@/types/database'

export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  image: string
  color: string
  colorHex: string
  sizes: { size: string; quantity: number }[]
  unitPrice: number
  moq?: number
}

interface CartState {
  items: CartItem[]
  currency: string
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; color: string } }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; color: string; sizes: { size: string; quantity: number }[] } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string) => void
  updateItem: (productId: string, color: string, sizes: { size: string; quantity: number }[]) => void
  clearCart: () => void
  getTotalPieces: () => number
  getSubtotal: () => number
  meetsMOQ: (moq: number) => boolean
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.color === action.payload.color
      )
      
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          sizes: action.payload.sizes,
        }
        return { ...state, items: newItems }
      }
      
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId && item.color === action.payload.color)
        ),
      }
    }
    case 'UPDATE_ITEM': {
      const newItems = state.items.map(item => {
        if (item.productId === action.payload.productId && item.color === action.payload.color) {
          return { ...item, sizes: action.payload.sizes }
        }
        return item
      })
      return { ...state, items: newItems }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'LOAD_CART':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    currency: 'USD',
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sunmay_cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsed })
      } catch (e) {
        console.error('Failed to load cart from localStorage', e)
      }
    }
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('sunmay_cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (productId: string, color: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, color } })
  }

  const updateItem = (productId: string, color: string, sizes: { size: string; quantity: number }[]) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { productId, color, sizes } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalPieces = () => {
    return state.items.reduce((total, item) => {
      return total + item.sizes.reduce((sum, s) => sum + s.quantity, 0)
    }, 0)
  }

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      const itemTotal = item.sizes.reduce((sum, s) => sum + s.quantity, 0) * item.unitPrice
      return total + itemTotal
    }, 0)
  }

  const meetsMOQ = (moq: number) => {
    // Check if each product meets MOQ
    const productQuantities: Record<string, number> = {}
    state.items.forEach(item => {
      const qty = item.sizes.reduce((sum, s) => sum + s.quantity, 0)
      productQuantities[item.productId] = (productQuantities[item.productId] || 0) + qty
    })
    
    return Object.values(productQuantities).every(qty => qty >= moq)
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      getTotalPieces,
      getSubtotal,
      meetsMOQ,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
