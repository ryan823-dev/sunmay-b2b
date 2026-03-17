'use client'

import { useState } from 'react'
import { Send, Loader2, MountainSnow, Shield, Droplets, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'

interface AIHeroProps {
  headline: string
  subtitle: string
  description: string
  placeholderPrompt: string
  quickActions: { label: string; prompt: string }[]
  primaryCta: string
  secondaryCta: string
}

export function AIHero({
  headline,
  subtitle,
  description,
  placeholderPrompt,
  quickActions,
  primaryCta,
  secondaryCta,
}: AIHeroProps) {
  const { t } = useI18n()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = `/quote?message=${encodeURIComponent(prompt)}`
    }, 1000)
  }

  const handleQuickAction = (actionPrompt: string) => {
    setPrompt(actionPrompt)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background - 深色渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - 主内容 */}
          <div className="lg:col-span-7">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 mb-6">
              <MountainSnow className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {subtitle}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              {headline.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'text-orange-500' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-400 max-w-xl mb-8 leading-relaxed">
              {description}
            </p>

            {/* Technical Specs Bar */}
            <div className="flex flex-wrap gap-6 py-4 mb-8 border-y border-neutral-700">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Waterproof</div>
                  <div className="text-white font-mono font-bold">10,000mm+</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-sky-500" />
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Breathable</div>
                  <div className="text-white font-mono font-bold">8,000g/m²</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Windproof</div>
                  <div className="text-white font-mono font-bold">100%</div>
                </div>
              </div>
            </div>

            {/* AI Prompt Box */}
            <div className="bg-white/5 border border-white/10 p-1 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
                <div className="w-2 h-2 bg-orange-500 animate-pulse" />
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  AI Assistant · Quick Inquiry
                </span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={placeholderPrompt}
                className="w-full bg-transparent text-white placeholder-neutral-500 resize-none outline-none p-4 min-h-[80px] text-sm"
                rows={3}
              />
              <div className="flex items-center justify-between px-4 pb-4">
                <span className="text-xs text-neutral-600">
                  Human team confirms all orders
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt.trim()}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all",
                    prompt.trim()
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-8">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="px-4 py-2 bg-transparent border border-neutral-600 text-neutral-300 text-sm hover:bg-white/5 hover:border-neutral-500 hover:text-white transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold uppercase tracking-wider hover:bg-orange-600 transition-colors"
              >
                {primaryCta}
              </a>
              <a
                href="/quote"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-neutral-600 text-white font-semibold uppercase tracking-wider hover:bg-white/5 hover:border-neutral-500 transition-colors"
              >
                {secondaryCta}
              </a>
            </div>
          </div>

          {/* Right Column - 数据面板 */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {/* Stats Cards */}
              <div className="bg-white/5 border border-white/10 p-6">
                <div className="text-4xl font-extrabold text-white font-mono mb-1">20+</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <div className="text-4xl font-extrabold text-white font-mono mb-1">1.5M</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Pieces/Year</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 p-6">
                <div className="text-4xl font-extrabold text-orange-500 font-mono mb-1">200</div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider">MOQ Pieces</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <div className="text-4xl font-extrabold text-white font-mono mb-1">3</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Production Bases</div>
              </div>
            </div>

            {/* Capabilities List */}
            <div className="mt-4 bg-white/5 border border-white/10 p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
                Core Capabilities
              </div>
              <ul className="space-y-3">
                {[
                  'Fully seam-sealed construction',
                  'DWR & waterproof membranes',
                  'Custom color & design',
                  'Private label manufacturing',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
