'use client'

import { useLocale } from 'next-intl'
import { Languages, ChevronDown, Check } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const localeLabels: Record<string, { short: string; full: string }> = {
  en: { short: 'EN', full: 'English' },
  id: { short: 'ID', full: 'Bahasa Indonesia' },
  zh: { short: '中', full: '中文' },
}

export function LocaleSwitcher({ variant = 'select' }: { variant?: 'select' | 'compact' }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (variant !== 'compact') return
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [variant])

  function change(nextLocale: string) {
    if (nextLocale === locale) {
      setIsOpen(false)
      return
    }
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
      setIsOpen(false)
    })
  }

  const current = localeLabels[locale] ?? localeLabels[routing.defaultLocale]

  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((open) => !open)}
          disabled={isPending}
          aria-label="Select language"
          aria-expanded={isOpen}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isOpen && 'bg-secondary'
          )}
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{current.short}</span>
          <ChevronDown
            className={cn(
              'h-3 w-3 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <div className="py-1">
              {routing.locales.map((loc) => {
                const data = localeLabels[loc]
                const isActive = loc === locale
                return (
                  <button
                    key={loc}
                    onClick={() => change(loc)}
                    disabled={isPending}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors',
                      'hover:bg-secondary focus:outline-none focus-visible:bg-secondary',
                      isActive && 'bg-primary/5 font-semibold text-primary'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex w-7 items-center justify-center rounded border border-border px-1 py-0.5 text-[10px] font-semibold',
                          isActive ? 'border-primary/40 bg-primary/10' : 'text-muted-foreground'
                        )}
                      >
                        {data.short}
                      </span>
                      <span className={isActive ? '' : 'text-foreground'}>{data.full}</span>
                    </span>
                    {isActive && <Check className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex h-10 items-center rounded-lg border border-input bg-card">
      <Languages className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
      <select
        value={locale}
        onChange={(event) => change(event.target.value)}
        disabled={isPending}
        aria-label="Select language"
        className="h-10 cursor-pointer appearance-none rounded-lg bg-transparent pl-9 pr-8 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc].full}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}