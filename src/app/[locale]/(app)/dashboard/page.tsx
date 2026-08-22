'use client'

import { useState, useCallback } from 'react'
import { Brain, Cpu, Shield, Activity, ArrowRight, Play, BookOpen, Terminal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { OnboardingModal } from '@/components/OnboardingModal'

interface Stat {
  label: string
  value: string
  status: string
  icon: typeof Brain
  color: 'primary' | 'muted' | 'warning' | 'destructive'
}

interface ActivityLog {
  id: string
  type: string
  title: string
  description: string | null
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const [mode, setMode] = useState<'synthetic' | 'live'>('synthetic')
  const [metrics, setMetrics] = useState({ assistants: 12, experiments: 48, securityTests: 24, findings: 18 })
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [assistantsRes, experimentsRes, activityRes] = await Promise.allSettled([
        fetch('/api/assistants'),
        fetch('/api/experiments'),
        fetch('/api/activity'),
      ])

      const assistantsData = assistantsRes.status === 'fulfilled' ? await assistantsRes.value.json().catch(() => ({ assistants: [] })) : { assistants: [] }
      const experimentsData = experimentsRes.status === 'fulfilled' ? await experimentsRes.value.json().catch(() => ({ experiments: [] })) : { experiments: [] }
      const activityData = activityRes.status === 'fulfilled' ? await activityRes.value.json().catch(() => ({ activities: [] })) : { activities: [] }

      setMetrics({
        assistants: assistantsData.assistants?.length || 0,
        experiments: experimentsData.experiments?.length || 0,
        securityTests: 24,
        findings: 18,
      })
      setActivities(activityData.activities || [])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleModeSwitch = useCallback((newMode: 'synthetic' | 'live') => {
    setMode(newMode)
    if (newMode === 'synthetic') {
      setMetrics({ assistants: 12, experiments: 48, securityTests: 24, findings: 18 })
      setActivities([])
      setLoading(false)
    } else {
      loadData()
    }
  }, [loadData])

  const stats: Stat[] = [
    { label: t('stats.totalAssistants'), value: String(metrics.assistants), status: t('stats.statusOnline'), icon: Brain, color: 'primary' },
    { label: t('stats.experiments'), value: String(metrics.experiments), status: t('stats.statusActive'), icon: Cpu, color: 'primary' },
    { label: t('stats.securityTests'), value: String(metrics.securityTests), status: t('stats.statusReviewed'), icon: Shield, color: 'destructive' },
    { label: t('stats.findings'), value: String(metrics.findings), status: t('stats.statusPassing'), icon: Activity, color: 'warning' },
  ]

  const colorClass = (color: Stat['color']) =>
    color === 'primary'
      ? 'text-primary'
      : color === 'warning'
        ? 'text-warning'
        : color === 'destructive'
          ? 'text-destructive'
          : 'text-muted-foreground'

  const activityTone = (type: string) =>
    type === 'security' ? 'ok' as const : 'fg' as const

  const defaultActivity = [
    { id: '1', type: 'assistant', title: t('activity.newAssistant'), description: t('activity.newAssistantDesc'), createdAt: '2026-01-01T00:00:00Z' },
    { id: '2', type: 'security', title: t('activity.securityPass'), description: t('activity.securityPassDesc'), createdAt: '2026-01-01T00:00:00Z' },
    { id: '3', type: 'experiment', title: t('activity.experimentDone'), description: t('activity.experimentDoneDesc'), createdAt: '2026-01-01T00:00:00Z' },
  ]

  const displayActivities = mode === 'synthetic' ? defaultActivity : (activities.length > 0 ? activities : defaultActivity)

  const actions = [
    { label: t('buildNewAssistant'), href: '/assistant/builder', icon: Brain },
    { label: t('startExperiment'), href: '/research/experiments', icon: Play },
    { label: t('exploreLibrary'), href: '/library', icon: BookOpen },
  ]

  const kpiBorder = [
    '',
    'border-l border-border',
    'border-l border-border',
    '',
  ]

  return (
    <>
    <OnboardingModal />
    <div className="flex h-full flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="mono-label hidden shrink-0 sm:block">{t('crumbs')}</p>
          <h1 className="truncate font-heading text-xl font-bold tracking-tight text-foreground lg:text-2xl">
            {t('title')}
          </h1>
          <p className="hidden truncate text-sm text-muted-foreground xl:block">{t('subtitle')}</p>
        </div>
        <div className="flex shrink-0 items-center rounded-md border border-border bg-muted p-0.5">
          <button
            onClick={() => handleModeSwitch('synthetic')}
            className={cn(
              'px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] rounded transition-colors',
              mode === 'synthetic' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('synthetic')}
          </button>
          <button
            onClick={() => handleModeSwitch('live')}
            className={cn(
              'px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] rounded transition-colors',
              mode === 'live' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('live')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'flex items-center gap-4 bg-card px-4 py-3 transition-colors first:rounded-tl-md first:border-l first:border-t first:border-border first:md:rounded-none',
              kpiBorder[index]
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              <stat.icon className={`h-4 w-4 ${colorClass(stat.color)}`} />
            </span>
            <div className="min-w-0">
              <p className="mono-label truncate">{stat.label}</p>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span
                  className={`font-mono text-2xl font-semibold tabular-nums leading-none tracking-tight ${colorClass(stat.color)}`}
                >
                  {stat.value}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-success">
                  <span className="h-1 w-1 rounded-full bg-success" />
                  {stat.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex min-h-0 flex-col lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <Brain className="h-4 w-4 text-primary" />
              </span>
              <div>
                <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
                  {t('lab.title')}
                </h2>
                <p className="text-sm text-muted-foreground">{t('lab.subtitle')}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
              <span className="status-dot h-1.5 w-1.5 bg-success" />
              <span className="normal-case tracking-[0.12em]">LIVE</span>
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-5 p-5">
            {[
              { key: 'truthfulness', value: 85 },
              { key: 'injection', value: 90 },
              { key: 'consistency', value: 92 },
            ].map((dim) => (
              <div key={dim.key} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-4">
                <span className="mono-label truncate">{t(`lab.${dim.key}`)}</span>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80"
                    style={{ width: `${dim.value}%` }}
                  />
                </div>
                <span className="text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                  {dim.value}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="mono-label">{t('lab.avg')}</span>
            <span className="font-mono text-2xl font-semibold tabular-nums leading-none text-foreground">
              89<span className="text-base text-muted-foreground">%</span>
            </span>
            <span className="mono-label hidden sm:block">
              {t('lab.runs')} <span className="text-foreground">100</span>
            </span>
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <Cpu className="h-4 w-4 text-primary" />
              </span>
              <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
                {t('quickActions')}
              </h2>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/70">LAUNCH</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-1 p-5">
            {actions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-secondary/60"
              >
                <span className="w-4 font-mono text-[10px] text-muted-foreground/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card">
                  <action.icon className="h-4 w-4 text-foreground" />
                </span>
                <span className="flex-1 truncate text-sm font-medium text-foreground">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
           </div>
         </Card>
      </div>

      <Card className="flex h-40 flex-none flex-col sm:h-44 lg:h-52">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              <Terminal className="h-4 w-4 text-primary" />
            </span>
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {t('recentActivity')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="mono-label hidden sm:inline">
              {displayActivities.length.toString().padStart(2, '0')} ENTRIES
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <span className="status-dot h-1.5 w-1.5 bg-success" />
              STREAM
            </span>
          </div>
        </div>
        <div className="mono-scroll min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">Loading...</div>
          ) : (
            displayActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-4 border-b border-border/60 py-2.5 last:border-0 last:pb-0">
                <span
                  className={
                    activityTone(item.type) === 'ok'
                      ? 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success'
                      : 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary'
                  }
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
    </>
  )
}
