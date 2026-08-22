import puppeteer from 'puppeteer'

const BASE = 'http://localhost:3000'
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})
const page = await browser.newPage()

for (const loc of ['en', 'id', 'zh']) {
  await page.goto(`${BASE}/${loc}`, { waitUntil: 'networkidle0' })
  const lang = await page.$eval('html', (el) => el.getAttribute('lang'))
  const h1 = await page.$eval('h1', (el) => el.textContent.trim().slice(0, 60))
  const eyebrow = await page.$eval('header + main p', (el) => el.textContent.trim())
  console.log(`[${loc}] lang=${lang} | h1=${h1} | eyebrow=${eyebrow}`)
}

await browser.close()