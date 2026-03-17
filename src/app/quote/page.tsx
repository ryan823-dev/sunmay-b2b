import { Metadata } from 'next'
import Link from 'next/link'
import { InquiryForm } from '@/components/quote/InquiryForm'
import { 
  Clock, ShieldCheck, Users, Globe2, 
  CheckCircle, MessageSquare, FileText, Send 
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Request a Quote | Sunmay - Professional Outdoor Apparel',
  description: 'Get a custom quote for your outdoor apparel needs. MOQ 200 pieces. Custom designs, private labeling, and special packaging available.',
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Request a Quote</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Tell us about your requirements and get a detailed quote within 24 hours. 
            Whether you need 200 pieces or 20,000, we have the capacity to deliver.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <InquiryForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Why Request Quote */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why Request a Quote?</h3>
              <ul className="space-y-3">
                {[
                  { icon: CheckCircle, text: 'Custom designs and specifications' },
                  { icon: CheckCircle, text: 'Private labeling and branding' },
                  { icon: CheckCircle, text: 'Special packaging requirements' },
                  { icon: CheckCircle, text: 'Large quantity discounts' },
                  { icon: CheckCircle, text: 'Mixed product orders' },
                  { icon: CheckCircle, text: 'Rush production requests' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <item.icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  { step: 1, icon: Send, title: 'Submit Inquiry', desc: 'Fill out the form with your requirements' },
                  { step: 2, icon: FileText, title: 'Quote Preparation', desc: 'We prepare a detailed quote within 24 hours' },
                  { step: 3, icon: MessageSquare, title: 'Discussion', desc: 'We discuss details and finalize specifications' },
                  { step: 4, icon: CheckCircle, title: 'Order Confirmation', desc: 'You approve and we begin production' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Prefer to Talk?</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:info@sunmay.com" className="text-blue-600 hover:underline">
                    info@sunmay.com
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:+8613913996748" className="text-blue-600 hover:underline">
                    +86 139 1399 6748
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Business Hours</p>
                  <p className="text-gray-600">Mon-Fri 9:00-18:00 (CST)</p>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">20+</div>
                  <div className="text-xs text-gray-500">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1.5M</div>
                  <div className="text-xs text-gray-500">Pieces/Year</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">35+</div>
                  <div className="text-xs text-gray-500">Countries Served</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">24h</div>
                  <div className="text-xs text-gray-500">Quote Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What is the minimum order quantity?',
                a: 'Our standard MOQ is 200 pieces per style/color combination. You can mix sizes within the same style/color. For smaller orders, please contact us to discuss options.',
              },
              {
                q: 'What is the typical production time?',
                a: 'Standard production time is 30-45 days after order confirmation and receipt of payment. Rush orders may be available for an additional fee.',
              },
              {
                q: 'Can I request custom designs?',
                a: 'Yes! We specialize in custom designs. Share your specifications, sketches, or reference images, and our design team will work with you to create the perfect product.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept PayPal, credit cards via Stripe, wire transfers (T/T), and local bank transfers in select countries. Payment terms vary by order size and customer history.',
              },
              {
                q: 'Do you offer private labeling?',
                a: 'Yes, we offer private labeling, custom hang tags, branded packaging, and other branding services. Let us know your requirements in the inquiry form.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
