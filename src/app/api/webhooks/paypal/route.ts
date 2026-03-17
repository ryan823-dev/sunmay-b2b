import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/payment/paypal'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // PayPal webhook event types
    const eventType = body.event_type
    
    console.log(`PayPal webhook received: ${eventType}`)

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

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED': {
        // Buyer approved the order in PayPal
        const orderId = body.resource?.id
        
        if (orderId) {
          console.log(`PayPal order approved: ${orderId}`)
          
          // Capture the payment
          const result = await capturePayPalOrder(orderId)
          
          if (result.success) {
            // Update order in database
            // Note: We need to map PayPal order ID to our order number
            console.log(`PayPal capture successful: ${result.captureId}`)
          } else {
            console.error(`PayPal capture failed: ${result.error}`)
          }
        }
        break
      }

      case 'PAYMENT.CAPTURE.COMPLETED': {
        // Payment was successfully captured
        const captureId = body.resource?.id
        const orderId = body.resource?.supplementary_data?.related_ids?.order_id
        
        console.log(`PayPal payment captured: ${captureId}`)
        
        // Update order status
        // Find order by PayPal order ID and update
        break
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED': {
        const captureId = body.resource?.id
        
        console.log(`PayPal payment ${eventType.toLowerCase()}: ${captureId}`)
        
        // Update order status
        break
      }

      default:
        console.log(`Unhandled PayPal event: ${eventType}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
