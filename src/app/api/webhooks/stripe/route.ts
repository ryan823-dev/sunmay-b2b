import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyWebhookSignature } from '@/lib/payment/stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: Stripe.Event
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore
            }
          },
        },
      }
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderNumber = session.metadata?.orderNumber
        const paymentIntentId = session.payment_intent as string

        console.log(`Checkout completed for order ${orderNumber}`)

        // Update order status in database
        if (orderNumber) {
          const { error } = await supabase
            .from('orders')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
            })
            .eq('order_number', orderNumber)

          if (error) {
            console.error('Failed to update order:', error)
          }
        }

        // TODO: Send confirmation email
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderNumber = paymentIntent.metadata?.orderNumber

        console.log(`Payment succeeded for order ${orderNumber}:`, paymentIntent.id)

        // Update order status
        if (orderNumber) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
            })
            .eq('order_number', orderNumber)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderNumber = paymentIntent.metadata?.orderNumber

        console.log(`Payment failed for order ${orderNumber}:`, paymentIntent.last_payment_error?.message)

        // Update order status
        if (orderNumber) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
            })
            .eq('order_number', orderNumber)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        console.log(`Charge refunded: ${paymentIntentId}`)

        // Find order by payment intent and update
        // Note: We'd need to store payment_intent_id in the order to track this
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
