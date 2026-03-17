import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { OrderData, PaymentMethod } from '@/types/payment'
import type { CartItem } from '@/lib/cart/CartContext'
import {
  generateOrderNumber,
  calculateOrderTotals,
  processPayment,
} from '@/lib/payment/order'

interface CheckoutRequest {
  items: CartItem[]
  shippingAddress: {
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
  paymentMethod: PaymentMethod
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { items, shippingAddress, paymentMethod, notes } = body

    // Validate required fields
    if (!items?.length) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!shippingAddress?.email || !shippingAddress?.contactName) {
      return NextResponse.json(
        { error: 'Missing required shipping information' },
        { status: 400 }
      )
    }

    // Calculate totals
    const { subtotal, shipping, total } = calculateOrderTotals(items)

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Build order data
    const orderData: OrderData = {
      orderNumber,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        color: item.color,
        colorHex: item.colorHex,
        sizes: item.sizes,
        unitPrice: item.unitPrice,
        image: item.image,
      })),
      subtotal,
      shipping,
      total,
      currency: 'USD',
      paymentMethod,
      shippingAddress,
      customer: {
        email: shippingAddress.email,
        name: shippingAddress.contactName,
        company: shippingAddress.companyName,
        phone: shippingAddress.phone,
        country: shippingAddress.country,
        address: shippingAddress,
      },
      notes,
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
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    // Check if customer exists, create if not
    let customerId: string
    
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', shippingAddress.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          email: shippingAddress.email,
          name: shippingAddress.contactName,
          company: shippingAddress.companyName,
          phone: shippingAddress.phone,
          country: shippingAddress.country,
          address: {
            address1: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
        })
        .select('id')
        .single()

      if (customerError) {
        console.error('Failed to create customer:', customerError)
        // Continue without customer ID for now
        customerId = 'guest'
      } else {
        customerId = newCustomer.id
      }
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: 'pending',
        items: orderData.items,
        subtotal,
        shipping,
        total,
        currency: 'USD',
        payment_method: paymentMethod,
        payment_status: 'pending',
        shipping_address: shippingAddress,
        notes,
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      // Continue with payment processing even if DB insert fails
    }

    // Process payment based on method
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const returnUrl = `${siteUrl}/checkout/success?order=${orderNumber}`
    const cancelUrl = `${siteUrl}/checkout?cancelled=true`

    const paymentResult = await processPayment(orderData, returnUrl, cancelUrl)

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment processing failed' },
        { status: 400 }
      )
    }

    // For bank transfers, update order with bank info
    if (paymentMethod === 'tt' || paymentMethod === 'bank') {
      return NextResponse.json({
        success: true,
        orderNumber,
        paymentMethod,
        message: 'Order created successfully. Please complete payment via bank transfer.',
        bankInfo: getBankInfo(paymentMethod, shippingAddress.country),
      })
    }

    // For Stripe/PayPal, return redirect URL
    return NextResponse.json({
      success: true,
      orderNumber,
      paymentMethod,
      redirectUrl: paymentResult.redirectUrl,
      paymentId: paymentResult.paymentId,
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

interface BankInfoResponse {
  bankName: string
  accountName: string
  accountNumber: string
  routingNumber?: string
  swiftCode?: string
  iban?: string
  currency: string
  address?: string
  notes?: string
}

function getBankInfo(method: PaymentMethod, country?: string): BankInfoResponse {
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

  // Local bank accounts
  const localAccounts: Record<string, BankInfoResponse> = {
    'United States': {
      bankName: 'Bank of America',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****1234',
      routingNumber: '****5678',
      currency: 'USD',
    },
    'Canada': {
      bankName: 'TD Bank',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****5678',
      currency: 'CAD',
    },
    'United Kingdom': {
      bankName: 'Barclays Bank',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****9012',
      currency: 'GBP',
    },
    'Germany': {
      bankName: 'Deutsche Bank',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****3456',
      iban: 'DE89****3456',
      currency: 'EUR',
    },
    'France': {
      bankName: 'BNP Paribas',
      accountName: 'Nanjing Sunmay Outdoor Co., Ltd.',
      accountNumber: '****7890',
      iban: 'FR76****7890',
      currency: 'EUR',
    },
  }

  return localAccounts[country || 'United States'] || localAccounts['United States']
}
