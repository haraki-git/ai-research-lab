import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:3000/en/dashboard', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 800))

const text = await page.evaluate(() => {
  const body = document.body.innerText
  const securityIdx = body.indexOf('Security Insights')
  if (securityIdx === -1) {
    return 'Security Insights NOT found in page'
  }
  const slice = body.slice(securityIdx, securityIdx + 400)
  return slice
})

console.log('Page slice:\n', text)

// Cek label di messages
const fs = await import('node:fs')
const d = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'))
console.log('stats.labels:', JSON.stringify(d.dashboard.stats))
await browser.close()