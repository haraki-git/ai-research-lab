import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const results = []

async function step(name, fn) {
  try {
    await fn()
    results.push(`[ok] ${name}`)
  } catch (e) {
    results.push(`[ERR] ${name}: ${e.message}`)
  }
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage()

page.on('console', (msg) => {
  if (msg.type() === 'error') results.push(`[console.error] ${msg.text()}`)
  if (msg.type() === 'warning' && /hydrat|match|locale|error/i.test(msg.text()))
    results.push(`[console.warn] ${msg.text()}`)
})
page.on('pageerror', (err) => results.push(`[pageerror] ${err.message}`))
page.on('requestfailed', (req) => {
  const f = req.failure()
  if (f) results.push(`[requestfailed] ${req.url()} ${f.errorText}`)
})

// 1. Landing: switch via select
await step('open /en landing', async () => {
  await page.goto(`${BASE}/en`, { waitUntil: 'networkidle0' })
})
await step('html lang == en', async () => {
  const lang = await page.$eval('html', (el) => el.getAttribute('lang'))
  results.push(`  html lang: ${lang}`)
})
await step('landing has select switcher', async () => {
  await page.waitForSelector('select[aria-label="Select language"]', { timeout: 5000 })
})
await step('switch landing en -> id', async () => {
  await page.select('select[aria-label="Select language"]', 'id')
  await new Promise((r) => setTimeout(r, 1200))
  results.push(`  url after id: ${page.url()}`)
  const lang = await page.$eval('html', (el) => el.getAttribute('lang'))
  results.push(`  html lang after id: ${lang}`)
  await page.waitForSelector('h1', { timeout: 5000 })
})
await step('landing id has id copy', async () => {
  const h1 = await page.$eval('h1', (el) => el.textContent)
  results.push(`  h1: ${h1.trim()}`)
})
await step('switch landing id -> zh', async () => {
  await page.select('select[aria-label="Select language"]', 'zh')
  await new Promise((r) => setTimeout(r, 1200))
  results.push(`  url after zh: ${page.url()}`)
})

// 2. Dashboard: switch via compact dropdown
await step('open /en/dashboard', async () => {
  await page.goto(`${BASE}/en/dashboard`, { waitUntil: 'networkidle0' })
})
await step('dashboard clean (no Math.random hydration)', async () => {
  const body = await page.$eval('body', (el) => el.innerText)
  results.push(`  has 'Research Overview': ${body.includes('Research Overview')}`)
})
await step('dashboard has compact switcher', async () => {
  await page.waitForSelector('button[aria-label="Select language"]', { timeout: 5000 })
})
await step('switch dashboard en -> id', async () => {
  await page.click('button[aria-label="Select language"]')
  await new Promise((r) => setTimeout(r, 300))
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
    const target = btns.find((b) => b.textContent && b.textContent.includes('Bahasa Indonesia'))
    if (target) target.click()
  })
  await new Promise((r) => setTimeout(r, 1200))
  results.push(`  url after id: ${page.url()}`)
})
await step('switch dashboard id -> zh', async () => {
  await page.click('button[aria-label="Select language"]')
  await new Promise((r) => setTimeout(r, 300))
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')]
    const target = btns.find((b) => b.textContent && b.textContent.includes('中文'))
    if (target) target.click()
  })
  await new Promise((r) => setTimeout(r, 1200))
  results.push(`  url after zh: ${page.url()}`)
})

await browser.close()
console.log(results.join('\n'))