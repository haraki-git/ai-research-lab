import { readFileSync, existsSync } from 'node:fs'
import { Pool } from 'pg'

let url = process.env.DATABASE_URL || ''
if (!url && existsSync('.env.local')) {
  const m = readFileSync('.env.local', 'utf8').match(/^DATABASE_URL=(.+)$/m)
  if (m) url = m[1].trim()
}

if (!url) {
  console.error('DATABASE_URL not found')
  process.exit(1)
}

const pool = new Pool({
  connectionString: url,
  connectionTimeoutMillis: 8000,
  ...( /[?&]sslmode=/.test(url) ? {} : { ssl: { rejectUnauthorized: false } } ),
})

const sql = `
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  model text NOT NULL,
  "apiKey" text NOT NULL,
  endpoint text NOT NULL,
  "isActive" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  system_prompt text,
  automata_config jsonb,
  provider_id uuid REFERENCES providers(id) ON DELETE SET NULL,
  version int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  model text,
  provider_id uuid REFERENCES providers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Pending',
  runs int NOT NULL DEFAULT 0,
  result text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiment_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES experiments(id) ON DELETE CASCADE,
  prompt text,
  response text,
  evaluation text,
  notes text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS security_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id uuid REFERENCES assistants(id) ON DELETE CASCADE,
  suite_id text NOT NULL,
  test_name text NOT NULL,
  severity text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  response text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  category text NOT NULL,
  access_level text NOT NULL DEFAULT 'public',
  content text,
  rating numeric(2,1) DEFAULT 0,
  downloads int NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
`

const tables = ['providers', 'assistants', 'experiments', 'experiment_runs', 'security_tests', 'library_items', 'activity_logs']

try {
  await pool.query(sql)
  console.log('OK: all tables ready —', tables.join(', '))
} catch (err) {
  console.error('FAILED:', err.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
