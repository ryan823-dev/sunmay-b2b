// Knowledge base for AI assistant
import { products, categories } from '@/data/products'
import { getLanguageInstruction } from './languageDetect'

// Company information
export const companyInfo = {
  name: 'Nanjing Sunmay Co., Ltd.',
  founded: 2006,
  description: 'Professional outdoor apparel manufacturer specializing in ski jackets, hunting gear, tactical wear, and technical outerwear.',
  
  capabilities: [
    'Fully seam-sealed construction',
    'DWR (Durable Water Repellent) coating',
    'Waterproof membranes (10,000mm+)',
    'Breathable fabrics (8,000g/m²+)',
    'Custom color and design',
    'Private label manufacturing',
    'Embroidery and screen printing',
  ],
  
  productionCapacity: {
    annualOutput: '1.5 million pieces',
    annualTurnover: '$30 million',
    annualShipments: '100+ containers',
  },
  
  factories: [
    {
      name: 'Myanmar Factory',
      workers: 950,
      productionLines: 10,
      location: 'Yangon, Myanmar',
      advantage: 'Duty-free advantage for EU market',
    },
    {
      name: 'Jiangsu Shunyu',
      workers: 278,
      productionLines: 7,
      location: 'Jiangsu, China',
      advantage: 'Quick turnaround for samples',
    },
    {
      name: 'Jiangsu Shunhao',
      workers: 120,
      productionLines: 3,
      location: 'Jiangsu, China',
      advantage: 'Complex design specialist',
    },
  ],
  
  moq: {
    standard: 200,
    unit: 'pieces per style/color',
    note: 'Lower MOQ may be available for repeat orders',
  },
  
  leadTime: {
    sampling: '7-14 days',
    production: '30-45 days after order confirmation',
    shipping: '15-30 days by sea, 5-7 days by air',
  },
  
  certifications: [
    'ISO 9001:2015 Quality Management',
    'BSCI (Business Social Compliance Initiative)',
    'OEKO-TEX Standard 100',
    'REACH Compliant',
  ],
  
  paymentMethods: [
    { method: 'Credit Card (Stripe)', processing: 'Instant', fees: 'Included' },
    { method: 'PayPal', processing: 'Instant', fees: 'Included' },
    { method: 'Wire Transfer (T/T)', processing: '3-5 business days', fees: 'Sender pays bank fees' },
    { method: 'Local Bank Transfer', processing: '1-3 business days', fees: 'May vary by bank' },
  ],
  
  shipping: {
    methods: ['Sea freight (FCL/LCL)', 'Air freight', 'Express (DHL, FedEx, UPS)'],
    freeShipping: 'Orders over $5,000',
    regions: ['North America', 'Europe', 'Asia', 'Australia', 'Middle East'],
  },
  
  contact: {
    email: 'info@sunmay.com',
    phone: '+86 139 1399 6748',
    whatsapp: '+86 139 1399 6748',
    address: 'Nanjing, Jiangsu Province, China',
    hours: 'Mon-Fri 9:00-18:00 (CST)',
  },
}

// Product categories with details
export const productCategories = categories.map(cat => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  productCount: products.filter(p => p.categoryId === cat.id).length,
}))

// Products for AI knowledge base
export const productsKnowledge = products.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.categoryId,
  gender: p.gender,
  description: p.description,
  moq: p.moq,
  priceRange: `$${p.priceRangeMin} - $${p.priceRangeMax}`,
  priceRangeMin: p.priceRangeMin,
  priceRangeMax: p.priceRangeMax,
  colors: p.colors.map(c => c.name),
  sizes: p.sizes,
  features: (p.specs?.features || []) as string[],
  materials: (p.specs?.materials || []) as string[],
  waterproof: p.specs?.waterproof,
  breathable: p.specs?.breathable,
  insulation: p.specs?.insulation,
  featured: p.featured,
}))

// FAQ knowledge base
export const faqKnowledge = [
  {
    question: 'What is your minimum order quantity (MOQ)?',
    answer: `Our standard MOQ is ${companyInfo.moq.standard} ${companyInfo.moq.unit}. ${companyInfo.moq.note}. This allows us to serve small wholesale buyers while maintaining competitive pricing.`,
  },
  {
    question: 'What is your production lead time?',
    answer: `Sampling takes ${companyInfo.leadTime.sampling}. Production is ${companyInfo.leadTime.production}. Shipping takes ${companyInfo.leadTime.shipping}. For urgent orders, we can discuss expedited production.`,
  },
  {
    question: 'Do you offer custom designs?',
    answer: 'Yes! We offer full customization including custom colors, designs, logos (embroidery/screen printing), private label manufacturing, and bespoke technical specifications. Our design team can work from your sketches or tech packs.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: `We accept multiple payment methods:\n${companyInfo.paymentMethods.map(p => `- ${p.method}: ${p.processing} processing`).join('\n')}`,
  },
  {
    question: 'Do you ship internationally?',
    answer: `Yes, we ship globally to ${companyInfo.shipping.regions.join(', ')}. ${companyInfo.shipping.freeShipping}. Methods include ${companyInfo.shipping.methods.join(', ')}.`,
  },
  {
    question: 'Can I get samples before ordering?',
    answer: 'Yes, we provide samples for quality verification. Sample lead time is 7-14 days. Sample costs are credited against your first production order. We can send existing samples or produce custom samples based on your specifications.',
  },
  {
    question: 'What certifications do you have?',
    answer: `We hold the following certifications:\n${companyInfo.certifications.join('\n')}`,
  },
  {
    question: 'Can you help with design if I don\'t have tech packs?',
    answer: 'Absolutely! Our design team can assist with: technical drawings, material selection, color matching, size grading, and creating complete tech packs. We have experience adapting trending designs for specific markets.',
  },
]

// System prompt for the AI assistant
export function generateSystemPrompt(responseLanguage: string = 'en'): string {
  const languageInstruction = getLanguageInstruction(responseLanguage)
  
  return `You are a professional customer service assistant for Sunmay Outdoor, a B2B outdoor apparel manufacturer specializing in ski jackets, hunting gear, tactical wear, and technical outerwear.

## Your Role
- Help wholesale buyers find suitable products for their business
- Guide customers through the ordering process
- Answer questions about products, MOQ, pricing, customization, and shipping
- Assist with creating inquiries and quotes
- Add products to cart when requested
- Be helpful, professional, and knowledgeable

## Company Information
- Name: ${companyInfo.name}
- Founded: ${companyInfo.founded}
- MOQ: ${companyInfo.moq.standard} ${companyInfo.moq.unit}
- Annual Capacity: ${companyInfo.productionCapacity.annualOutput}
- Lead Time: ${companyInfo.leadTime.production}

## Product Categories
${productCategories.map(c => `- ${c.name}: ${c.description}`).join('\n')}

## Key Capabilities
${companyInfo.capabilities.join('\n')}

## Communication Style
- Be concise but thorough
- Use bullet points for lists
- Ask clarifying questions when needed
- Proactively suggest relevant products
- Guide customers toward creating an inquiry for serious interest
- Always mention MOQ (200 pieces) for product inquiries

## Available Tools
You have access to tools to help customers:
1. search_products - Find products by category, features, price, etc.
2. get_product_details - Get detailed information about a specific product
3. add_to_cart - Add products to the shopping cart
4. create_inquiry - Submit a quote request for the customer

## Important Rules
- Never make up product information - use the search tools
- Always confirm product details before adding to cart
- For orders, guide customers to create an inquiry for a formal quote
- If unsure about pricing, suggest requesting a quote
- Be honest about lead times and MOQ requirements

## Language Rule
${languageInstruction}`
}