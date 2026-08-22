import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Bot, FlaskConical, ShieldCheck, ArrowRight } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LocaleSwitcherCompact } from '@/components/LocaleSwitcherCompact'

interface Feature {
  title: string
  description: string
  meta: string
  icon: typeof Bot
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing' })
  const features: Feature[] = [
    { title: t('features.builder.title'), description: t('features.builder.description'), meta: t('features.builder.meta'), icon: Bot },
    { title: t('features.research.title'), description: t('features.research.description'), meta: t('features.research.meta'), icon: FlaskConical },
    { title: t('features.security.title'), description: t('features.security.description'), meta: t('features.security.meta'), icon: ShieldCheck },
  ]

  const runs = t.raw('proof.runs') as { title: string; value: string; status: string }[]
  const steps = t.raw('pipeline.steps') as { name: string; desc: string }[]
  const tn = await getTranslations({ locale, namespace: 'nav' })

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Navbar dengan lebar seperti footer */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          {/* Kiri: Brand */}
          <Brand />
          
          {/* Tengah: Menu Navigasi (tersembunyi di mobile) */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tn('dashboard')}
            </Link>
            <Link
              href="/assistant/builder"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tn('assistantBuilder')}
            </Link>
            <Link
              href="/research/experiments"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tn('researchLab')}
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {tn('library')}
            </Link>
          </nav>
          
          {/* Kanan: Status Pill + Locale + Theme */}
          <div className="flex items-center gap-4">
            {/* Status Pill (opsional - seperti dashboard) */}
            <div className="hidden items-center gap-2 lg:flex">
              <span className="mr-1 flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
                <span className="status-dot h-1.5 w-1.5 bg-success" />
                <span className="mono-label">Lab online</span>
              </span>
            </div>
            
            {/* Locale Switcher Compact */}
            <LocaleSwitcherCompact />
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="grid-paper border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mono-label mb-5 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 bg-primary" />
                {t('eyebrow')}
              </p>
              <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
                {t('title')}{' '}
                <span className="text-primary">{t('titleAccent')}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {t('subtitle')}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/assistant/builder">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('ctaBuild')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/research/experiments">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {t('ctaExperiment')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Console */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-lg border border-border/60 bg-background/40" aria-hidden />
              <Card className="relative overflow-hidden border-border/80 shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-1.5" aria-hidden>
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    </span>
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                      {t('console.title')}
                    </span>
                  </div>
                  <span className="mono-label normal-case tracking-[0.12em] text-primary">
                    {t('console.status')}
                  </span>
                </div>

                <div className="grid-paper-fine px-5 py-5">
                  <p className="mono-label mb-3">{t('console.promptLabel')}</p>
                  <div className="rounded-md border border-border bg-card p-4 shadow-inner">
                    <p className="whitespace-pre-line font-mono text-[12.5px] leading-relaxed text-foreground/90">
                      {t('console.prompt')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                  <span className="font-mono text-[11px] text-muted-foreground">{t('console.field')}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    READY
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Proof strip */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-10">
            <p className="mono-label mb-5">{t('proof.label')}</p>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
              {runs.map((run) => (
                <div key={run.title} className="flex items-center justify-between gap-4 bg-card px-5 py-4">
                  <span className="truncate text-sm font-medium text-foreground">{run.title}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                      {run.value}
                    </span>
                    <span className="flex items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-success">
                      <span className="h-1 w-1 rounded-full bg-success" />
                      {run.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="mb-12 max-w-2xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                {t('pipeline.title')}
              </h2>
              <p className="mt-3 text-muted-foreground">{t('pipeline.subtitle')}</p>
            </div>
            <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-5">
              {steps.map((step, index) => (
                <li key={step.name} className="group bg-card p-5">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                    {step.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-20 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="flex flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, '0')} / INSTRUMENT
                  </span>
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <p className="mono-label mt-5 border-t border-border pt-3">{feature.meta}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 md:flex-row md:items-center">
          <Brand tagline={false} />
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="mono-label normal-case tracking-[0.12em]">
              AUTOMAT(E) · ASEAN AI Internship · 2026
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Designed &amp; developed by <a href="https://harakitech.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">harakitech.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}