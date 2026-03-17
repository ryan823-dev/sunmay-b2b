'use client'

import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import { AIChatWidget } from './AIChatWidget'

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-orange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors group"
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900 animate-pulse" />
      </button>

      {/* Chat widget */}
      <AIChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}