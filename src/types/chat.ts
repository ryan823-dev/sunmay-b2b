// AI Chat types and interfaces

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool'

export interface ChatMessage {
  role: ChatRole
  content: string
  tool_calls?: ToolCall[]
  tool_call_id?: string
}

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface Tool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export interface ChatContext {
  cartItems: CartItemInfo[]
  recentProducts: string[]
  language: string
}

export interface CartItemInfo {
  productId: string
  productName: string
  color: string
  sizes: { size: string; quantity: number }[]
}

// Tool function types
export interface SearchProductsParams {
  query?: string
  category?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  features?: string[]
}

export interface AddToCartParams {
  productId: string
  color: string
  sizes: { size: string; quantity: number }[]
}

export interface CreateInquiryParams {
  companyName: string
  contactName: string
  email: string
  phone?: string
  country: string
  message: string
  products?: string[]
  quantity?: string
}

export interface GetProductDetailsParams {
  productId: string
  slug?: string
}