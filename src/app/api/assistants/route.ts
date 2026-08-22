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
     FROM assistants ORDER BY "createdAt" DESC`
  )
  return NextResponse.json({ assistants: rows })
}

export async function POST(request: Request) {
  let body: { name?: string; description?: string; system_prompt?: string; automata_config?: unknown; provider_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: 'VALIDATION', message: 'name is required' }, { status: 400 })
  }

  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' },
      { status: 503 }
    )
  }

  const { rows } = await query<{ id: string }>(
    `INSERT INTO assistants (name, description, system_prompt, automata_config, provider_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [
      name,
      body.description?.trim() || null,
      body.system_prompt?.trim() || null,
      body.automata_config ? JSON.stringify(body.automata_config) : null,
      body.provider_id || null,
    ]
  )

  await query(
    `INSERT INTO activity_logs (type, title, description) VALUES ('assistant', 'New assistant created', $1)`,
    [name]
  )

  return NextResponse.json({ assistant: { id: rows[0].id } }, { status: 201 })
}
