import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' },
      { status: 503 }
    )
  }
  const search = new URL(request.url).searchParams.get('search') || ''
  let sql = `SELECT id, title, type, category, access_level, content, rating, downloads, "createdAt", "updatedAt"
     FROM library_items`
  const params: string[] = []
  if (search) {
    sql += ` WHERE title ILIKE $1 OR category ILIKE $1 OR type ILIKE $1`
    params.push(`%${search}%`)
  }
  sql += ` ORDER BY "createdAt" DESC`
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
  }>(sql, params)
  return NextResponse.json({ items: rows })
}

export async function POST(request: Request) {
  let body: { title?: string; type?: string; category?: string; access_level?: string; content?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY', message: 'Invalid JSON body' }, { status: 400 })
  }

  const title = body.title?.trim()
  const type = body.type?.trim()
  const category = body.category?.trim()
  if (!title || !type || !category) {
    return NextResponse.json({ error: 'VALIDATION', message: 'title, type, and category are required' }, { status: 400 })
  }

  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet.' },
      { status: 503 }
    )
  }

  const { rows } = await query<{ id: string }>(
    `INSERT INTO library_items (title, type, category, access_level, content)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [title, type, category, body.access_level?.trim() || 'public', body.content?.trim() || null]
  )

  await query(
    `INSERT INTO activity_logs (type, title, description) VALUES ('library', 'New library item added', $1)`,
    [title]
  )

  return NextResponse.json({ item: { id: rows[0].id } }, { status: 201 })
}
