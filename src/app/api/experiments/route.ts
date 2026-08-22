import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' },
      { status: 503 }
    )
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
     FROM experiments ORDER BY "createdAt" DESC`
  )
  return NextResponse.json({ experiments: rows })
}

export async function POST(request: Request) {
  let body: { title?: string; category?: string; model?: string; provider_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const title = body.title?.trim()
  const category = body.category?.trim()
  if (!title || !category) {
    return NextResponse.json({ error: 'VALIDATION', message: 'title and category are required' }, { status: 400 })
  }

  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' },
      { status: 503 }
    )
  }

  const { rows } = await query<{ id: string }>(
    `INSERT INTO experiments (title, category, model, provider_id)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [title, category, body.model?.trim() || null, body.provider_id || null]
  )

  await query(
    `INSERT INTO activity_logs (type, title, description) VALUES ('experiment', 'New experiment created', $1)`,
    [title]
  )

  return NextResponse.json({ experiment: { id: rows[0].id } }, { status: 201 })
}
