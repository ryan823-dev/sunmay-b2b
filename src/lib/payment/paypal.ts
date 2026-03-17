import type { PayPalOrder, OrderData } from '@/types/payment'

// PayPal API configuration
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

interface PayPalAccessToken {
  access_token: string
  expires_in: number
  token_type: string
}

// Cache for access token
let cachedToken: PayPalAccessToken | null = null
let tokenExpiresAt: number = 0

/**
 * Get PayPal access token using OAuth2
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured')
  }

  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken.access_token
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal access token: ${error}`)
  }

  const token: PayPalAccessToken = await response.json()
  
  // Cache token with 5 minute buffer before expiry
  cachedToken = token
  tokenExpiresAt = Date.now() + (token.expires_in - 300) * 1000

  return token.access_token
}

/**
 * Create a PayPal order for B2B wholesale
 */
export async function createPayPalOrder(
  orderData: OrderData,
  returnUrl: string,
  cancelUrl: string
): Promise<PayPalOrder> {
  const accessToken = await getAccessToken()

  // Build purchase units from order items
  const purchaseUnits = [{
    reference_id: orderData.orderNumber,
    description: `Sunmay B2B Order - ${orderData.items.length} product(s)`,
    amount: {
      currency_code: orderData.currency.toUpperCase(),
      value: orderData.total.toFixed(2),
      breakdown: {
        item_total: {
          currency_code: orderData.currency.toUpperCase(),
          value: orderData.subtotal.toFixed(2),
        },
        shipping: {
          currency_code: orderData.currency.toUpperCase(),
          value: orderData.shipping.toFixed(2),
        },
      },
    },
    items: orderData.items.map(item => {
      const quantity = item.sizes.reduce((sum, s) => sum + s.quantity, 0)
      return {
        name: item.productName,
        description: `Color: ${item.color}`,
        sku: item.productId,
        unit_amount: {
          currency_code: orderData.currency.toUpperCase(),
          value: item.unitPrice.toFixed(2),
        },
        quantity: quantity.toString(),
        category: 'PHYSICAL_GOODS',
      }
    }),
    shipping: {
      name: {
        full_name: orderData.shippingAddress.contactName,
      },
      address: {
        address_line_1: orderData.shippingAddress.address,
        admin_area_2: orderData.shippingAddress.city,
        admin_area_1: orderData.shippingAddress.state || '',
        postal_code: orderData.shippingAddress.postalCode,
        country_code: getCountryCode(orderData.shippingAddress.country),
      },
    },
  }]

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': `order-${orderData.orderNumber}-${Date.now()}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: purchaseUnits,
      application_context: {
        brand_name: 'Sunmay Outdoor',
        locale: 'en-US',
        landing_page: 'BILLING',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      payer: {
        name: {
          given_name: orderData.shippingAddress.contactName.split(' ')[0],
          surname: orderData.shippingAddress.contactName.split(' ').slice(1).join(' '),
        },
        email_address: orderData.shippingAddress.email,
        address: {
          address_line_1: orderData.shippingAddress.address,
          admin_area_2: orderData.shippingAddress.city,
          admin_area_1: orderData.shippingAddress.state || '',
          postal_code: orderData.shippingAddress.postalCode,
          country_code: getCountryCode(orderData.shippingAddress.country),
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('PayPal order creation failed:', error)
    throw new Error(`Failed to create PayPal order: ${JSON.stringify(error)}`)
  }

  const order = await response.json()
  
  // Find the approval URL
  const approvalLink = order.links?.find(
    (link: { rel: string; href: string }) => link.rel === 'approve'
  )

  return {
    orderId: order.id,
    approvalUrl: approvalLink?.href || '',
  }
}

/**
 * Capture payment for an approved PayPal order
 */
export async function capturePayPalOrder(orderId: string): Promise<{
  success: boolean
  captureId?: string
  error?: string
}> {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    return {
      success: false,
      error: JSON.stringify(error),
    }
  }

  const result = await response.json()
  
  // Check if capture was successful
  const captureStatus = result.purchase_units?.[0]?.payments?.captures?.[0]?.status
  
  if (captureStatus === 'COMPLETED') {
    return {
      success: true,
      captureId: result.purchase_units[0].payments.captures[0].id,
    }
  }

  return {
    success: false,
    error: `Capture status: ${captureStatus}`,
  }
}

/**
 * Get order details from PayPal
 */
export async function getPayPalOrderDetails(orderId: string) {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to get PayPal order: ${JSON.stringify(error)}`)
  }

  return response.json()
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhook(
  headers: Headers,
  body: string
): Promise<boolean> {
  // In production, implement proper webhook signature verification
  // https://developer.paypal.com/api/rest/webhooks/rest/#verify-webhook-signature
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  
  if (!webhookId) {
    console.warn('PAYPAL_WEBHOOK_ID not configured, skipping verification')
    return true
  }

  // For now, return true in development
  if (process.env.NODE_ENV !== 'production') {
    return true
  }

  // TODO: Implement full webhook signature verification
  return true
}

/**
 * Convert country name to ISO 3166-1 alpha-2 code
 */
function getCountryCode(countryName: string): string {
  const countryCodes: Record<string, string> = {
    'United States': 'US',
    'Canada': 'CA',
    'United Kingdom': 'GB',
    'Germany': 'DE',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Austria': 'AT',
    'Switzerland': 'CH',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Australia': 'AU',
    'New Zealand': 'NZ',
    'Japan': 'JP',
    'South Korea': 'KR',
  }
  
  return countryCodes[countryName] || 'US'
}

/**
 * Refund a PayPal capture
 */
export async function refundPayPalCapture(
  captureId: string,
  amount?: number,
  currency: string = 'USD'
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  const accessToken = await getAccessToken()

  const body: Record<string, unknown> = {}
  if (amount) {
    body.amount = {
      value: amount.toFixed(2),
      currency_code: currency.toUpperCase(),
    }
  }

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    return {
      success: false,
      error: JSON.stringify(error),
    }
  }

  const result = await response.json()
  
  return {
    success: result.status === 'COMPLETED',
    refundId: result.id,
  }
}
