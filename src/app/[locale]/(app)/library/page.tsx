'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Star, Lock, Globe, BookOpen, Download, Sparkles, Plus, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface LibraryItem {
  id: string
  title: string
  type: string
  category: string
  access_level: 'public' | 'research' | 'premium'
  rating: number
  downloads: number
  content: string | null
}

export default function LibraryPage() {
  const t = useTranslations('library')
  const [filter, setFilter] = useState<'all' | 'public' | 'research' | 'premium'>('all')
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState<{ title: string; type: string; category: string; access_level: 'public' | 'research' | 'premium'; content: string }>({ title: '', type: 'Prompt', category: 'Research', access_level: 'public', content: '' })
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)

  const flash = (tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text })
    window.setTimeout(() => setNotice(null), 4000)
  }

  const loadItems = useCallback(async () => {
    try {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''
      const res = await fetch(`/api/library${params}`)
      const data = await res.json()
      setItems(data.items || [])
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const filteredItems = filter === 'all' ? items : items.filter((item) => item.access_level === filter)

  const accessLabels: Record<LibraryItem['access_level'], string> = {
    public: t('public'),
    research: t('research'),
    premium: t('premium'),
  }

  const downloadItem = (item: LibraryItem) => {
    const data = {
      title: item.title,
      type: item.type,
      category: item.category,
      content: item.content,
      rating: item.rating,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)

    fetch(`/api/library/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ downloads: item.downloads + 1 }),
    })
    loadItems()
  }

  const shareItem = async (item: LibraryItem) => {
    const url = `${window.location.origin}/library?highlight=${item.id}`
    try {
      await navigator.clipboard.writeText(url)
      flash('ok', 'Link copied to clipboard')
    } catch {
      flash('err', 'Failed to copy link')
    }
  }

  const addItem = async () => {
    if (!newItem.title.trim()) {
      flash('err', 'Title is required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (res.ok) {
        flash('ok', 'Item added to library')
        setShowAdd(false)
        setNewItem({ title: '', type: 'Prompt', category: 'Research', access_level: 'public', content: '' })
        loadItems()
      } else {
        flash('err', 'Failed to add item')
      }
    } catch {
      flash('err', 'Failed to add item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const allData = filteredItems.map(i => ({ title: i.title, type: i.type, category: i.category, access_level: i.access_level, content: i.content }))
            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'library-export.json'
            a.click()
            URL.revokeObjectURL(url)
          }}>
            <Download className="h-4 w-4" />
            {t('share')}
          </Button>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {notice && (
        <div className={cn(
          'flex items-center gap-2 rounded-md border px-4 py-2.5 font-mono text-xs',
          notice.tone === 'ok' ? 'border-success/40 bg-success/10 text-success' : 'border-destructive/40 bg-destructive/10 text-destructive'
        )}>
          {notice.text}
        </div>
      )}

      {showAdd && (
        <Card className="p-5">
          <h3 className="mb-4 font-heading font-semibold text-foreground">Add Library Item</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mono-label mb-1.5 block">Title</label>
              <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Item title" />
            </div>
            <div>
              <label className="mono-label mb-1.5 block">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option>Prompt</option>
                <option>Framework</option>
                <option>Tool</option>
                <option>Template</option>
              </select>
            </div>
            <div>
              <label className="mono-label mb-1.5 block">Category</label>
              <Input value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} placeholder="e.g. Security" />
            </div>
            <div>
              <label className="mono-label mb-1.5 block">Access Level</label>
              <select
                value={newItem.access_level}
                onChange={(e) => setNewItem({ ...newItem, access_level: e.target.value as 'public' | 'research' | 'premium' })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="public">Public</option>
                <option value="research">Research</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mono-label mb-1.5 block">Content</label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                placeholder="Prompt content or description..."
                className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={addItem} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add to Library
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
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
        <SegmentedControl
          options={[
            { value: 'all', label: t('all') },
            { value: 'public', label: t('public') },
            { value: 'research', label: t('research') },
            { value: 'premium', label: t('premium') },
          ]}
          value={filter}
          onChange={(v) => setFilter(v as typeof filter)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading library...
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No items found. Add your first library item above.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-5 transition-shadow hover:shadow-lg">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.type}</span>
                </div>
                {item.access_level === 'public' ? (
                  <Globe className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Lock className={item.access_level === 'premium' ? 'h-4 w-4 text-purple-500' : 'h-4 w-4 text-amber-500'} />
                )}
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant={item.access_level === 'public' ? 'success' : item.access_level === 'research' ? 'warning' : 'default'}>
                  {accessLabels[item.access_level]}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    {item.rating}
                  </span>
                  <span>·</span>
                  <span>{item.downloads} downloads</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="p-1.5" onClick={() => downloadItem(item)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1.5" onClick={() => shareItem(item)}>
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="font-heading text-xl font-bold">{t('upgrade.title')}</h3>
            <p className="mt-1 text-primary-foreground/80">{t('upgrade.description')}</p>
          </div>
          <Button variant="secondary">{t('upgrade.button')}</Button>
        </div>
      </Card>
    </div>
  )
}
