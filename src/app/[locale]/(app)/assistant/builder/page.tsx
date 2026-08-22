'use client'

import { useState } from 'react'
import { User, Target, FileText, Type, List, BookOpen, Plus, Wand2, Save, TestTube2, Loader2, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface AUTOMATForm {
  actAs: string
  userAudience: string
  targetedAction: string
  outputDefinition: string
  modeTone: string
  atypicalCases: string
  topicWhitelisting: string
  examples: string
}

type FieldKey = keyof AUTOMATForm
type GroupId = 'identity' | 'action' | 'style' | 'safety'

export default function AUTOMATBuilderPage() {
  const t = useTranslations('assistant')
  const [form, setForm] = useState<AUTOMATForm>({
    actAs: '',
    userAudience: '',
    targetedAction: '',
    outputDefinition: '',
    modeTone: '',
    atypicalCases: '',
    topicWhitelisting: '',
    examples: '',
  })

  const [activeTab, setActiveTab] = useState<GroupId>('identity')
  const [showPreview, setShowPreview] = useState(true)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateNote, setGenerateNote] = useState<string | null>(null)
  const [assistantName, setAssistantName] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testResponse, setTestResponse] = useState('')
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)

  const flash = (tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 4000)
  }

  const handleChange = (field: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const buildTemplate = () => {
    return `# AI Assistant System Prompt

## Role & Expertise
You are ${form.actAs || 'an AI assistant'} designed to help ${form.userAudience || 'users'} with ${form.targetedAction || 'various tasks'}.

## Targeted Action
Your primary task is to ${form.targetedAction || 'assist users'} in a way that meets the following specifications:

## Output Definition
${form.outputDefinition || 'Provide clear, concise, and accurate responses.'}

## Mode & Tone
${form.modeTone || 'Maintain a professional and helpful tone.'}

## Atypical Cases
For ${form.atypicalCases || 'edge cases, missing information, or ambiguous requests'}:
${form.atypicalCases ? '- ' + form.atypicalCases.split('\n').join('\n- ') : '- Never invent facts.\n- Request clarification when information is missing.\n- Handle ambiguous requests with caution.'}

## Topic Whitelisting
You are allowed to discuss: ${form.topicWhitelisting || 'various topics within your domain'}.
You must refuse to discuss: ${form.topicWhitelisting ? 'out-of-scope topics' : 'sensitive or restricted topics'}.

## Examples
${form.examples || 'No examples provided.'}
`
  }

  const generatePrompt = async () => {
    const prompt = buildTemplate()
    setGeneratedPrompt(prompt)
    setGenerateNote(null)
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.text) {
        setGeneratedPrompt(data.text)
      } else if (data?.error === 'NO_PROVIDER' || data?.error === 'DATABASE_UNAVAILABLE') {
        setGenerateNote(t('generatingFallback'))
      } else {
        setGenerateNote(t('generationError'))
      }
    } catch {
      setGenerateNote(t('generationError'))
    } finally {
      setGenerating(false)
    }
  }

  const saveAssistant = async () => {
    if (!assistantName.trim()) {
      flash('err', 'Please enter an assistant name')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: assistantName.trim(),
          description: `${form.actAs} - ${form.targetedAction}`,
          system_prompt: generatedPrompt || buildTemplate(),
          automata_config: form,
        }),
      })
      if (res.ok) {
        flash('ok', 'Assistant saved successfully')
      } else {
        const data = await res.json().catch(() => null)
        flash('err', data?.message || 'Failed to save')
      }
    } catch {
      flash('err', 'Failed to save assistant')
    } finally {
      setSaving(false)
    }
  }

  const testAssistant = async () => {
    if (!testMessage.trim()) {
      flash('err', 'Please enter a test message')
      return
    }
    setTesting(true)
    setTestResponse('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testMessage,
          system: generatedPrompt || buildTemplate(),
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.text) {
        setTestResponse(data.text)
      } else {
        setTestResponse(data?.message || 'No response from provider')
      }
    } catch {
      setTestResponse('Error: Failed to get response')
    } finally {
      setTesting(false)
    }
  }

  const fieldGroups: { id: GroupId; label: string; fields: { key: FieldKey; icon: typeof User }[] }[] = [
    {
      id: 'identity',
      label: t('groups.identity'),
      fields: [
        { key: 'actAs', icon: User },
        { key: 'userAudience', icon: User },
      ],
    },
    {
      id: 'action',
      label: t('groups.action'),
      fields: [
        { key: 'targetedAction', icon: Target },
        { key: 'outputDefinition', icon: FileText },
      ],
    },
    {
      id: 'style',
      label: t('groups.style'),
      fields: [
        { key: 'modeTone', icon: Type },
        { key: 'examples', icon: BookOpen },
      ],
    },
    {
      id: 'safety',
      label: t('groups.safety'),
      fields: [
        { key: 'atypicalCases', icon: Plus },
        { key: 'topicWhitelisting', icon: List },
      ],
    },
  ]

  const activeFields = fieldGroups.find((g) => g.id === activeTab)?.fields ?? []

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col lg:w-[45%] lg:flex-none">
        <div className="shrink-0 border-b border-border px-6 py-4">
          <p className="mono-label mb-1.5">AUTOMAT(E) / BUILDER</p>
          <h1 className="font-heading text-xl font-bold tracking-tight text-foreground lg:text-2xl">
            {t('title')}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="flex shrink-0 gap-1 border-b border-border px-4">
          {fieldGroups.map((group) => {
            const isActive = group.id === activeTab
            return (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                className={cn(
                  'relative px-3 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {group.label}
                {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-primary" />}
              </button>
            )
          })}
        </div>

        <div className="mono-scroll min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
          {activeFields.map((field) => (
            <Card key={field.key} className="p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background">
                  <field.icon className="h-4 w-4 text-primary" />
                </span>
                <h3 className="font-semibold text-foreground">{t(`fields.${field.key}.label`)}</h3>
              </div>
              <Textarea
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={t(`fields.${field.key}.placeholder`)}
                className="min-h-[84px]"
              />
            </Card>
          ))}
        </div>

        <div className="shrink-0 border-t border-border p-4">
          <Button onClick={generatePrompt} disabled={generating} className="w-full gap-2" size="lg">
            {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            {generating ? t('generating') : t('generate')}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-muted/50 lg:w-[55%] lg:flex-none lg:border-l lg:border-t-0">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
            {t('preview')}
          </h2>
          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-input accent-[hsl(var(--primary))]"
            />
            {t('showPreview')}
          </label>
        </div>

        <Card className="m-4 flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-medium text-foreground">{t('generatedPrompt')}</h3>
            <span className="mono-label">V1</span>
          </div>

          <div className="mono-scroll min-h-0 flex-1 overflow-auto p-4">
            {generateNote && (
              <p className="mb-3 flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 font-mono text-[11px] text-warning">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {generateNote}
              </p>
            )}
            {generating && (
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t('generating')}
              </p>
            )}
            {showPreview && generatedPrompt ? (
              <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-[12px] leading-relaxed text-foreground">
                {generatedPrompt}
              </pre>
            ) : (
              <div className="flex h-full min-h-40 flex-col items-center justify-center text-muted-foreground">
                <User className="mb-3 h-10 w-10 opacity-40" />
                <p className="max-w-xs text-center text-sm">{t('subtitle')}</p>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border p-4 space-y-3">
            {notice && (
              <div className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-[11px]',
                notice.tone === 'ok' ? 'border-success/40 bg-success/10 text-success' : 'border-destructive/40 bg-destructive/10 text-destructive'
              )}>
                {notice.text}
              </div>
            )}

            <div>
              <label className="mono-label mb-1.5 block">Assistant Name</label>
              <Input
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="e.g. Customer Support Bot"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={saveAssistant} disabled={saving} className="flex-1 gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t('saveAssistant')}
              </Button>
              <Button variant="outline" onClick={testAssistant} disabled={testing} className="flex-1 gap-2">
                {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube2 className="h-4 w-4" />}
                {t('testAssistant')}
              </Button>
            </div>

            <div>
              <label className="mono-label mb-1.5 block">Test Message</label>
              <div className="flex gap-2">
                <Input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter a message to test the assistant..."
                  onKeyDown={(e) => e.key === 'Enter' && testAssistant()}
                />
              </div>
            </div>

            {testResponse && (
              <div className="rounded-lg border border-border bg-muted p-3">
                <p className="mono-label mb-2">Response:</p>
                <p className="whitespace-pre-wrap font-mono text-[12px] text-foreground">{testResponse}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
