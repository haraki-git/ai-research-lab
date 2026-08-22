import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'
import { chatCompletion } from '@/lib/ai/openai-compatible'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: { providerId?: string; name?: string; model?: string; apiKey?: string; endpoint?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  let name: string | undefined
  let model: string | undefined
  let apiKey: string | undefined
  let endpoint: string | undefined

  if (body.providerId) {
    if (!(await dbAvailable())) {
      return NextResponse.json(
        { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
        { status: 503 }
      )
    }
    const { rows } = await query<{ name: string; model: string; apiKey: string; endpoint: string }>(
      'SELECT name, model, "apiKey", endpoint FROM providers WHERE id = $1',
      [body.providerId]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'NOT_FOUND', message: 'Provider not found' }, { status: 404 })
    }
    name = rows[0].name
    model = rows[0].model
    apiKey = rows[0].apiKey
    endpoint = rows[0].endpoint
  } else {
    name = body.name
    model = body.model
    apiKey = body.apiKey
    endpoint = body.endpoint
  }

  if (!model || !apiKey || !endpoint) {
    return NextResponse.json(
      { error: 'VALIDATION', message: 'model, apiKey and endpoint are required' },
      { status: 400 }
    )
  }

  try {
    const text = await chatCompletion({
      endpoint,
      apiKey,
      model,
      messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      maxTokens: 16,
      temperature: 0,
    })
    return NextResponse.json({ ok: true, name, model, reply: text.slice(0, 80) })
  } catch (error) {
    return NextResponse.json(
      { error: 'CONNECTION_FAILED', message: error instanceof Error ? error.message : 'Connection failed' },
      { status: 400 }
    )
  }
}