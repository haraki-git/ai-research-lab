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
    type: string
    title: string
    description: string | null
    metadata: unknown
    createdAt: string
  }>(
    `SELECT id, type, title, description, metadata, "createdAt"
     FROM activity_logs ORDER BY "createdAt" DESC LIMIT 50`
  )
  return NextResponse.json({ activities: rows })
}
