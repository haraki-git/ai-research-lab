'use client'

import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LocaleSwitcherCompact } from '@/components/LocaleSwitcherCompact'

export default function Header({ leading }: { leading?: ReactNode }) {
  const t = useTranslations('header')

  return (
    <header className="flex h-16 shrink-0 items-center gap-6 border-b border-border bg-card px-6">
      {leading ?? (
        <div className="relative hidden w-72 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('search')}
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 font-mono text-xs placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      <div className="flex-1" />

      <div className="hidden items-center gap-2 lg:flex">
        <span className="mr-1 flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
          <span className="status-dot h-1.5 w-1.5 bg-success" />
          <span className="mono-label">{t('labStatus')}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <LocaleSwitcherCompact />
        <ThemeToggle />
      </div>
    </header>
  )
}