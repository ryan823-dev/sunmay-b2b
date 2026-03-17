import type { OrderData, PaymentMethod, PaymentResult } from '@/types/payment'
import { createStripePaymentIntent, createCheckoutSession } from './stripe'
import { createPayPalOrder, capturePayPalOrder } from './paypal'
import type { CartItem } from '@/lib/cart/CartContext'

/**
 * Generate a unique order number
 * Format: SM-YYYYMMDD-XXXXX
 */
export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
  return `SM-${dateStr}-${random}`
}

/**
 * Calculate order totals from cart items
 */
export function calculateOrderTotals(
  items: CartItem[],
  currency: string = 'USD'
): { subtotal: number; shipping: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    const quantity = item.sizes.reduce((s, size) => s + size.quantity, 0)
    return sum + (quantity * item.unitPrice)
  }, 0)

  // Shipping calculation for B2B wholesale
  // Free shipping for orders over $5000
  // Otherwise, calculate based on total pieces
  const totalPieces = items.reduce((sum, item) => {
    return sum + item.sizes.reduce((s, size) => s + size.quantity, 0)
  }, 0)

  let shipping = 0
  if (subtotal < 5000) {
    // Base shipping + per-piece rate
    shipping = 150 + Math.floor(totalPieces / 100) * 25
  }

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  }
}

/**
 * Process payment based on selected method
 */
export async function processPayment(
  orderData: OrderData,
  returnUrl: string,
  cancelUrl: string
): Promise<PaymentResult> {
  try {
    switch (orderData.paymentMethod) {
      case 'stripe': {
        // Create Stripe Checkout Session
        const session = await createCheckoutSession(
          orderData,
          returnUrl,
          cancelUrl
        )
        
        return {
          success: true,
          paymentId: session.id,
          orderId: session.id,
          redirectUrl: session.url || undefined,
        }
      }

      case 'paypal': {
        // Create PayPal order
        const paypalOrder = await createPayPalOrder(
          orderData,
          returnUrl,
          cancelUrl
        )
        
        return {
          success: true,
          paymentId: paypalOrder.orderId,
          orderId: paypalOrder.orderId,
          redirectUrl: paypalOrder.approvalUrl,
        }
      }

      case 'tt':
      case 'bank': {
        // For bank transfers, no immediate payment processing
        // Order will be created with pending payment status
        return {
          success: true,
          orderId: orderData.orderNumber,
        }
      }

      default:
        return {
          success: false,
          error: `Unsupported payment method: ${orderData.paymentMethod}`,
        }
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    }
  }
}

/**
 * Verify and complete payment after redirect
 */
export async function verifyPayment(
  paymentMethod: PaymentMethod,
  paymentId: string
): Promise<PaymentResult> {
  try {
    switch (paymentMethod) {
      case 'paypal': {
        // Capture PayPal payment
        const result = await capturePayPalOrder(paymentId)
        
        if (result.success) {
          return {
            success: true,
            paymentId: result.captureId,
          }
        }
        
        return {
          success: false,
          error: result.error || 'PayPal capture failed',
        }
      }

      case 'stripe': {
        // Stripe checkout is handled by webhook
        // Just return success
        return {
          success: true,
          paymentId,
        }
      }

      case 'tt':
      case 'bank': {
        // Bank transfers are manually verified
        return {
          success: true,
          paymentId,
        }
      }

      default:
        return {
          success: false,
          error: `Unsupported payment method: ${paymentMethod}`,
        }
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    }
  }
}

/**
 * Get bank account info for T/T or local bank transfer
 */
export function getBankAccountInfo(
  method: 'tt' | 'bank',
  country?: string
): { bankName: string; accountName: string; accountNumber: string; swiftCode?: string; iban?: string; routingNumber?: string; address?: string; currency: string; notes?: string } {
  if (method === 'tt') {
    return {
      bankName: 'Bank of China',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****456789',
      swiftCode: 'BKCHCNBJ',
      currency: 'USD',
      address: 'Nanjing, Jiangsu, China',
      notes: 'International wire transfer - 3-5 business days processing time',
    }
  }

  // Local bank accounts based on country
  const localAccounts: Record<string, ReturnType<typeof getBankAccountInfo>> = {
    'United States': {
      bankName: 'Bank of America',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****1234',
      routingNumber: '****5678',
      currency: 'USD',
      address: 'New York, NY, USA',
      notes: 'For US customers - ACH transfers accepted',
    },
    'Canada': {
      bankName: 'TD Bank',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****5678',
      currency: 'CAD',
      address: 'Toronto, ON, Canada',
      notes: 'For Canadian customers',
    },
    'United Kingdom': {
      bankName: 'Barclays Bank',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****9012',
      currency: 'GBP',
      address: 'London, UK',
      notes: 'For UK customers - Faster Payments accepted',
    },
    'Germany': {
      bankName: 'Deutsche Bank',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****3456',
      iban: 'DE89****3456',
      currency: 'EUR',
      address: 'Frankfurt, Germany',
      notes: 'For EU customers - SEPA transfers accepted',
    },
    'France': {
      bankName: 'BNP Paribas',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****7890',
      iban: 'FR76****7890',
      currency: 'EUR',
      address: 'Paris, France',
      notes: 'For EU customers - SEPA transfers accepted',
    },
  }

  if (country && localAccounts[country]) {
    return localAccounts[country]
  }

  // Default to US account
  return localAccounts['United States']
}

/**
 * Format order confirmation email content
 */
export function formatOrderConfirmationEmail(orderData: OrderData): {
  subject: string
  text: string
  html: string
} {
  const itemsList = orderData.items
    .map(item => {
      const qty = item.sizes.reduce((s, size) => s + size.quantity, 0)
      return `- ${item.productName} (${item.color}) - ${qty} pcs @ $${item.unitPrice.toFixed(2)} = $${(qty * item.unitPrice).toFixed(2)}`
    })
    .join('\n')

  const text = `
Order Confirmation - ${orderData.orderNumber}

Thank you for your order!

Order Details:
${itemsList}

Subtotal: $${orderData.subtotal.toFixed(2)}
Shipping: $${orderData.shipping.toFixed(2)}
Total: $${orderData.total.toFixed(2)}

Shipping Address:
${orderData.shippingAddress.companyName}
${orderData.shippingAddress.contactName}
${orderData.shippingAddress.address}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postalCode}
${orderData.shippingAddress.country}

Payment Method: ${orderData.paymentMethod.toUpperCase()}
${orderData.notes ? `\nNotes: ${orderData.notes}` : ''}

We will contact you shortly with production timeline and shipping details.

Best regards,
Sunmay Outdoor Team
  `.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #1e40af; }
    .order-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .total { font-size: 1.2em; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Order Confirmation</h1>
    <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
    
    <div class="order-details">
      <h2>Order Items</h2>
      ${orderData.items.map(item => {
        const qty = item.sizes.reduce((s, size) => s + size.quantity, 0)
        return `<p>${item.productName} (${item.color}) - ${qty} pcs @ $${item.unitPrice.toFixed(2)} = $${(qty * item.unitPrice).toFixed(2)}</p>`
      }).join('')}
      <hr>
      <p>Subtotal: $${orderData.subtotal.toFixed(2)}</p>
      <p>Shipping: $${orderData.shipping.toFixed(2)}</p>
      <p class="total">Total: $${orderData.total.toFixed(2)}</p>
    </div>
    
    <h2>Shipping Address</h2>
    <p>
      ${orderData.shippingAddress.companyName}<br>
      ${orderData.shippingAddress.contactName}<br>
      ${orderData.shippingAddress.address}<br>
      ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postalCode}<br>
      ${orderData.shippingAddress.country}
    </p>
    
    <p><strong>Payment Method:</strong> ${orderData.paymentMethod.toUpperCase()}</p>
    ${orderData.notes ? `<p><strong>Notes:</strong> ${orderData.notes}</p>` : ''}
    
    <p>We will contact you shortly with production timeline and shipping details.</p>
    
    <p>Best regards,<br>Sunmay Outdoor Team</p>
  </div>
</body>
</html>
  `.trim()

  return {
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    text,
    html,
  }
}
