'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Loader2, ShoppingCart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart/CartContext'
import { useI18n } from '@/i18n'
import { useAIChat } from '@/lib/ai/AIChatContext'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  cartItem?: CartItemData
}

interface CartItemData {
  productId: string
  productName: string
  productSlug?: string
  color: string
  sizes: { size: string; quantity: number }[]
  unitPrice: number
  image: string
  moq: number
}

export function AIChatWidget() {
  const { locale } = useI18n()
  const { addItem, state } = useCart()
  const { isOpen, closeChat, initialMessage, clearInitialMessage } = useAIChat()
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your Sunmay Outdoor assistant. I can help you:\n\n• Find the right products\n• Answer questions about MOQ, pricing, and customization\n• Add items to your cart\n• Create a quote request\n\nWhat are you looking for today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialMessageProcessed = useRef(false)

  // Handle initial message from Hero
  useEffect(() => {
    if (isOpen && initialMessage && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true
      setInput(initialMessage)
      clearInitialMessage()
      // Auto-send after a brief delay
      setTimeout(() => {
        sendMessageWithText(initialMessage)
      }, 100)
    }
  }, [isOpen, initialMessage])

  // Reset processed flag when chat closes
  useEffect(() => {
    if (!isOpen) {
      initialMessageProcessed.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content,
          })),
          language: locale,
          cartItems: state.items,
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      if (data.cartItem) {
        assistantMessage.cartItem = data.cartItem
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    await sendMessageWithText(input)
  }

  const handleAddToCart = (cartItem: CartItemData) => {
    addItem({
      productId: cartItem.productId,
      productName: cartItem.productName,
      productSlug: cartItem.productSlug || cartItem.productId,
      color: cartItem.color,
      colorHex: '#000000',
      sizes: cartItem.sizes,
      unitPrice: cartItem.unitPrice,
      image: cartItem.image,
      moq: cartItem.moq,
    })

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✓ Added ${cartItem.productName} to your cart! You can continue browsing or proceed to checkout when ready.`,
      timestamp: new Date(),
    }])
  }

  const quickActions = [
    'Show me ski jackets',
    'What is your MOQ?',
    'Hunting gear for men',
    'Custom design options',
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-4 md:inset-auto md:bottom-20 md:right-4 md:w-[420px] md:h-[560px] bg-neutral-900 border border-neutral-700 flex flex-col z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700 bg-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Sunmay AI Assistant</h3>
            <p className="text-xs text-neutral-400">Powered by Claude</p>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 text-sm",
                message.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-800 text-neutral-100'
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {message.cartItem && (
                <div className="mt-3 p-2 bg-neutral-700 border border-neutral-600">
                  <p className="text-xs text-neutral-300 mb-2">
                    {message.cartItem.productName} - {message.cartItem.color}
                  </p>
                  <button
                    onClick={() => handleAddToCart(message.cartItem!)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 px-3 py-2 text-neutral-400 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => {
                  setInput(action)
                  inputRef.current?.focus()
                }}
                className="px-2 py-1 text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-neutral-700 bg-neutral-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about products, MOQ, pricing..."
            className="flex-1 bg-neutral-700 text-white placeholder-neutral-400 px-3 py-2 text-sm outline-none border border-neutral-600 focus:border-orange-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={cn(
              "px-3 py-2 transition-colors",
              input.trim() && !isLoading
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-neutral-700 text-neutral-500'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-neutral-500 mt-2 text-center">
          AI responses may need verification. Contact us for official quotes.
        </p>
      </div>
    </div>
  )
}