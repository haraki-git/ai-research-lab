'use client'

import { BarChart3, User, FlaskConical, Database, Shield, Settings, HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export default function MobileNav() {
  const t = useTranslations('nav')
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around border-t border-border bg-card/95 backdrop-blur lg:hidden">
      {navItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-1 px-1 pb-3 pt-2.5 text-[11px] font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && <span className="absolute top-0 h-0.5 w-8 bg-primary" />}
            <item.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}