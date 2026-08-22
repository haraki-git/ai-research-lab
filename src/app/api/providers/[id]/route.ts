import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: { name?: string; model?: string; apiKey?: string; endpoint?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const data: { name?: string; model?: string; apiKey?: string; endpoint?: string } = {}
  if (body.name?.trim()) data.name = body.name.trim()
  if (body.model?.trim()) data.model = body.model.trim()
  if (body.endpoint?.trim()) data.endpoint = body.endpoint.trim()
  if (body.apiKey?.trim()) data.apiKey = body.apiKey.trim()

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'VALIDATION', message: 'No fields to update' }, { status: 400 })
  }

  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
      { status: 503 }
    )
  }

  const entries = Object.entries(data)
  const sets = entries.map(([key], i) => `"${key}" = $${i + 1}`).join(', ')
  const { rowCount } = await query(
    `UPDATE providers SET ${sets}, "updatedAt" = now() WHERE id = $${entries.length + 1}`,
    [...entries.map(([, v]) => v), id]
  )
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Provider not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
      { status: 503 }
    )
  }
  const { rowCount } = await query('DELETE FROM providers WHERE id = $1', [id])
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Provider not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
