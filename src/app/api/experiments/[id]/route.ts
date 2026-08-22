import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await dbAvailable())) {
    return NextResponse.json({ error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' }, { status: 503 })
  }
  const { rows } = await query<{
    id: string
    title: string
    category: string
    model: string | null
    provider_id: string | null
    status: string
    runs: number
    result: string | null
    createdAt: string
    updatedAt: string
  }>(
    `SELECT id, title, category, model, provider_id, status, runs, result, "createdAt", "updatedAt"
     FROM experiments WHERE id = $1`,
    [id]
  )
  if (rows.length === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Experiment not found' }, { status: 404 })
  }

  const { rows: runs } = await query<{
    id: string
    prompt: string | null
    response: string | null
    evaluation: string | null
    notes: string | null
    createdAt: string
  }>(
    `SELECT id, prompt, response, evaluation, notes, "createdAt"
     FROM experiment_runs WHERE experiment_id = $1 ORDER BY "createdAt" DESC`,
    [id]
  )

  return NextResponse.json({ experiment: rows[0], runs })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = ['title', 'category', 'model', 'provider_id', 'status', 'runs', 'result']
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key]
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'VALIDATION', message: 'No fields to update' }, { status: 400 })
  }

  if (!(await dbAvailable())) {
    return NextResponse.json({ error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' }, { status: 503 })
  }

  const entries = Object.entries(data)
  const sets = entries.map(([key], i) => `"${key}" = $${i + 1}`).join(', ')
  const { rowCount } = await query(
    `UPDATE experiments SET ${sets}, "updatedAt" = now() WHERE id = $${entries.length + 1}`,
    [...entries.map(([, v]) => v), id]
  )
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Experiment not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await dbAvailable())) {
    return NextResponse.json({ error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' }, { status: 503 })
  }
  const { rowCount } = await query('DELETE FROM experiments WHERE id = $1', [id])
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Experiment not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
