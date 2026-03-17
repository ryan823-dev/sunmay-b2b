// Database types for Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string
          short_description: string
          category_id: string
          gender: 'men' | 'women' | 'kids' | 'unisex'
          featured: boolean
          moq: number
          price_range_min: number
          price_range_max: number
          images: string[]
          specs: Json
          colors: Json
          sizes: string[]
          status: 'active' | 'draft' | 'archived'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description?: string
          short_description?: string
          category_id: string
          gender?: 'men' | 'women' | 'kids' | 'unisex'
          featured?: boolean
          moq?: number
          price_range_min?: number
          price_range_max?: number
          images?: string[]
          specs?: Json
          colors?: Json
          sizes?: string[]
          status?: 'active' | 'draft' | 'archived'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string
          category_id?: string
          gender?: 'men' | 'women' | 'kids' | 'unisex'
          featured?: boolean
          moq?: number
          price_range_min?: number
          price_range_max?: number
          images?: string[]
          specs?: Json
          colors?: Json
          sizes?: string[]
          status?: 'active' | 'draft' | 'archived'
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          description: string
          parent_id: string | null
          image: string
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          description?: string
          parent_id?: string | null
          image?: string
          order?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          description?: string
          parent_id?: string | null
          image?: string
          order?: number
        }
      }
      inquiries: {
        Row: {
          id: string
          created_at: string
          company_name: string
          contact_name: string
          email: string
          phone: string | null
          country: string
          products: Json
          quantity: string
          message: string
          status: 'new' | 'contacted' | 'quoted' | 'closed'
          files: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          company_name: string
          contact_name: string
          email: string
          phone?: string | null
          country: string
          products?: Json
          quantity?: string
          message?: string
          status?: 'new' | 'contacted' | 'quoted' | 'closed'
          files?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          company_name?: string
          contact_name?: string
          email?: string
          phone?: string | null
          country?: string
          products?: Json
          quantity?: string
          message?: string
          status?: 'new' | 'contacted' | 'quoted' | 'closed'
          files?: string[]
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          order_number: string
          customer_id: string
          status: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered'
          items: Json
          subtotal: number
          shipping: number
          total: number
          currency: string
          payment_method: 'paypal' | 'stripe' | 'tt' | 'bank'
          payment_status: 'pending' | 'paid' | 'refunded'
          shipping_address: Json
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          order_number: string
          customer_id: string
          status?: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered'
          items: Json
          subtotal: number
          shipping?: number
          total: number
          currency?: string
          payment_method: 'paypal' | 'stripe' | 'tt' | 'bank'
          payment_status?: 'pending' | 'paid' | 'refunded'
          shipping_address: Json
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          order_number?: string
          customer_id?: string
          status?: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered'
          items?: Json
          subtotal?: number
          shipping?: number
          total?: number
          currency?: string
          payment_method?: 'paypal' | 'stripe' | 'tt' | 'bank'
          payment_status?: 'pending' | 'paid' | 'refunded'
          shipping_address?: Json
          notes?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          company: string | null
          phone: string | null
          country: string
          address: Json
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          company?: string | null
          phone?: string | null
          country: string
          address?: Json
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          company?: string | null
          phone?: string | null
          country?: string
          address?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Product types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  categoryId: string
  gender: 'men' | 'women' | 'kids' | 'unisex'
  featured: boolean
  moq: number
  priceRangeMin: number
  priceRangeMax: number
  images: string[]
  specs: Record<string, string>
  colors: ProductColor[]
  sizes: string[]
  status: 'active' | 'draft' | 'archived'
}

export interface ProductColor {
  name: string
  hex: string
  image?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  image: string
  order: number
}

// Cart types
export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  color: string
  size: string
  quantity: number
  unitPrice: number
  image: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  currency: string
}

// Inquiry types
export interface InquiryFormData {
  companyName: string
  contactName: string
  email: string
  phone?: string
  country: string
  products?: string[]
  quantity?: string
  message?: string
  files?: File[]
}

// Order types
export interface OrderItem {
  productId: string
  productName: string
  color: string
  size: string
  quantity: number
  unitPrice: number
  total: number
}

export interface ShippingAddress {
  name: string
  company?: string
  address1: string
  address2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
}
