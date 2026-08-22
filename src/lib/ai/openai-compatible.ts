export interface ChatMessage {
  role: string
  content: string
}

export interface ChatCompletionOptions {
  endpoint: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
}

export function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/\/+$/, '')
}

export async function chatCompletion(opts: ChatCompletionOptions): Promise<string> {
  const url = `${normalizeEndpoint(opts.endpoint)}/chat/completions`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
    }),
    signal: AbortSignal.timeout(60_000),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Provider error ${res.status}: ${detail.slice(0, 300)}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (typeof text !== 'string') {
    throw new Error('Unexpected provider response shape')
  }
  return text
}

export function maskKey(key: string): string {
  if (!key) return ''
  if (key.length <= 8) return '***'
  return `${key.slice(0, 3)}…${key.slice(-4)}`
}