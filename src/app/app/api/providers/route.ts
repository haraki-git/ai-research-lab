import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'
import { maskKey } from '@/lib/ai/openai-compatible'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
      { status: 503 }
    )
  }
  const exportFull = new URL(request.url).searchParams.get('export') === '1'
  const { rows } = await query<{
    id: string
    name: string
    model: string
    apiKey: string
    endpoint: string
    isActive: boolean
  }>('SELECT id, name, model, "apiKey", endpoint, "isActive" FROM providers ORDER BY "createdAt" ASC')
  return NextResponse.json({
    providers: rows.map((p) =>
      exportFull
        ? { id: p.id, name: p.name, model: p.model, endpoint: p.endpoint, apiKey: p.apiKey, isActive: p.isActive }
        : {
            id: p.id,
            name: p.name,
            model: p.model,
            endpoint: p.endpoint,
            apiKeySet: !!p.apiKey,
            maskedKey: maskKey(p.apiKey),
            isActive: p.isActive,
          }
    ),
  })
}

export async function POST(request: Request) {
  let body: { name?: string; model?: string; apiKey?: string; endpoint?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const name = body.name?.trim()
  const model = body.model?.trim()
  const apiKey = body.apiKey?.trim()
  const endpoint = body.endpoint?.trim()

  if (!name || !model || !apiKey || !endpoint) {
    return NextResponse.json(
      { error: 'VALIDATION', message: 'name, model, apiKey and endpoint are required' },
      { status: 400 }
    )
  }

  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
      { status: 503 }
    )
  }

  const { rows } = await query<{ n: string }>('SELECT COUNT(*)::text AS n FROM providers')
  const isActive = Number(rows[0].n) === 0
  const { rows: created } = await query<{ id: string }>(
    'INSERT INTO providers (name, model, "apiKey", endpoint, "isActive") VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [name, model, apiKey, endpoint, isActive]
  )
  return NextResponse.json({ provider: { id: created[0].id } }, { status: 201 })
}
