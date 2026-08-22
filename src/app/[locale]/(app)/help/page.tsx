'use client'

import { useState } from 'react'
import { HelpCircle, BookOpen, Rocket, MessageCircle, Info, ChevronRight, ChevronDown, ArrowRight, Settings, User, FlaskConical, Shield, Database, BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type Tab = 'getting-started' | 'features' | 'faq' | 'about'

interface FAQItem {
  q: string
  a: string
}

export default function HelpPage() {
  const t = useTranslations('help')
  const [activeTab, setActiveTab] = useState<Tab>('getting-started')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const tabs: { id: Tab; label: string; icon: typeof HelpCircle }[] = [
    { id: 'getting-started', label: t('tabs.gettingStarted'), icon: Rocket },
    { id: 'features', label: t('tabs.features'), icon: BookOpen },
    { id: 'faq', label: t('tabs.faq'), icon: MessageCircle },
    { id: 'about', label: t('tabs.about'), icon: Info },
  ]

  const steps = [
    { icon: Settings, title: t('steps.configure.title'), desc: t('steps.configure.desc'), href: '/settings', details: t('steps.configure.details') },
    { icon: User, title: t('steps.build.title'), desc: t('steps.build.desc'), href: '/assistant/builder', details: t('steps.build.details') },
    { icon: FlaskConical, title: t('steps.experiment.title'), desc: t('steps.experiment.desc'), href: '/research/experiments', details: t('steps.experiment.details') },
    { icon: Shield, title: t('steps.security.title'), desc: t('steps.security.desc'), href: '/security', details: t('steps.security.details') },
  ]

  const features = [
    { icon: BarChart3, title: t('featuresList.dashboard.title'), desc: t('featuresList.dashboard.desc'), href: '/dashboard' },
    { icon: User, title: t('featuresList.builder.title'), desc: t('featuresList.builder.desc'), href: '/assistant/builder' },
    { icon: FlaskConical, title: t('featuresList.research.title'), desc: t('featuresList.research.desc'), href: '/research/experiments' },
    { icon: Database, title: t('featuresList.library.title'), desc: t('featuresList.library.desc'), href: '/library' },
    { icon: Shield, title: t('featuresList.security.title'), desc: t('featuresList.security.desc'), href: '/security' },
    { icon: Settings, title: t('featuresList.settings.title'), desc: t('featuresList.settings.desc'), href: '/settings' },
  ]

  const faqs: FAQItem[] = [
    { q: t('faqList.q1'), a: t('faqList.a1') },
    { q: t('faqList.q2'), a: t('faqList.a2') },
    { q: t('faqList.q3'), a: t('faqList.a3') },
    { q: t('faqList.q4'), a: t('faqList.a4') },
    { q: t('faqList.q5'), a: t('faqList.a5') },
    { q: t('faqList.q6'), a: t('faqList.a6') },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
          <HelpCircle className="h-5 w-5 text-primary" />
        </span>
      </div>

      <div className="flex gap-1 rounded-md border border-border bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors',
              activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'getting-started' && (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('gettingStartedIntro')}</p>
          {steps.map((step, index) => (
            <Card key={index} className="p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <step.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  <p className="mt-2 text-sm text-foreground/80">{step.details}</p>
                  <Link href={step.href}>
                    <Button variant="outline" size="sm" className="mt-3 gap-1.5">
                      Go to {step.title}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'features' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <feature.icon className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                  <Link href={feature.href}>
                    <Button variant="ghost" size="sm" className="mt-2 gap-1.5 px-0 text-primary hover:text-primary/80">
                      Open <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
              {openFaq === index && (
                <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-heading text-xl font-semibold text-foreground">{t('about.platformTitle')}</h3>
            <p className="mt-3 text-muted-foreground">{t('about.platformDesc')}</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-heading text-xl font-semibold text-foreground">{t('about.automateTitle')}</h3>
            <p className="mt-3 text-muted-foreground">{t('about.automateDesc')}</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {['Act As', 'User', 'Targeted Action', 'Output', 'Mode', 'Atypical Cases', 'Topic Whitelisting', 'Examples'].map((item) => (
                <div key={item} className="rounded border border-border bg-muted/50 px-3 py-2 text-center font-mono text-[10px] text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-heading text-xl font-semibold text-foreground">{t('about.techTitle')}</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">Framework:</span> Next.js 16 + React 19</div>
              <div><span className="font-medium text-foreground">Database:</span> Supabase PostgreSQL</div>
              <div><span className="font-medium text-foreground">Styling:</span> Tailwind CSS</div>
              <div><span className="font-medium text-foreground">i18n:</span> English, Indonesia, Chinese</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
