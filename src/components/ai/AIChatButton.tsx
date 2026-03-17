'use client'

import { MessageSquare } from 'lucide-react'
import { useAIChat } from '@/lib/ai/AIChatContext'
import { AIChatWidget } from './AIChatWidget'

export function AIChatButton() {
  const { isOpen, openChat, isHeroVisible } = useAIChat()

  return (
    <>
      {/* Floating button - only show when Hero is not visible and chat is not open */}
      {!isOpen && !isHeroVisible && (
        <button
          onClick={() => openChat()}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-orange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900 animate-pulse" />
        </button>
      )}

      {/* Chat widget */}
      <AIChatWidget />
    </>
  )
}