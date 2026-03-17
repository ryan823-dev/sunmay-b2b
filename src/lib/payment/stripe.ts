import Stripe from 'stripe'
import type { StripePaymentIntent, OrderData } from '@/types/payment'

// Initialize Stripe with secret key
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover',
  })
}

/**
 * Create a Stripe PaymentIntent for the order
 */
export async function createStripePaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
): Promise<StripePaymentIntent> {
  const stripe = getStripe()
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  }
}

/**
 * Retrieve a PaymentIntent by ID
 */
export async function getPaymentIntent(paymentIntentId: string) {
  const stripe = getStripe()
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

/**
 * Confirm a PaymentIntent
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId?: string
) {
  const stripe = getStripe()
  
  const params: Stripe.PaymentIntentConfirmParams = {}
  if (paymentMethodId) {
    params.payment_method = paymentMethodId
  }
  
  return stripe.paymentIntents.confirm(paymentIntentId, params)
}

/**
 * Create a Stripe Customer
 */
export async function createStripeCustomer(
  email: string,
  name: string,
  metadata?: Record<string, string>
) {
  const stripe = getStripe()
  
  return stripe.customers.create({
    email,
    name,
    metadata,
  })
}

/**
 * Create a Stripe Checkout Session for B2B wholesale order
 */
export async function createCheckoutSession(
  orderData: OrderData,
  successUrl: string,
  cancelUrl: string
) {
  const stripe = getStripe()
  
  // Create line items from order
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = orderData.items.map(item => {
    const quantity = item.sizes.reduce((sum, s) => sum + s.quantity, 0)
    return {
      price_data: {
        currency: orderData.currency.toLowerCase(),
        product_data: {
          name: item.productName,
          description: `Color: ${item.color}`,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
            color: item.color,
            colorHex: item.colorHex,
          },
        },
        unit_amount: Math.round(item.unitPrice * 100), // Convert to cents
      },
      quantity,
    }
  })

  // Add shipping as a line item if applicable
  if (orderData.shipping > 0) {
    lineItems.push({
      price_data: {
        currency: orderData.currency.toLowerCase(),
        product_data: {
          name: 'Shipping',
          description: 'International shipping',
        },
        unit_amount: Math.round(orderData.shipping * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: orderData.customer.email,
    metadata: {
      orderNumber: orderData.orderNumber,
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'PL', 'CZ', 'SE', 'NO', 'DK', 'FI', 'AU', 'NZ', 'JP', 'KR'],
    },
    billing_address_collection: 'required',
  })

  return session
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

/**
 * Handle successful payment from webhook
 */
export async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId
  const orderNumber = paymentIntent.metadata.orderNumber
  
  // In production, update order status in database
  console.log(`Payment successful for order ${orderNumber}:`, {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    orderId,
    orderNumber,
  })
  
  return {
    success: true,
    paymentIntentId: paymentIntent.id,
    orderNumber,
  }
}

/**
 * Calculate application fee (for platform)
 */
export function calculateApplicationFee(amount: number, feePercent: number = 2.9): number {
  // Stripe fee: 2.9% + $0.30 per transaction
  const stripeFee = amount * (feePercent / 100) + 0.30
  return Math.round(stripeFee * 100) // Return in cents
}
