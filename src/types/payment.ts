// Payment types and interfaces

export type PaymentMethod = 'stripe' | 'paypal' | 'tt' | 'bank'

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId?: string
  error?: string
  redirectUrl?: string
}

export interface StripePaymentIntent {
  clientSecret: string
  paymentIntentId: string
}

export interface PayPalOrder {
  orderId: string
  approvalUrl: string
}

export interface OrderData {
  orderNumber: string
  items: OrderItemData[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddressData
  customer: CustomerData
  notes?: string
}

export interface OrderItemData {
  productId: string
  productName: string
  color: string
  colorHex: string
  sizes: { size: string; quantity: number }[]
  unitPrice: number
  image: string
}

export interface ShippingAddressData {
  companyName: string
  contactName: string
  email: string
  phone?: string
  country: string
  address: string
  city: string
  state?: string
  postalCode: string
}

export interface CustomerData {
  email: string
  name: string
  company?: string
  phone?: string
  country: string
  address: ShippingAddressData
}

// Bank account info for T/T and local transfers
export interface BankAccountInfo {
  method: 'tt' | 'bank'
  bankName: string
  accountName: string
  accountNumber: string
  routingNumber?: string
  swiftCode?: string
  iban?: string
  bic?: string
  sortCode?: string
  address?: string
  currency: string
  notes?: string
}

// Local bank accounts for different countries
export const localBankAccounts: Record<string, BankAccountInfo> = {
  'United States': {
    method: 'bank',
    bankName: 'Bank of America',
    accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
    accountNumber: '****1234',
    routingNumber: '****5678',
    currency: 'USD',
    address: 'New York, NY, USA',
    notes: 'For US customers - ACH transfers accepted',
  },
  'Canada': {
    method: 'bank',
    bankName: 'TD Bank',
    accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
    accountNumber: '****5678',
    currency: 'CAD',
    address: 'Toronto, ON, Canada',
    notes: 'For Canadian customers',
  },
  'United Kingdom': {
    method: 'bank',
    bankName: 'Barclays Bank',
    accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
    accountNumber: '****9012',
    sortCode: '****123',
    currency: 'GBP',
    address: 'London, UK',
    notes: 'For UK customers - Faster Payments accepted',
  },
  'Germany': {
    method: 'bank',
    bankName: 'Deutsche Bank',
    accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
    accountNumber: '****3456',
    iban: 'DE89****3456',
    bic: 'DEUTDEFF',
    currency: 'EUR',
    address: 'Frankfurt, Germany',
    notes: 'For EU customers - SEPA transfers accepted',
  },
  'France': {
    method: 'bank',
    bankName: 'BNP Paribas',
    accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
    accountNumber: '****7890',
    iban: 'FR76****7890',
    bic: 'BNPAFRPP',
    currency: 'EUR',
    address: 'Paris, France',
    notes: 'For EU customers - SEPA transfers accepted',
  },
}

// International T/T account
export const ttBankAccount: BankAccountInfo = {
  method: 'tt',
  bankName: 'Bank of China',
  accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
  accountNumber: '****456789',
  swiftCode: 'BKCHCNBJ',
  currency: 'USD',
  address: 'Nanjing, Jiangsu, China',
  notes: 'International wire transfer - 3-5 business days processing time',
}

// Payment method display info
export const paymentMethodInfo = {
  stripe: {
    name: 'Credit Card (Stripe)',
    description: 'Visa, Mastercard, American Express',
    processingTime: 'Instant',
    fees: 'Included in price',
  },
  paypal: {
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    processingTime: 'Instant',
    fees: 'Included in price',
  },
  tt: {
    name: 'Wire Transfer (T/T)',
    description: 'International bank transfer',
    processingTime: '3-5 business days',
    fees: 'Sender pays bank fees',
  },
  bank: {
    name: 'Local Bank Transfer',
    description: 'Direct transfer to our local account',
    processingTime: '1-3 business days',
    fees: 'May vary by bank',
  },
}
