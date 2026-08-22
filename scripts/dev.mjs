import { execSync, spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const isWin = process.platform === 'win32'
const PORT = process.env.PORT || '3000'

function killPort(port) {
  let output = ''
  try {
    output = execSync(isWin ? 'netstat -ano' : `lsof -ti tcp:${port} || true`, {
      encoding: 'utf8',
    })
  } catch {
    return
  }

  const pids = new Set()
  const re = new RegExp(`:${port}\\s`)
  for (const line of output.split(/\r?\n/)) {
    if (!isWin) {
      const pid = line.trim()
      if (/^\d+$/.test(pid)) pids.add(pid)
      continue
    }
    if (!line.includes('LISTENING') || !re.test(line)) continue
    const parts = line.trim().split(/\s+/)
    const pid = parts[parts.length - 1]
    if (/^\d+$/.test(pid)) pids.add(pid)
  }

  for (const pid of pids) {
    try {
      execSync(isWin ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`, {
        stdio: 'ignore',
      })
      console.log(`[dev] Killed existing process ${pid} on port ${port}`)
    } catch {
      console.log(`[dev] Failed to kill process ${pid} on port ${port}`)
    }
  }
}

killPort(PORT)

console.log(`[dev] Starting Next.js on port ${PORT}...`)
const nextBin = fileURLToPath(
  new URL('../node_modules/next/dist/bin/next', import.meta.url)
)
const child = spawn(process.execPath, [nextBin, 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT },
})

child.on('exit', (code) => process.exit(code ?? 0))