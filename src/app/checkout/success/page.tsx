import Link from 'next/link'
import { CheckCircle, Mail, Package, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Order Confirmed | Sunmay',
  description: 'Your order has been successfully placed.',
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We'll review your requirements and get back to you within 24 hours with a detailed quote and payment instructions.
          </p>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">You'll receive an email with your order details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Order Review</p>
                  <p className="text-sm text-gray-600">Our team will review and send a detailed quote</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Production Start</p>
                  <p className="text-sm text-gray-600">Once confirmed, production begins within 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Estimated Timeline</h3>
            <p className="text-sm text-gray-600">
              Production: 30-45 days | Shipping: 15-30 days (varies by destination)
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Questions?</strong> Contact us at{' '}
              <a href="mailto:info@sunmay.com" className="underline">
                info@sunmay.com
              </a>{' '}
              or call +86 139 1399 6748
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
