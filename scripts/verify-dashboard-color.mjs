import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errs = []
page.on('console', (m) => {
  if (m.type() === 'error') errs.push(m.text().slice(0, 120))
})
page.on('pageerror', (e) => {
  errs.push('PAGEERROR: ' + e.message.slice(0, 120))
})

await page.goto('http://localhost:3000/en/dashboard', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1000))

const result = await page.evaluate(() => {
  const body = document.body.innerText
  return {
    hasAssistants: body.includes('12'),
    hasExperiments: body.includes('48'),
    hasSecurityInsights: body.includes('Security Insights'),
    hasMergedSecurity: body.includes('Security Tests'),
    hasMergedFindings: body.includes('findings') || body.includes('Findings'),
    mainOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }
})

console.log('Dashboard Check:', JSON.stringify(result, null, 2))
console.log('consoleErrors:', errs.length)

await page.screenshot({ path: 'workspace/20082026/qa/dashboard-colored-cards.png', fullPage: true })
console.log('Screenshot saved')

await browser.close()