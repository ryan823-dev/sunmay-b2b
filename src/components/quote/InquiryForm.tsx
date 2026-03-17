'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Switzerland',
  'Poland', 'Czech Republic', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Australia', 'New Zealand', 'Japan', 'South Korea', 'Russia',
  'Other'
]

const productCategories = [
  'Ski & Snowboard Jackets',
  'Hunting & Outdoor Gear',
  'Tactical & Workwear',
  'Down & Insulated Jackets',
  'Pants & Bibs',
  'Custom Design',
]

interface FormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  country: string
  products: string[]
  quantity: string
  timeline: string
  message: string
}

export function InquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    products: [],
    quantity: '',
    timeline: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleProductToggle = (product: string) => {
    const newProducts = formData.products.includes(product)
      ? formData.products.filter(p => p !== product)
      : [...formData.products, product]
    setFormData({ ...formData, products: newProducts })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.country) {
      newErrors.country = 'Please select a country'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In production, this would submit to Supabase
    console.log('Submitting inquiry:', formData)
    
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your interest. Our team will review your requirements and get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false)
            setFormData({
              companyName: '',
              contactName: '',
              email: '',
              phone: '',
              country: '',
              products: [],
              quantity: '',
              timeline: '',
              message: '',
            })
          }}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Submit Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <div className="grid gap-6">
        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.companyName ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Your company name"
            />
            {errors.companyName && (
              <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.contactName ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Your full name"
            />
            {errors.contactName && (
              <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.email ? "border-red-500" : "border-gray-300"
              )}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              errors.country ? "border-red-500" : "border-gray-300"
            )}
          >
            <option value="">Select your country</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{errors.country}</p>
          )}
        </div>

        {/* Product Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Products Interested In
          </label>
          <div className="flex flex-wrap gap-2">
            {productCategories.map(product => (
              <button
                key={product}
                type="button"
                onClick={() => handleProductToggle(product)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  formData.products.includes(product)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {product}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Timeline */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Quantity
            </label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select quantity range</option>
              <option value="200-500">200 - 500 pieces</option>
              <option value="500-1000">500 - 1,000 pieces</option>
              <option value="1000-5000">1,000 - 5,000 pieces</option>
              <option value="5000-10000">5,000 - 10,000 pieces</option>
              <option value="10000+">10,000+ pieces</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">When do you need delivery?</option>
              <option value="urgent">Urgent (within 30 days)</option>
              <option value="1-2months">1-2 months</option>
              <option value="2-3months">2-3 months</option>
              <option value="3+months">3+ months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Requirements
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please describe your requirements: specific products, colors, sizes, custom features, target price, etc."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Inquiry
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </form>
  )
}
