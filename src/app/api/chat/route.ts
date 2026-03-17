import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage, Tool, ToolCall } from '@/types/chat'
import { generateSystemPrompt, productsKnowledge, faqKnowledge, companyInfo } from '@/lib/ai/knowledge'
import { products } from '@/data/products'

// API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const CLAUDE_MODEL = 'anthropic/claude-3-haiku'
const GLM_API_URL = process.env.GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const GLM_MODEL = 'glm-4'

// Define available tools
const tools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Search for products based on criteria like category, features, price range, or keywords. Returns matching products.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query or keywords' },
          category: { type: 'string', description: 'Product category (ski-snowboard, hunting-outdoor, tactical-workwear, urban-outdoor)' },
          gender: { type: 'string', description: 'Gender (men, women, unisex)' },
          minPrice: { type: 'number', description: 'Minimum price' },
          maxPrice: { type: 'number', description: 'Maximum price' },
          features: { type: 'array', items: { type: 'string' }, description: 'Required features (waterproof, breathable, insulated, etc.)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_product_details',
      description: 'Get detailed information about a specific product by ID or slug.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'Product ID' },
          slug: { type: 'string', description: 'Product URL slug' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_to_cart',
      description: 'Add a product to the shopping cart. Use this when customer wants to order a product.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'Product ID to add' },
          color: { type: 'string', description: 'Color name' },
          sizes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                size: { type: 'string' },
                quantity: { type: 'number' },
              },
            },
            description: 'Sizes and quantities',
          },
        },
        required: ['productId', 'color', 'sizes'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_inquiry',
      description: 'Create a quote request inquiry for the customer. Use when customer wants a formal quote or has specific requirements.',
      parameters: {
        type: 'object',
        properties: {
          companyName: { type: 'string', description: 'Company name' },
          contactName: { type: 'string', description: 'Contact person name' },
          email: { type: 'string', description: 'Email address' },
          phone: { type: 'string', description: 'Phone number' },
          country: { type: 'string', description: 'Country' },
          message: { type: 'string', description: 'Detailed requirements or message' },
          products: { type: 'array', items: { type: 'string' }, description: 'Product IDs interested in' },
          quantity: { type: 'string', description: 'Estimated quantity range' },
        },
        required: ['companyName', 'contactName', 'email', 'country', 'message'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_faq_answer',
      description: 'Get answer to frequently asked questions about MOQ, shipping, payment, etc.',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'Topic keyword (moq, shipping, payment, samples, certification, etc.)' },
        },
        required: ['topic'],
      },
    },
  },
]

// Tool execution functions
function executeSearchProducts(params: {
  query?: string
  category?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  features?: string[]
}) {
  let results = productsKnowledge

  if (params.category) {
    const catLower = params.category.toLowerCase()
    results = results.filter(p => 
      p.category.toLowerCase().includes(catLower) ||
      catLower.includes(p.category.toLowerCase())
    )
  }

  if (params.gender) {
    results = results.filter(p => 
      p.gender.toLowerCase() === params.gender!.toLowerCase() ||
      p.gender.toLowerCase() === 'unisex'
    )
  }

  if (params.minPrice !== undefined) {
    results = results.filter(p => p.priceRangeMin >= params.minPrice!)
  }

  if (params.maxPrice !== undefined) {
    results = results.filter(p => p.priceRangeMax <= params.maxPrice!)
  }

  if (params.features && params.features.length > 0) {
    results = results.filter(p => {
      const featuresList = Array.isArray(p.features) ? p.features : []
      return params.features!.some(f => 
        featuresList.some(pf => pf.toLowerCase().includes(f.toLowerCase())) ||
        (f.toLowerCase() === 'waterproof' && p.waterproof) ||
        (f.toLowerCase() === 'breathable' && p.breathable) ||
        (f.toLowerCase() === 'insulated' && p.insulation)
      )
    })
  }

  if (params.query) {
    const queryLower = params.query.toLowerCase()
    results = results.filter(p =>
      p.name.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower)
    )
  }

  return {
    success: true,
    count: results.length,
    products: results.slice(0, 8).map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      gender: p.gender,
      priceRange: p.priceRange,
      colors: p.colors.slice(0, 5),
      sizes: p.sizes,
      moq: p.moq,
      features: p.features.slice(0, 3),
      waterproof: p.waterproof,
      breathable: p.breathable,
    })),
  }
}

function executeGetProductDetails(params: { productId?: string; slug?: string }) {
  let product = null

  if (params.productId) {
    product = products.find(p => p.id === params.productId)
  } else if (params.slug) {
    product = products.find(p => p.slug === params.slug)
  }

  if (!product) {
    return { success: false, error: 'Product not found' }
  }

  return {
    success: true,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.categoryId,
      gender: product.gender,
      description: product.description,
      moq: product.moq,
      priceRangeMin: product.priceRangeMin,
      priceRangeMax: product.priceRangeMax,
      colors: product.colors,
      sizes: product.sizes,
      images: product.images,
      specs: product.specs,
      featured: product.featured,
    },
  }
}

function executeAddToCart(params: {
  productId: string
  color: string
  sizes: { size: string; quantity: number }[]
}) {
  const product = products.find(p => p.id === params.productId)
  
  if (!product) {
    return { success: false, error: 'Product not found' }
  }

  const colorExists = product.colors.some(c => 
    c.name.toLowerCase() === params.color.toLowerCase()
  )

  if (!colorExists) {
    return { 
      success: false, 
      error: `Color "${params.color}" not available. Available colors: ${product.colors.map(c => c.name).join(', ')}` 
    }
  }

  const totalQty = params.sizes.reduce((sum, s) => sum + s.quantity, 0)
  
  return {
    success: true,
    message: `Added to cart: ${product.name} in ${params.color}, ${totalQty} pieces total. MOQ is ${product.moq} pieces.`,
    cartItem: {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      color: params.color,
      sizes: params.sizes,
      unitPrice: product.priceRangeMin,
      image: product.images[0],
      moq: product.moq,
    },
    totalPieces: totalQty,
    meetsMOQ: totalQty >= product.moq,
  }
}

function executeCreateInquiry(params: {
  companyName: string
  contactName: string
  email: string
  phone?: string
  country: string
  message: string
  products?: string[]
  quantity?: string
}) {
  const inquiryId = `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  
  return {
    success: true,
    inquiryId,
    message: 'Inquiry created successfully! Our team will contact you within 24 hours.',
    data: {
      inquiryId,
      ...params,
      createdAt: new Date().toISOString(),
    },
  }
}

function executeGetFaqAnswer(params: { topic: string }) {
  const topicLower = params.topic.toLowerCase()
  
  const match = faqKnowledge.find(faq => 
    faq.question.toLowerCase().includes(topicLower) ||
    faq.answer.toLowerCase().includes(topicLower)
  )

  if (match) {
    return {
      success: true,
      question: match.question,
      answer: match.answer,
    }
  }

  const defaultAnswers: Record<string, string> = {
    moq: `Our minimum order quantity is ${companyInfo.moq.standard} ${companyInfo.moq.unit}. ${companyInfo.moq.note}.`,
    shipping: `We ship globally. ${companyInfo.shipping.freeShipping}. Methods: ${companyInfo.shipping.methods.join(', ')}.`,
    payment: `We accept: ${companyInfo.paymentMethods.map(p => p.method).join(', ')}.`,
    samples: 'Yes, we provide samples. Lead time is 7-14 days. Sample costs are credited against your first order.',
    leadtime: `Sampling: ${companyInfo.leadTime.sampling}. Production: ${companyInfo.leadTime.production}. Shipping: ${companyInfo.leadTime.shipping}.`,
    certification: `We hold: ${companyInfo.certifications.join(', ')}.`,
    factory: `We have 3 production bases: ${companyInfo.factories.map(f => `${f.name} (${f.workers} workers)`).join(', ')}.`,
  }

  for (const [key, answer] of Object.entries(defaultAnswers)) {
    if (topicLower.includes(key)) {
      return { success: true, answer }
    }
  }

  return {
    success: false,
    message: 'No specific FAQ found. Please contact our team for detailed information.',
    contact: companyInfo.contact,
  }
}

// Execute tool call
function executeToolCall(toolCall: ToolCall): unknown {
  const { name, arguments: argsString } = toolCall.function
  const args = JSON.parse(argsString)

  switch (name) {
    case 'search_products':
      return executeSearchProducts(args)
    case 'get_product_details':
      return executeGetProductDetails(args)
    case 'add_to_cart':
      return executeAddToCart(args)
    case 'create_inquiry':
      return executeCreateInquiry(args)
    case 'get_faq_answer':
      return executeGetFaqAnswer(args)
    default:
      return { error: `Unknown tool: ${name}` }
  }
}

// Call OpenRouter (Claude)
async function callOpenRouter(
  messages: ChatMessage[],
  systemPrompt: string,
  useTools: boolean = true
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY
  
  if (!apiKey) {
    return { success: false, error: 'OpenRouter API key not configured' }
  }

  const apiMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  ]

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Sunmay Outdoor AI Assistant',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        messages: apiMessages,
        tools: useTools ? tools : undefined,
        tool_choice: useTools ? 'auto' : undefined,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `OpenRouter error: ${error}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: `OpenRouter fetch error: ${error}` }
  }
}

// Call GLM (fallback)
async function callGLM(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const apiKey = process.env.GLM_API_KEY
  
  if (!apiKey) {
    return { success: false, error: 'GLM API key not configured' }
  }

  const apiMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'tool' ? 'user' : m.role,
      content: m.content,
    })),
  ]

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GLM_MODEL,
        messages: apiMessages,
        tools: tools,
        tool_choice: 'auto',
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `GLM error: ${error}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: `GLM fetch error: ${error}` }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, language = 'en', cartItems = [] } = body as {
      messages: ChatMessage[]
      language?: string
      cartItems?: unknown[]
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const systemPrompt = generateSystemPrompt(language)
    
    // Add cart context if items exist
    let contextMessages = [...messages]
    if (cartItems.length > 0) {
      contextMessages = [
        ...messages,
        {
          role: 'system' as const,
          content: `Current cart contents: ${JSON.stringify(cartItems)}. Remind customer about MOQ requirements if cart doesn't meet 200 pieces per style.`,
        },
      ]
    }

    // Try OpenRouter (Claude) first
    let result = await callOpenRouter(contextMessages, systemPrompt)
    let usedModel = 'claude'
    
    // Fallback to GLM if OpenRouter fails
    if (!result.success) {
      console.log('OpenRouter failed, falling back to GLM:', result.error)
      result = await callGLM(contextMessages, systemPrompt)
      usedModel = 'glm'
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'AI service unavailable' },
        { status: 500 }
      )
    }

    const data = result.data as Record<string, unknown>
    const assistantMessage = (data.choices as unknown[])?.[0] as Record<string, unknown> | undefined
    const messageContent = assistantMessage?.message as Record<string, unknown> | undefined

    // Handle tool calls
    const toolCalls = messageContent?.tool_calls as unknown[] | undefined
    if (toolCalls && toolCalls.length > 0) {
      const toolResults: { tool_call_id: string; result: unknown }[] = []
      
      for (const toolCall of toolCalls) {
        const tc = toolCall as Record<string, unknown>
        const func = tc.function as Record<string, unknown>
        const result = executeToolCall({
          id: tc.id as string,
          type: 'function',
          function: {
            name: func.name as string,
            arguments: func.arguments as string,
          },
        })
        toolResults.push({
          tool_call_id: tc.id as string,
          result,
        })
      }

      // Find cart item
      const cartAdd = toolResults.find(r => {
        const res = r.result as Record<string, unknown>
        return res?.cartItem !== undefined
      })

      // Find inquiry result
      const inquiryResult = toolResults.find(r => {
        const res = r.result as Record<string, unknown>
        return res?.inquiryId !== undefined
      })

      // Continue conversation with tool results
      const followUpMessages: ChatMessage[] = [
        ...contextMessages,
        { role: 'assistant', content: '', tool_calls: toolCalls as ToolCall[] },
        ...toolResults.map(tr => ({
          role: 'tool' as const,
          content: JSON.stringify(tr.result),
          tool_call_id: tr.tool_call_id,
        })),
      ]

      // Get final response (try same model first, fallback if needed)
      let followUpResult = usedModel === 'claude' 
        ? await callOpenRouter(followUpMessages, systemPrompt, false)
        : await callGLM(followUpMessages, systemPrompt)
      
      if (!followUpResult.success && usedModel === 'claude') {
        followUpResult = await callGLM(followUpMessages, systemPrompt)
      }

      const followUpData = followUpResult.data as Record<string, unknown> | undefined
      const followUpChoices = followUpData?.choices as unknown[] | undefined
      const finalMessage = followUpChoices?.[0] as Record<string, unknown> | undefined
      const finalContent = (finalMessage?.message as Record<string, unknown>)?.content as string || 'I processed your request.'

      return NextResponse.json({
        message: finalContent,
        toolResults,
        cartItem: cartAdd ? (cartAdd.result as Record<string, unknown>)?.cartItem || null : null,
        inquiry: inquiryResult ? inquiryResult.result : null,
        model: usedModel,
      })
    }

    return NextResponse.json({
      message: (messageContent?.content as string) || 'I apologize, I could not process your request.',
      model: usedModel,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}