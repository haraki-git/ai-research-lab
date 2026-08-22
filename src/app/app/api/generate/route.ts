import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'
import { chatCompletion } from '@/lib/ai/openai-compatible'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: { prompt?: string; system?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const prompt = body.prompt?.trim()
  if (!prompt) {
    return NextResponse.json({ error: 'VALIDATION', message: 'prompt is required' }, { status: 400 })
  }

  const systemMessage = body.system?.trim() || 'You are a senior prompt engineering assistant. Based on the AUTOMAT(E) structured specification provided by the user, produce a polished, production-ready system prompt. Keep it concise and well-structured.'

  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
      { status: 503 }
    )
  }

  const { rows: providers } = await query<{
    endpoint: string
    apiKey: string
    model: string
  }>('SELECT endpoint, "apiKey", model FROM providers WHERE "isActive" = true LIMIT 1')

  if (providers.length === 0) {
    return NextResponse.json(
      { error: 'NO_PROVIDER', message: 'No active provider configured. Add one in Settings.' },
      { status: 409 }
    )
  }

  const provider = providers[0]

  try {
    const text = await chatCompletion({
      endpoint: provider.endpoint,
      apiKey: provider.apiKey,
      model: provider.model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      maxTokens: 1200,
      temperature: 0.4,
    })
    return NextResponse.json({ text })
  } catch (error) {
    return NextResponse.json(
      { error: 'GENERATION_FAILED', message: error instanceof Error ? error.message : 'Generation failed' },
      { status: 400 }
    )
  }
}