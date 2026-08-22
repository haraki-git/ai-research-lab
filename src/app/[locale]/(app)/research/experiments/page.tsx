'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Play, Download, Settings, ChevronDown, Loader2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface Experiment {
  id: string
  title: string
  category: string
  model: string | null
  provider_id: string | null
  status: string
  runs: number
  result: string | null
}

interface ExperimentRun {
  id: string
  prompt: string | null
  response: string | null
  evaluation: string | null
  notes: string | null
  createdAt: string
}

export default function ResearchExperimentsPage() {
  const t = useTranslations('research')
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [runningId, setRunningId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newExp, setNewExp] = useState({ title: '', category: 'Truthfulness', model: '' })
  const [saving, setSaving] = useState(false)
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null)
  const [runs, setRuns] = useState<ExperimentRun[]>([])
  const [loadingRuns, setLoadingRuns] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)

  const flash = (tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 4000)
  }

  const loadExperiments = useCallback(async () => {
    try {
      const res = await fetch('/api/experiments')
      const data = await res.json()
      setExperiments(data.experiments || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadExperiments()
  }, [loadExperiments])

  const filtered = experiments.filter((exp) => {
    const matchSearch = !searchQuery || exp.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = categoryFilter === 'All' || exp.category === categoryFilter
    return matchSearch && matchCategory
  })

  const categories = ['All', 'Truthfulness', 'Sycophancy', 'Bias', 'Consistency', 'Injection', 'Limitation']

  const statusVariant = (status: string) =>
    status === 'Completed' ? 'success' : status === 'In Progress' ? 'warning' : 'default'

  const createExperiment = async () => {
    if (!newExp.title.trim()) {
      flash('err', 'Title is required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      })
      if (res.ok) {
        flash('ok', 'Experiment created')
        setShowNew(false)
        setNewExp({ title: '', category: 'Truthfulness', model: '' })
        loadExperiments()
      } else {
        flash('err', 'Failed to create experiment')
      }
    } catch {
      flash('err', 'Failed to create experiment')
    } finally {
      setSaving(false)
    }
  }

  const runExperiment = async (id: string) => {
    setRunningId(id)
    try {
      const res = await fetch(`/api/experiments/${id}/run`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        flash('ok', 'Experiment run completed')
        loadExperiments()
        if (selectedExp?.id === id) viewResults(id)
      } else {
        flash('err', data?.message || 'Run failed')
      }
    } catch {
      flash('err', 'Failed to run experiment')
    } finally {
      setRunningId(null)
    }
  }

  const viewResults = async (id: string) => {
    setLoadingRuns(true)
    try {
      const res = await fetch(`/api/experiments/${id}`)
      const data = await res.json()
      setSelectedExp(data.experiment)
      setRuns(data.runs || [])
    } catch {
      flash('err', 'Failed to load results')
    } finally {
      setLoadingRuns(false)
    }
  }

  const downloadExperiment = (exp: Experiment) => {
    const data = { ...exp, runs }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exp.title.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="h-5 w-5" />
          {t('newExperiment')}
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

      {showNew && (
        <Card className="p-5">
          <h3 className="mb-4 font-heading font-semibold text-foreground">New Experiment</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mono-label mb-1.5 block">Title</label>
              <Input value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} placeholder="Experiment title" />
            </div>
            <div>
              <label className="mono-label mb-1.5 block">Category</label>
              <select
                value={newExp.category}
                onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {categories.slice(1).map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="mono-label mb-1.5 block">Model (optional)</label>
              <Input value={newExp.model} onChange={(e) => setNewExp({ ...newExp, model: e.target.value })} placeholder="e.g. GPT-4" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={createExperiment} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create
            </Button>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="md:w-56">
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading experiments...
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No experiments found. Create your first experiment above.</p>
            </Card>
          ) : (
            filtered.map((exp) => (
              <Card key={exp.id} className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{exp.title}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <Badge>{exp.category}</Badge>
                      {exp.model && <Badge variant="outline">{exp.model}</Badge>}
                      <Badge variant={statusVariant(exp.status)}>{exp.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2" onClick={() => viewResults(exp.id)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" onClick={() => downloadExperiment(exp)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {exp.runs} runs
                    </span>
                    <span className="flex items-center gap-1">
                      <ChevronDown className="h-4 w-4" />
                      {exp.result || 'N/A'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => runExperiment(exp.id)}
                    disabled={runningId === exp.id}
                    className="gap-1.5"
                  >
                    {runningId === exp.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                    {exp.status === 'Pending' ? 'Run Experiment' : 'Run Again'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          {selectedExp && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">Results: {selectedExp.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedExp(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {loadingRuns ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...
                </div>
              ) : runs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No runs yet. Click &quot;Run Experiment&quot; to start.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {runs.map((run) => (
                    <div key={run.id} className="rounded border border-border p-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Prompt:</p>
                      <p className="mb-2 whitespace-pre-wrap text-sm text-foreground">{run.prompt}</p>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Response:</p>
                      <p className="whitespace-pre-wrap text-sm text-foreground">{run.response}</p>
                      {run.evaluation && (
                        <Badge variant="success" className="mt-2">{run.evaluation}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card className="p-6">
            <h3 className="mb-4 font-heading font-semibold text-foreground">Recent Findings</h3>
            <div className="space-y-3">
              {experiments.filter(e => e.status === 'Completed').slice(0, 3).map((exp) => (
                <div key={exp.id} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm text-foreground">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">{exp.result}</p>
                  </div>
                </div>
              ))}
              {experiments.filter(e => e.status === 'Completed').length === 0 && (
                <p className="text-sm text-muted-foreground">No completed experiments yet.</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-heading font-semibold text-foreground">Popular Categories</h3>
            <div className="space-y-2">
              {categories.slice(1).map((cat) => {
                const count = experiments.filter(e => e.category === cat).length
                return (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{cat}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
