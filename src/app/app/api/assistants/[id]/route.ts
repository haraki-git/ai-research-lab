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
    name: string
    description: string | null
    system_prompt: string | null
    automata_config: unknown
    provider_id: string | null
    version: number
    status: string
    createdAt: string
    updatedAt: string
  }>(
    `SELECT id, name, description, system_prompt, automata_config, provider_id, version, status, "createdAt", "updatedAt"
     FROM assistants WHERE id = $1`,
    [id]
  )
  if (rows.length === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Assistant not found' }, { status: 404 })
  }
  return NextResponse.json({ assistant: rows[0] })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = ['name', 'description', 'system_prompt', 'automata_config', 'provider_id', 'version', 'status']
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) {
      data[key] = key === 'automata_config' ? JSON.stringify(body[key]) : body[key]
    }
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
    `UPDATE assistants SET ${sets}, "updatedAt" = now() WHERE id = $${entries.length + 1}`,
    [...entries.map(([, v]) => v), id]
  )
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Assistant not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await dbAvailable())) {
    return NextResponse.json({ error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' }, { status: 503 })
  }
  const { rowCount } = await query('DELETE FROM assistants WHERE id = $1', [id])
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Assistant not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
