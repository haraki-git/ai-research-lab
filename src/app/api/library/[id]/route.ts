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
    type: string
    category: string
    access_level: string
    content: string | null
    rating: number
    downloads: number
    createdAt: string
    updatedAt: string
  }>(
    `SELECT id, title, type, category, access_level, content, rating, downloads, "createdAt", "updatedAt"
     FROM library_items WHERE id = $1`,
    [id]
  )
  if (rows.length === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Library item not found' }, { status: 404 })
  }
  return NextResponse.json({ item: rows[0] })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = ['title', 'type', 'category', 'access_level', 'content', 'rating', 'downloads']
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
    `UPDATE library_items SET ${sets}, "updatedAt" = now() WHERE id = $${entries.length + 1}`,
    [...entries.map(([, v]) => v), id]
  )
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Library item not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await dbAvailable())) {
    return NextResponse.json({ error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' }, { status: 503 })
  }
  const { rowCount } = await query('DELETE FROM library_items WHERE id = $1', [id])
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Library item not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
