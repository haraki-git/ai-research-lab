import puppeteer from 'puppeteer'
import { mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = join(process.cwd(), 'workspace', '20082026', 'qa')

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const matrix = [
  { name: 'en-landing-light-desktop', path: '/en', theme: 'light', width: 1440, height: 900 },
  { name: 'en-landing-light-mobile', path: '/en', theme: 'light', width: 390, height: 844 },
  { name: 'en-landing-dark-desktop', path: '/en', theme: 'dark', width: 1440, height: 900 },
  { name: 'id-dashboard-light-desktop', path: '/id/dashboard', theme: 'light', width: 1440, height: 900 },
  { name: 'id-dashboard-light-mobile', path: '/id/dashboard', theme: 'light', width: 390, height: 844 },
  { name: 'id-dashboard-dark-desktop', path: '/id/dashboard', theme: 'dark', width: 1440, height: 900 },
  { name: 'zh-landing-light-desktop', path: '/zh', theme: 'light', width: 1440, height: 900 },
  { name: 'zh-landing-dark-desktop', path: '/zh', theme: 'dark', width: 1440, height: 900 },
  { name: 'en-builder-light-desktop', path: '/en/assistant/builder', theme: 'light', width: 1440, height: 900 },
  { name: 'en-builder-dark-desktop', path: '/en/assistant/builder', theme: 'dark', width: 1440, height: 900 },
  { name: 'en-builder-light-mobile', path: '/en/assistant/builder', theme: 'light', width: 390, height: 844 },
  { name: 'en-settings-light-desktop', path: '/en/settings', theme: 'light', width: 1440, height: 900 },
  { name: 'en-settings-dark-desktop', path: '/en/settings', theme: 'dark', width: 1440, height: 900 },
  { name: 'en-settings-light-mobile', path: '/en/settings', theme: 'light', width: 390, height: 844 },
  { name: 'en-security-light-desktop', path: '/en/security', theme: 'light', width: 1440, height: 900 },
  { name: 'en-security-dark-desktop', path: '/en/security', theme: 'dark', width: 1440, height: 900 },
  { name: 'en-security-light-mobile', path: '/en/security', theme: 'light', width: 390, height: 844 },
]

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})

const page = await browser.newPage()
const issues = []

page.on('console', (msg) => {
  if (msg.type() === 'error') issues.push(`[console.error] ${msg.text()}`)
})
page.on('pageerror', (err) => issues.push(`[pageerror] ${err.message}`))

for (const { name, path, theme, width, height } of matrix) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.evaluateOnNewDocument((t) => {
    localStorage.setItem('theme', t)
  }, theme)
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 400))

  const lang = await page.$eval('html', (el) => el.getAttribute('lang'))
  const cls = await page.$eval('html', (el) => el.className)
  const h1 = await page.$eval('h1', (el) => el.textContent.trim()).catch(() => '(no h1)')
  const overflow = await page.evaluate(() => {
    const els = [...document.querySelectorAll('body *')]
    return els.filter((el) => el.scrollWidth > el.clientWidth + 2).length
  })

  const file = join(OUT, `${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log(
    `[ok] ${name} | theme=${cls.includes(theme) ? theme : 'MISMATCH'} lang=${lang} h1=${h1.slice(0, 48)} overflow=${overflow}`
  )
}

await browser.close()
if (issues.length) console.log('ISSUES:\n' + issues.join('\n'))
else console.log('NO_CONSOLE_ISSUES')