import { NextResponse } from 'next/server'
import { query, dbAvailable } from '@/lib/db/pool'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await dbAvailable())) {
    return NextResponse.json(
      { error: 'DATABASE_UNAVAILABLE', message: 'Database is not configured yet. Set DATABASE_URL in .env.local.' },
      { status: 503 }
    )
  }
  await query('UPDATE providers SET "isActive" = false WHERE "isActive" = true')
  const { rowCount } = await query('UPDATE providers SET "isActive" = true, "updatedAt" = now() WHERE id = $1', [id])
  if (rowCount === 0) {
    return NextResponse.json({ error: 'NOT_FOUND', message: 'Provider not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}