'use client'

import { BarChart3, User, FlaskConical, Database, Shield, Settings, HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Brand } from '@/components/Brand'

export default function Sidebar() {
  const t = useTranslations('nav')
  const ts = useTranslations('sidebar')
  const pathname = usePathname()

  const navItems = [
    { name: t('dashboard'), icon: BarChart3, href: '/dashboard' },
    { name: t('assistantBuilder'), icon: User, href: '/assistant/builder' },
    { name: t('researchLab'), icon: FlaskConical, href: '/research/experiments' },
    { name: t('library'), icon: Database, href: '/library' },
    { name: t('security'), icon: Shield, href: '/security' },
    { name: t('settings'), icon: Settings, href: '/settings' },
    { name: t('help'), icon: HelpCircle, href: '/help' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Link href="/" aria-label="AI Prompt Research Lab home">
          <Brand tagline={false} />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <p className="mono-label px-3 pb-2">{ts('navigation')}</p>
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-secondary/70 text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-primary" />
                )}
                <span
                  className={cn(
                    'w-4 shrink-0 font-mono text-[10px]',
                    active ? 'text-primary' : 'text-muted-foreground/70'
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <item.icon className="h-4 w-4" />
                <span className={cn('font-medium', active && 'font-semibold')}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary">
            AL
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{ts('aiLab')}</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">admin@ai.lab</p>
          </div>
        </div>
      </div>
    </aside>
  )
}