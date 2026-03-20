'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/utils'
import { Check, CreditCard, Building2, ArrowLeft, Loader2, Copy, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaymentMethod } from '@/types/payment'

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
  'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Switzerland',
  'Poland', 'Czech Republic', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Australia', 'New Zealand', 'Japan', 'South Korea', 'Other'
]

const paymentMethods = [
  { id: 'stripe' as PaymentMethod, name: 'Credit Card (Stripe)', icon: CreditCard, description: 'Visa, Mastercard, American Express' },
  { id: 'paypal' as PaymentMethod, name: 'PayPal', icon: CreditCard, description: 'Pay with your PayPal account' },
  { id: 'tt' as PaymentMethod, name: 'Wire Transfer (T/T)', icon: Building2, description: 'Bank transfer within 3-5 business days' },
  { id: 'bank' as PaymentMethod, name: 'Local Bank Transfer', icon: Building2, description: 'Direct transfer to our local account' },
]

interface BankInfo {
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

export default function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, getSubtotal, getTotalPieces, meetsMOQ, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const [copied, setCopied] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
  })

  // Bank info for bank transfers
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const subtotal = getSubtotal()
  const totalPieces = getTotalPieces()
  const moqMet = meetsMOQ(200)

  // Calculate shipping
  const shipping = subtotal >= 5000 ? 0 : 150 + Math.floor(totalPieces / 100) * 25
  const total = subtotal + shipping

  // Check for cancelled payment
  useEffect(() => {
    if (searchParams.get('cancelled') === 'true') {
      setStep(2) // Go back to payment step
    }
  }, [searchParams])

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            Browse Products →
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const required = ['companyName', 'contactName', 'email', 'country', 'address', 'city', 'postalCode']
    return required.every(field => formData[field as keyof typeof formData].trim() !== '')
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          shippingAddress: {
            companyName: formData.companyName,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone || undefined,
            country: formData.country,
            address: formData.address,
            city: formData.city,
            state: formData.state || undefined,
            postalCode: formData.postalCode,
          },
          paymentMethod,
          notes: formData.notes || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Handle different payment methods
      if (paymentMethod === 'stripe' || paymentMethod === 'paypal') {
        // Redirect to payment page
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl
          return
        }
      }

      // For bank transfers, show bank info
      if (paymentMethod === 'tt' || paymentMethod === 'bank') {
        setBankInfo(data.bankInfo)
        setOrderNumber(data.orderNumber)
        clearCart()
        setStep(4) // Show bank transfer instructions
        return
      }

      // Success - redirect to success page
      clearCart()
      router.push(`/checkout/success?order=${data.orderNumber}`)

    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/products" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className={cn(
                    "hidden sm:inline text-sm",
                    step >= s ? "text-gray-900 font-medium" : "text-gray-500"
                  )}>
                    {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                  </span>
                  {s < 3 && <div className="w-8 h-px bg-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                        paymentMethod === method.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        paymentMethod === method.id ? "border-blue-600" : "border-gray-300"
                      )}>
                        {paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <method.icon className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Bank transfer note */}
                {(paymentMethod === 'tt' || paymentMethod === 'bank') && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Bank transfer orders will be processed after payment confirmation. 
                      You will receive bank account details and payment instructions after placing your order.
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                
                {/* Shipping Info */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                  <div className="text-gray-900">
                    <p>{formData.companyName}</p>
                    <p>{formData.contactName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.postalCode}</p>
                    <p>{formData.country}</p>
                    <p>{formData.email}</p>
                    {formData.phone && <p>{formData.phone}</p>}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                  <p className="text-gray-900">
                    {paymentMethods.find(m => m.id === paymentMethod)?.name}
                  </p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                  <div className="border rounded-lg divide-y">
                    {state.items.map((item) => (
                      <div key={`${item.productId}-${item.color}`} className="p-4 flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">{item.color} | {item.sizes.reduce((sum, s) => sum + s.quantity, 0)} pieces</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.sizes.reduce((sum, s) => sum + s.quantity, 0) * item.unitPrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      paymentMethod === 'stripe' ? 'Pay with Stripe' :
                      paymentMethod === 'paypal' ? 'Pay with PayPal' :
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Bank Transfer Instructions */}
            {step === 4 && bankInfo && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
                  <p className="text-gray-600 mt-2">Order Number: <span className="font-mono font-bold">{orderNumber}</span></p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Transfer Instructions</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please complete your payment using the bank account details below. Your order will be processed after we confirm your payment.
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Bank Name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{bankInfo.bankName}</span>
                        <button onClick={() => copyToClipboard(bankInfo.bankName, 'bank')} className="text-gray-400 hover:text-gray-600">
                          {copied === 'bank' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Account Name</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-right">{bankInfo.accountName}</span>
                        <button onClick={() => copyToClipboard(bankInfo.accountName, 'name')} className="text-gray-400 hover:text-gray-600">
                          {copied === 'name' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{bankInfo.accountNumber}</span>
                        <button onClick={() => copyToClipboard(bankInfo.accountNumber, 'account')} className="text-gray-400 hover:text-gray-600">
                          {copied === 'account' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {bankInfo.swiftCode && (
                      <div className="flex justify-between items-center py-2 border-b border-blue-100">
                        <span className="text-gray-600">SWIFT Code</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{bankInfo.swiftCode}</span>
                          <button onClick={() => copyToClipboard(bankInfo.swiftCode!, 'swift')} className="text-gray-400 hover:text-gray-600">
                            {copied === 'swift' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankInfo.iban && (
                      <div className="flex justify-between items-center py-2 border-b border-blue-100">
                        <span className="text-gray-600">IBAN</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{bankInfo.iban}</span>
                          <button onClick={() => copyToClipboard(bankInfo.iban!, 'iban')} className="text-gray-400 hover:text-gray-600">
                            {copied === 'iban' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {bankInfo.routingNumber && (
                      <div className="flex justify-between items-center py-2 border-b border-blue-100">
                        <span className="text-gray-600">Routing Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{bankInfo.routingNumber}</span>
                          <button onClick={() => copyToClipboard(bankInfo.routingNumber!, 'routing')} className="text-gray-400 hover:text-gray-600">
                            {copied === 'routing' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Currency</span>
                      <span className="font-medium">{bankInfo.currency}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Amount to Transfer</span>
                      <span className="font-bold text-lg text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {bankInfo.notes && (
                    <p className="text-sm text-gray-500 mt-4 italic">{bankInfo.notes}</p>
                  )}
                </div>

                <div className="bg-amber-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-amber-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Include your order number ({orderNumber}) in the transfer reference</li>
                    <li>• Bank transfers typically take 1-5 business days to process</li>
                    <li>• You will receive a confirmation email once payment is verified</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({totalPieces} pieces)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal >= 5000 && (
                  <p className="text-xs text-green-600">Free shipping on orders over $5,000</p>
                )}
                <hr className="my-4" />
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              {!moqMet && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                  MOQ requirement not met for some items
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                <p>• Final price will be confirmed after order review</p>
                <p>• Production time: 30-45 days after payment confirmation</p>
                <p>• Payment terms vary by method selected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
