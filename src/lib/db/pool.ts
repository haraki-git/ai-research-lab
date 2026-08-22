import { Pool, type QueryResult, type QueryResultRow } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (pool) return pool
  const url = process.env.DATABASE_URL || ''
  const hasSslMode = /[?&]sslmode=/.test(url)
  pool = new Pool({
    connectionString: url || undefined,
    connectionTimeoutMillis: 8000,
    query_timeout: 15000,
    ...(url ? (hasSslMode ? {} : { ssl: { rejectUnauthorized: false } }) : {}),
  })
  pool.on('error', () => {})
  return pool
}

export async function dbAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false
  try {
    await getPool().query('SELECT 1')
    return true
  } catch {
    return false
  }
}

export async function query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params)
}
