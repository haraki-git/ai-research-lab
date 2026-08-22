import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sanitize', '--no-sandbox'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errs = []
page.on('console', (m) => {
  if (m.type() === 'error') errs.push(m.text().slice(0, 120))
})

await page.goto('http://localhost:3000/en/dashboard', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 800))

const result = await page.evaluate(() => {
  // Cari metric strip
  const metrics = document.body.innerText
  const hasAll = ['Assistants', 'Experiments', 'Security Tests', 'Findings'].every(label => metrics.includes(label))
  const stripContainers = document.querySelectorAll('.bg-border')
  const cardCount = Array.from(stripContainers).reduce((max, strip) => {
    const children = strip.querySelectorAll(':scope > div').length
    return children > max ? children : max
  }, 0)

  return {
    allLabelsPresent: hasAll,
    metricCardsInStrip: cardCount,
    mainOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
  }
})

console.log('Result:', JSON.stringify(result, null, 2))
console.log('consoleErrors:', errs.length)

// Screenshot
await page.screenshot({
  path: 'workspace/20082026/qa/dashboard-kpi-strip.png',
  fullPage: true
})
console.log('Screenshot saved')

await browser.close()