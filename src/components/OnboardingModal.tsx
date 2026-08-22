'use client'

import { useState, useSyncExternalStore } from 'react'
import { X, ArrowRight, Rocket, Settings, User, Shield, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'onboarding_done'

interface Slide {
  icon: typeof Rocket
  titleKey: string
  descKey: string
  color: string
}

const slides: Slide[] = [
  { icon: Rocket, titleKey: 'slides.welcome.title', descKey: 'slides.welcome.desc', color: 'text-primary' },
  { icon: Settings, titleKey: 'slides.provider.title', descKey: 'slides.provider.desc', color: 'text-primary' },
  { icon: User, titleKey: 'slides.builder.title', descKey: 'slides.builder.desc', color: 'text-primary' },
  { icon: Shield, titleKey: 'slides.experiment.title', descKey: 'slides.experiment.desc', color: 'text-primary' },
]

function getOnboardingDone(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return true
  }
}

function subscribeOnboardingDone(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function OnboardingModal() {
  const t = useTranslations('onboarding')
  const [current, setCurrent] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const onboardingDone = useSyncExternalStore(subscribeOnboardingDone, getOnboardingDone)

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    setDismissed(true)
  }

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      close()
    }
  }

  if (onboardingDone || dismissed) return null

  const slide = slides[current]
  const isLast = current === slides.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl">
        <button
          onClick={close}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 pb-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
            <slide.icon className={cn('h-8 w-8', slide.color)} />
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {t(slide.titleKey)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t(slide.descKey)}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === current ? 'w-6 bg-primary' : 'w-1.5 bg-border'
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={close}>
              {t('skip')}
            </Button>
            <Button size="sm" onClick={next} className="gap-1.5">
              {isLast ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  {t('getStarted')}
                </>
              ) : (
                <>
                  {t('next')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
