'use client'

import { useState } from 'react'
import { ShieldAlert, FileSearch, Unlock, Eye, Play, Loader2, XCircle, CircleCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type TestStatus = 'pending' | 'pass' | 'fail'
type Severity = 'critical' | 'high' | 'medium'

interface SecurityTest {
  id: string
  name: string
  sev: Severity
}

interface SecuritySuite {
  id: string
  name: string
  desc: string
  icon: typeof ShieldAlert
  tests: SecurityTest[]
}

const SUITES: SecuritySuite[] = [
  {
    id: 'direct',
    name: 'Direct injection',
    desc: 'Attacker-controlled instructions embedded in the user prompt.',
    icon: ShieldAlert,
    tests: [
      { id: 'overwrite', name: 'System override attempt', sev: 'high' },
      { id: 'jailbreak', name: 'Jailbreak phrasing', sev: 'critical' },
      { id: 'role_swap', name: 'Role / persona hijack', sev: 'medium' },
    ],
  },
  {
    id: 'indirect',
    name: 'Indirect injection',
    desc: 'Malicious content carried by retrieved documents or web content.',
    icon: FileSearch,
    tests: [
      { id: 'doc_payload', name: 'Document-carried payload', sev: 'high' },
      { id: 'web_retrieval', name: 'Web retrieval poisoning', sev: 'high' },
    ],
  },
  {
    id: 'scope',
    name: 'Scope violation',
    desc: 'Requests that push the assistant outside its allowed domain.',
    icon: Unlock,
    tests: [
      { id: 'off_topic', name: 'Off-topic escalation', sev: 'medium' },
      { id: 'function_abuse', name: 'Tool / function abuse', sev: 'high' },
    ],
  },
  {
    id: 'data',
    name: 'Data exposure',
    desc: 'Attempts to exfiltrate secrets, keys, or personal data.',
    icon: Eye,
    tests: [
      { id: 'secret_leak', name: 'Secret / key disclosure', sev: 'critical' },
      { id: 'pii_harvest', name: 'PII harvesting', sev: 'critical' },
    ],
  },
]

export default function SecurityPage() {
  const t = useTranslations('security')
  const [results, setResults] = useState<Record<string, TestStatus>>(() =>
    Object.fromEntries(SUITES.flatMap((s) => s.tests.map((test) => [test.id, 'pending' as TestStatus])))
  )
  const [running, setRunning] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)

  const flash = (tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 6000)
  }

  const runTests = async () => {
    setRunning(true)
    try {
      const res = await fetch('/api/security/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (res.ok && data.results) {
        const newResults: Record<string, TestStatus> = {}
        for (const r of data.results) {
          newResults[r.test_id] = r.status
        }
        setResults(newResults)
        const passCount = data.results.filter((r: { status: string }) => r.status === 'pass').length
        const failCount = data.results.filter((r: { status: string }) => r.status === 'fail').length
        flash('ok', `Tests completed: ${passCount} passed, ${failCount} failed`)
      } else {
        flash('err', data?.message || 'Failed to run tests')
      }
    } catch {
      flash('err', 'Failed to run security tests. Check if an active provider is configured.')
    } finally {
      setRunning(false)
    }
  }

  const counts = { pass: 0, fail: 0, pending: 0 }
  for (const status of Object.values(results)) counts[status as TestStatus]++

  const findings = SUITES.flatMap((suite) =>
    suite.tests
      .filter((test) => results[test.id] === 'fail')
      .map((test) => ({ ...test, suite: suite.name }))
  )

  const sevTone = (sev: Severity) =>
    sev === 'critical' ? 'text-destructive border-destructive/40 bg-destructive/10' : sev === 'high' ? 'text-warning border-warning/40 bg-warning/10' : 'text-muted-foreground border-border bg-muted'

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="mono-label hidden shrink-0 sm:block">{t('crumbs')}</p>
          <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {t('title')}
          </h1>
          <p className="hidden truncate text-sm text-muted-foreground xl:block">{t('subtitle')}</p>
        </div>
        <Button onClick={runTests} disabled={running} className="shrink-0 gap-2">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {running ? t('running') : t('runTests')}
        </Button>
      </div>

      {notice && (
        <div className={cn(
          'flex items-center gap-2 rounded-md border px-4 py-2.5 font-mono text-xs',
          notice.tone === 'ok' ? 'border-success/40 bg-success/10 text-success' : 'border-destructive/40 bg-destructive/10 text-destructive'
        )}>
          {notice.text}
        </div>
      )}

      {running && (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-4 py-3 font-mono text-xs text-primary">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Running security tests against active AI provider... This may take a moment.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
        {[
          { label: t('summary.passed'), value: counts.pass, cls: 'text-success' },
          { label: t('summary.failed'), value: counts.fail, cls: 'text-destructive' },
          { label: t('summary.pending'), value: counts.pending, cls: 'text-muted-foreground' },
          { label: t('summary.suites'), value: SUITES.length, cls: 'text-primary' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between bg-card px-5 py-4">
            <span className="mono-label">{item.label}</span>
            <span className={cn('font-mono text-3xl font-semibold tabular-nums tracking-tight', item.cls)}>
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {SUITES.map((suite) => (
            <Card key={suite.id} className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
                    <suite.icon className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">{suite.name}</h2>
                    <p className="text-sm text-muted-foreground">{suite.desc}</p>
                  </div>
                </div>
                <span className="mono-label shrink-0">
                  {suite.tests.length.toString().padStart(2, '0')} TESTS
                </span>
              </div>
              <div className="divide-y divide-border rounded-md border border-border">
                {suite.tests.map((test) => {
                  const status = results[test.id]
                  return (
                    <div key={test.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        {status === 'pass' ? (
                          <CircleCheck className="h-4 w-4 shrink-0 text-success" />
                        ) : status === 'fail' ? (
                          <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
                        )}
                        <span className="truncate text-sm text-foreground">{test.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className={cn('rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]', sevTone(test.sev))}>
                          {t(`sev.${test.sev}`)}
                        </span>
                        <span
                          className={cn(
                            'w-16 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.12em]',
                            status === 'pass' && 'text-success',
                            status === 'fail' && 'text-destructive',
                            status === 'pending' && 'text-muted-foreground/60'
                          )}
                        >
                          {status === 'pass' ? t('suite.blocked') : status === 'fail' ? t('suite.exposed') : '…'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {t('findingsTitle')}
            </h2>
            <span className="mono-label">
              {findings.length.toString().padStart(2, '0')}
            </span>
          </div>
          {findings.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {running ? 'Tests running...' : t('findingsEmpty')}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {findings.map((finding) => (
                <div key={finding.id} className="flex items-start gap-3 px-5 py-3">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{finding.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {finding.suite.toUpperCase()} · {t('severity')} {t(`sev.${finding.sev}`).toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
