'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  KeyRound,
  Server,
  Plug,
  Upload,
  Download,
  Trash2,
  Pencil,
  Loader2,
  Power,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface Provider {
  id: string
  name: string
  model: string
  endpoint: string
  apiKeySet: boolean
  maskedKey: string
  isActive: boolean
}

interface ProviderForm {
  name: string
  model: string
  apiKey: string
  endpoint: string
}

const emptyForm: ProviderForm = { name: '', model: '', apiKey: '', endpoint: '' }

export default function SettingsPage() {
  const t = useTranslations('settings')
  const [providers, setProviders] = useState<Provider[]>([])
  const [form, setForm] = useState<ProviderForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/providers')
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setNotice({ tone: 'err', text: data?.message || t('status.dbUnavailable') })
        setProviders([])
        return
      }
      const data = await res.json()
      setProviders(data.providers ?? [])
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  const activeProvider = providers.find((p) => p.isActive)

  const flash = (tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 4000)
  }

  const setField = (field: keyof ProviderForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const saveProvider = async () => {
    const name = form.name.trim()
    const model = form.model.trim()
    const endpoint = form.endpoint.trim()
    const apiKey = form.apiKey.trim()

    if (!name || !model || !endpoint || (!apiKey && !editingId)) {
      flash('err', t('status.requiredError'))
      return
    }

    setSaving(true)
    try {
      const body: Record<string, string> = { name, model, endpoint }
      if (apiKey) body.apiKey = apiKey
      const res = await fetch(editingId ? `/api/providers/${editingId}` : '/api/providers', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        flash('err', data?.message || t('status.dbUnavailable'))
        return
      }
      flash('ok', t('status.saved'))
      resetForm()
      await load()
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async (providerId?: string) => {
    setTesting(providerId ?? '__form')
    try {
      const body = providerId
        ? { providerId }
        : { name: form.name.trim(), model: form.model.trim(), apiKey: form.apiKey.trim(), endpoint: form.endpoint.trim() }
      const res = await fetch('/api/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => null)
      if (res.ok) flash('ok', `${t('status.testOk')}${data?.model ? ` — ${data.model}` : ''}`)
      else flash('err', data?.message || 'Connection failed')
    } finally {
      setTesting(null)
    }
  }

  const setActive = async (id: string) => {
    const res = await fetch(`/api/providers/${id}/activate`, { method: 'POST' })
    if (res.ok) {
      flash('ok', t('status.activated'))
      await load()
    }
  }

  const deleteProvider = async (id: string) => {
    const res = await fetch(`/api/providers/${id}`, { method: 'DELETE' })
    if (res.ok) {
      flash('ok', t('status.deleted'))
      if (editingId === id) resetForm()
      await load()
    }
  }

  const editProvider = (p: Provider) => {
    setEditingId(p.id)
    setForm({ name: p.name, model: p.model, apiKey: '', endpoint: p.endpoint })
  }

  const onImportFile = async (file: File | undefined) => {
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.providers) ? parsed.providers : null
      if (!arr || !arr.every((p: Record<string, unknown>) => p.name && p.model && p.apiKey && p.endpoint)) {
        flash('err', t('json.invalid'))
        return
      }
      for (const p of arr as { name: string; model: string; apiKey: string; endpoint: string }[]) {
        await fetch('/api/providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: p.name, model: p.model, apiKey: p.apiKey, endpoint: p.endpoint }),
        })
      }
      await load()
      if (fileRef.current) fileRef.current.value = ''
    } catch {
      flash('err', t('json.invalid'))
    } finally {
      setImporting(false)
    }
  }

  const exportJson = async () => {
    try {
      const res = await fetch('/api/providers?export=1')
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data.providers ?? [], null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'providers.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      flash('err', t('status.dbUnavailable'))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="mono-label hidden shrink-0 sm:block">{t('crumbs')}</p>
          <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {t('title')}
          </h1>
          <p className="hidden truncate text-sm text-muted-foreground xl:block">{t('subtitle')}</p>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className={cn('status-dot h-1.5 w-1.5', activeProvider ? 'bg-success' : 'bg-muted-foreground/40')} />
          {t('activeProvider')}:
          <span className="font-semibold text-foreground">
            {activeProvider ? activeProvider.name : t('none')}
          </span>
        </span>
      </div>

      {notice && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border px-4 py-2.5 font-mono text-xs',
            notice.tone === 'ok'
              ? 'border-success/40 bg-success/10 text-success'
              : 'border-destructive/40 bg-destructive/10 text-destructive'
          )}
        >
          {notice.tone === 'ok' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {notice.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground">
              <KeyRound className="h-4 w-4 text-primary" />
              {editingId ? t('editProvider') : t('addProvider')}
            </h2>
            {editingId && (
              <Button variant="ghost" size="sm" onClick={resetForm}>
                {t('form.clear')}
              </Button>
            )}
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mono-label mb-1.5 block">{t('form.name')}</label>
                <Input
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder={t('form.namePlaceholder')}
                />
              </div>
              <div>
                <label className="mono-label mb-1.5 block">{t('form.model')}</label>
                <Input
                  value={form.model}
                  onChange={(e) => setField('model', e.target.value)}
                  placeholder={t('form.modelPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="mono-label mb-1.5 block">{t('form.apiKey')}</label>
              <Input
                type="password"
                value={form.apiKey}
                onChange={(e) => setField('apiKey', e.target.value)}
                placeholder={editingId ? `${t('form.apiKeyPlaceholder')} — ${t('form.apiKeyHint')}` : t('form.apiKeyPlaceholder')}
              />
            </div>

            <div>
              <label className="mono-label mb-1.5 block">{t('form.endpoint')}</label>
              <Input
                value={form.endpoint}
                onChange={(e) => setField('endpoint', e.target.value)}
                placeholder={t('form.endpointPlaceholder')}
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{t('form.endpointHint')}</p>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button onClick={saveProvider} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Server className="h-4 w-4" />}
                {t('form.save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => testConnection(undefined)}
                disabled={testing === '__form' || !form.model || !form.endpoint}
                className="gap-2"
              >
                {testing === '__form' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plug className="h-4 w-4" />
                )}
                {t('form.test')}
              </Button>
            </div>
          </div>
        </Card>

        {/* JSON import/export */}
        <Card className="flex flex-col">
          <div className="border-b border-border px-5 py-3">
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {t('json.title')}
            </h2>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 p-5">
            <div className="space-y-4">
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => onImportFile(e.target.files?.[0])}
                />
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  disabled={importing}
                  onClick={() => fileRef.current?.click()}
                >
                  {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {t('json.import')}
                </Button>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  {t('json.importHint')}
                </p>
              </div>
              <div>
                <Button variant="outline" className="w-full gap-2" onClick={exportJson}>
                  <Download className="h-4 w-4" />
                  {t('json.export')}
                </Button>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  {t('json.exportHint')}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Providers list */}
      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
            {t('list.title')}
          </h2>
          <span className="mono-label">
            {providers.length.toString().padStart(2, '0')}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 font-mono text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> …
          </div>
        ) : providers.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">{t('list.empty')}</p>
        ) : (
          <div className="divide-y divide-border">
            {providers.map((p) => (
              <div
                key={p.id}
                className={cn(
                  'flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between',
                  p.isActive && 'bg-primary/[0.04]'
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border',
                      p.isActive ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground'
                    )}
                  >
                    <Server className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                      {p.isActive && (
                        <span className="flex items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-success">
                          <span className="h-1 w-1 rounded-full bg-success" />
                          {t('list.active')}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
                      <span className="truncate">MODEL {p.model}</span>
                      <span className="truncate text-muted-foreground/80">{p.endpoint}</span>
                      <span>KEY {p.maskedKey}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {!p.isActive && (
                    <Button variant="ghost" size="sm" onClick={() => setActive(p.id)} className="gap-1.5">
                      <Power className="h-3.5 w-3.5" />
                      {t('list.setActive')}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => testConnection(p.id)} disabled={testing === p.id} className="gap-1.5">
                    {testing === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plug className="h-3.5 w-3.5" />}
                    {t('list.test')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => editProvider(p)} className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" />
                    {t('list.edit')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteProvider(p.id)} className="gap-1.5 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('list.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}