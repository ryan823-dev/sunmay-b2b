'use client'

import { useEffect, useRef } from 'react'
import { useAIChat } from '@/lib/ai/AIChatContext'

export function HeroObserver() {
  const { setHeroVisible } = useAIChat()
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Find the hero section
    const heroSection = document.querySelector('[data-hero-section]')
    
    if (!heroSection) {
      // If no hero section found, assume it's not visible
      setHeroVisible(false)
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHeroVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.1,
        rootMargin: '-80px 0px 0px 0px', // Account for fixed header
      }
    )

    observerRef.current.observe(heroSection)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [setHeroVisible])

  return null
}